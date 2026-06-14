(function () {
  var callConversion = "AW-16619605105/CaPtCLWGgL8cEPGY7PQ9";

  window.gtag_report_conversion = function (url) {
    var go = function () {
      if (url) {
        window.location.href = url;
      }
    };

    if (typeof window.gtag !== "function") {
      go();
      return false;
    }

    window.gtag("event", "conversion", {
      send_to: callConversion,
      event_callback: go
    });

    window.setTimeout(go, 900);
    return false;
  };

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-track-call]");
    if (!link) {
      return;
    }

    event.preventDefault();
    window.gtag_report_conversion(link.href);
  });
})();
