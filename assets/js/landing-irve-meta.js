(function () {
  "use strict";

  var landingConfig = {
    city: "Montauban",
    radius: "30 km",
    phone: "07 67 97 38 48",
    phoneLink: "tel:0767973848",
    email: "contact@jm-elec.fr",
    formName: "contact-borne-montauban",
    landingCity: "Montauban",
    leadSource: "Meta Ads",
    defaultVariant: "form_first",
    nearbyCities: [
      "Bressols",
      "Montech",
      "Castelsarrasin",
      "Moissac",
      "Nègrepelisse",
      "Labastide-Saint-Pierre",
      "Grisolles",
      "Lafrançaise",
      "Caussade",
      "Fronton",
      "Villemur-sur-Tarn"
    ]
  };

  var PENDING_LEAD_KEY = "jmElecPendingLead";

  function getFieldValue(form, name) {
    var field = form.querySelector('[name="' + name + '"]');
    if (!field) {
      return "";
    }
    if (field.type === "radio") {
      var checked = form.querySelector('[name="' + name + '"]:checked');
      return checked ? checked.value : "";
    }
    return field.value ? field.value.trim() : "";
  }

  function setFieldValue(form, name, value) {
    var field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.value = value || "";
    }
  }

  function isQualifiedLead(data) {
    var vehicle = String(data.vehicle_status || "").toLowerCase();
    return data.home_type === "Oui" &&
      Boolean(data.phone) &&
      Boolean(data.city) &&
      (vehicle === "oui" || vehicle === "bientôt");
  }

  function buildLeadPayload(form, eventId) {
    var tracking = window.JMElecUtm ? window.JMElecUtm.read() : {};
    var data = {
      event_id: eventId,
      created_at: new Date().toISOString(),
      qualified: false,
      custom_data: {
        service: "borne_recharge",
        city: landingConfig.city,
        zone: landingConfig.city + " + " + landingConfig.radius,
        lead_type: "formulaire",
        lead_variant: document.body.getAttribute("data-lead-variant") || landingConfig.defaultVariant,
        home_type: getFieldValue(form, "maison_individuelle"),
        vehicle_status: getFieldValue(form, "vehicule_livre"),
        distance_tableau_stationnement: getFieldValue(form, "distance_tableau_stationnement"),
        utm_source: tracking.utm_source || "",
        utm_medium: tracking.utm_medium || "",
        utm_campaign: tracking.utm_campaign || "",
        utm_content: tracking.utm_content || "",
        utm_term: tracking.utm_term || "",
        fbclid: tracking.fbclid || ""
      },
      user_data: {
        email: getFieldValue(form, "email"),
        phone: getFieldValue(form, "telephone"),
        name: getFieldValue(form, "nom")
      },
      phone: getFieldValue(form, "telephone"),
      city: getFieldValue(form, "ville"),
      home_type: getFieldValue(form, "maison_individuelle"),
      vehicle_status: getFieldValue(form, "vehicule_livre")
    };

    data.qualified = isQualifiedLead(data);
    data.custom_data.form_city = data.city;
    return data;
  }

  function storePendingLead(payload) {
    try {
      sessionStorage.setItem(PENDING_LEAD_KEY, JSON.stringify(payload));
    } catch (error) {
      return false;
    }
    return true;
  }

  function readPendingLead() {
    try {
      return JSON.parse(sessionStorage.getItem(PENDING_LEAD_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  function clearPendingLead() {
    try {
      sessionStorage.removeItem(PENDING_LEAD_KEY);
    } catch (error) {
      return false;
    }
    return true;
  }

  function setupForms() {
    document.querySelectorAll("[data-lead-form]").forEach(function (form) {
      form.addEventListener("submit", function () {
        if (window.JMElecUtm) {
          window.JMElecUtm.fillForm(form, landingConfig.defaultVariant);
        }

        var eventId = window.JMElecMeta ?
          window.JMElecMeta.createEventId("lead") :
          "lead-" + Date.now() + "-" + Math.random().toString(16).slice(2);

        setFieldValue(form, "lead_event_id", eventId);
        storePendingLead(buildLeadPayload(form, eventId));
      });
    });
  }

  function setupPhoneTracking() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("[data-track-phone]");
      if (!link || !window.JMElecMeta) {
        return;
      }

      window.JMElecMeta.trackContact(window.JMElecMeta.createEventId("contact"), {
        service: "borne_recharge",
        city: landingConfig.city,
        zone: landingConfig.city + " + " + landingConfig.radius,
        lead_type: "appel"
      });
    });
  }

  function setupReviewsTracking() {
    document.addEventListener("click", function (event) {
      var link = event.target.closest("[data-track-reviews]");
      if (!link || !window.JMElecMeta) {
        return;
      }
      window.JMElecMeta.trackViewReviews();
    });
  }

  function setupViewContent() {
    var form = document.querySelector("[data-lead-form]");
    if (!form || !("IntersectionObserver" in window)) {
      return;
    }

    var sent = false;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!sent && entry.isIntersecting && window.JMElecMeta) {
          sent = window.JMElecMeta.trackViewContent({
            service: "borne_recharge",
            city: landingConfig.city,
            content_name: "Formulaire devis borne Montauban"
          });
          if (sent) {
            observer.disconnect();
          }
        }
      });
    }, { threshold: 0.35 });

    observer.observe(form);
  }

  function processPendingLead() {
    if (document.body.getAttribute("data-page") !== "thanks") {
      return;
    }

    if (!window.JMElecMeta || !window.JMElecMeta.isReady()) {
      return;
    }

    var pending = readPendingLead();
    if (!pending || !pending.event_id) {
      return;
    }

    var sent = window.JMElecMeta.trackLeadOnce(
      pending.event_id,
      pending.custom_data || {},
      pending.user_data || {}
    );

    if (sent && pending.qualified) {
      window.JMElecMeta.trackQualifiedLead(
        pending.event_id + "-qualified",
        pending.custom_data || {},
        pending.user_data || {}
      );
    }

    if (sent) {
      clearPendingLead();
    }
  }

  function exposeConfig() {
    window.landingConfig = Object.assign({}, landingConfig);
  }

  document.addEventListener("DOMContentLoaded", function () {
    exposeConfig();
    setupForms();
    setupPhoneTracking();
    setupReviewsTracking();
    setupViewContent();
    processPendingLead();
  });

  window.addEventListener("jmElecMetaReady", processPendingLead);
})();
