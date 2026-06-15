(function () {
  "use strict";

  var META_PIXEL_ID = "1647777846339180";
  var CONSENT_BANNER_ENABLED = true;
  var CONSENT_KEY = "jmElecMetaAdsConsent";
  var ENABLE_CAPI_FORWARDING = false;
  var META_CAPI_ENDPOINT = "/api/meta-capi";

  var pixelLoaded = false;
  var pageViewSent = false;

  function hasPixelId() {
    return META_PIXEL_ID && META_PIXEL_ID !== "A_REMPLACER";
  }

  function createEventId(prefix) {
    var id = "";
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      id = window.crypto.randomUUID();
    } else {
      id = String(Date.now()) + "-" + Math.random().toString(16).slice(2);
    }
    return (prefix || "event") + "-" + id;
  }

  function consentValue() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (error) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch (error) {
      return false;
    }
    return true;
  }

  function dispatchReady() {
    window.dispatchEvent(new CustomEvent("jmElecMetaReady"));
  }

  function loadPixel() {
    if (pixelLoaded || !hasPixelId()) {
      if (pixelLoaded) {
        dispatchReady();
      }
      return;
    }

    /* Meta Pixel base code, loaded only after consent. */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) {
        return;
      }
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) {
        f._fbq = n;
      }
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", META_PIXEL_ID);
    pixelLoaded = true;
    sendPageView();
    dispatchReady();
  }

  function sendPageView() {
    if (pageViewSent || !pixelLoaded || typeof window.fbq !== "function") {
      return;
    }
    window.fbq("track", "PageView");
    pageViewSent = true;
  }

  function track(name, data, options, custom) {
    if (!pixelLoaded || typeof window.fbq !== "function") {
      return false;
    }
    if (custom) {
      window.fbq("trackCustom", name, data || {}, options || {});
    } else {
      window.fbq("track", name, data || {}, options || {});
    }
    return true;
  }

  function sendServerEvent(payload) {
    if (!ENABLE_CAPI_FORWARDING || !META_CAPI_ENDPOINT || !window.fetch) {
      return;
    }

    window.fetch(META_CAPI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify(payload)
    }).catch(function () {
      return false;
    });
  }

  function trackLeadOnce(eventId, customData, userData) {
    var id = eventId || createEventId("lead");
    var key = "jmElecLeadTracked:" + id;

    try {
      if (localStorage.getItem(key)) {
        return false;
      }
    } catch (error) {
      return false;
    }

    if (!track("Lead", customData || {}, { eventID: id }, false)) {
      return false;
    }

    try {
      localStorage.setItem(key, "1");
    } catch (error) {
      return true;
    }

    sendServerEvent({
      event_name: "Lead",
      event_id: id,
      event_source_url: window.location.href,
      user_data: userData || {},
      custom_data: customData || {}
    });

    return true;
  }

  function trackQualifiedLead(eventId, customData, userData) {
    var id = eventId || createEventId("qualified-lead");
    if (!track("QualifiedLead", customData || {}, { eventID: id }, true)) {
      return false;
    }

    sendServerEvent({
      event_name: "QualifiedLead",
      event_id: id,
      event_source_url: window.location.href,
      user_data: userData || {},
      custom_data: customData || {}
    });

    return true;
  }

  function removeBanner() {
    var banner = document.querySelector("[data-cookie-banner]");
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }

  function renderConsentBanner() {
    if (!CONSENT_BANNER_ENABLED || consentValue()) {
      return;
    }

    var banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.setAttribute("data-cookie-banner", "");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Consentement publicitaire");
    banner.innerHTML =
      '<p>JM ELEC utilise le suivi Meta Ads pour mesurer les demandes issues des publicités. Le formulaire fonctionne même si vous refusez.</p>' +
      '<div class="cookie-actions">' +
      '<button class="cookie-accept" type="button" data-cookie-accept>Accepter</button>' +
      '<button class="cookie-refuse" type="button" data-cookie-refuse>Refuser</button>' +
      "</div>";

    banner.addEventListener("click", function (event) {
      if (event.target.matches("[data-cookie-accept]")) {
        saveConsent("accepted");
        removeBanner();
        loadPixel();
      }
      if (event.target.matches("[data-cookie-refuse]")) {
        saveConsent("refused");
        removeBanner();
      }
    });

    document.body.appendChild(banner);
  }

  function init() {
    if (!CONSENT_BANNER_ENABLED || consentValue() === "accepted") {
      loadPixel();
      return;
    }
    renderConsentBanner();
  }

  window.JMElecMeta = {
    init: init,
    accept: function () {
      saveConsent("accepted");
      removeBanner();
      loadPixel();
    },
    refuse: function () {
      saveConsent("refused");
      removeBanner();
    },
    isReady: function () {
      return pixelLoaded;
    },
    createEventId: createEventId,
    trackViewContent: function (data) {
      return track("ViewContent", data || {}, {}, false);
    },
    trackContact: function (eventId, customData) {
      var id = eventId || createEventId("contact");
      var data = customData || {};
      var sent = track("Contact", data, { eventID: id }, false);
      if (sent) {
        sendServerEvent({
          event_name: "Contact",
          event_id: id,
          event_source_url: window.location.href,
          custom_data: data
        });
      }
      return sent;
    },
    trackViewReviews: function () {
      return track("ViewReviews", { service: "borne_recharge", city: "Montauban" }, {}, true);
    },
    trackLeadOnce: trackLeadOnce,
    trackQualifiedLead: trackQualifiedLead
  };

  document.addEventListener("DOMContentLoaded", init);
})();
