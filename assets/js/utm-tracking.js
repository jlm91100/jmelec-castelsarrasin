(function () {
  "use strict";

  var STORAGE_KEY = "jmElecMetaLandingTracking";
  var TRACKING_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "fbclid"
  ];

  function readStored() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch (error) {
      return {};
    }
  }

  function writeStored(values) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    } catch (error) {
      return false;
    }
    return true;
  }

  function capture() {
    var params = new URLSearchParams(window.location.search);
    var values = readStored();
    var changed = false;

    TRACKING_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        values[key] = value;
        changed = true;
      }
    });

    values.landing_page_url = window.location.href.split("#")[0];
    values.landing_city = "Montauban";
    values.lead_source = "Meta Ads";

    if (changed || !readStored().landing_page_url) {
      writeStored(values);
    }

    return values;
  }

  function setField(form, name, value) {
    var field = form.querySelector('[name="' + name + '"]');
    if (field) {
      field.value = value || "";
    }
  }

  function appendTrackingToAction(form, values) {
    var target = form.getAttribute("data-thank-you") || form.getAttribute("action");
    if (!target) {
      return;
    }

    var url = new URL(target, window.location.origin);
    TRACKING_KEYS.forEach(function (key) {
      if (values[key]) {
        url.searchParams.set(key, values[key]);
      }
    });
    url.searchParams.set("landing_city", "Montauban");
    url.searchParams.set("lead_source", "Meta Ads");

    form.setAttribute("action", url.pathname + url.search);
  }

  function fillForm(form, variant) {
    var values = capture();
    var leadVariant = variant || document.body.getAttribute("data-lead-variant") || "form_first";

    TRACKING_KEYS.forEach(function (key) {
      setField(form, key, values[key]);
    });
    setField(form, "landing_city", "Montauban");
    setField(form, "landing_page_url", values.landing_page_url);
    setField(form, "lead_source", "Meta Ads");
    setField(form, "lead_variant", leadVariant);

    appendTrackingToAction(form, values);
  }

  window.JMElecUtm = {
    capture: capture,
    fillForm: fillForm,
    read: function () {
      return Object.assign({}, readStored(), capture());
    },
    keys: TRACKING_KEYS.slice()
  };

  document.addEventListener("DOMContentLoaded", function () {
    capture();
    document.querySelectorAll("[data-lead-form]").forEach(function (form) {
      fillForm(form);
    });
  });
})();
