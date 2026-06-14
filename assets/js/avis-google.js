(function () {
  var root = document.querySelector("[data-google-reviews]");
  if (!root) {
    return;
  }

  var endpoint = root.getAttribute("data-endpoint") || "/api/avis-google";

  function stars(n) {
    var full = Math.round(n);
    var s = "";
    for (var i = 0; i < 5; i++) {
      s += i < full ? "★" : "☆";
    }
    return s;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/);
    var a = parts[0] ? parts[0].charAt(0) : "?";
    var b = parts[1] ? parts[1].charAt(0) : "";
    return (a + b).toUpperCase();
  }

  fetch(endpoint, { headers: { Accept: "application/json" } })
    .then(function (r) {
      return r.ok ? r.json() : Promise.reject();
    })
    .then(function (data) {
      if (!data || !data.reviews || !data.reviews.length) {
        return Promise.reject();
      }
      render(data);
      root.hidden = false;
    })
    .catch(function () {
      // Pas d'avis disponibles ou endpoint non configure : on retire la section.
      if (root.parentNode) {
        root.parentNode.removeChild(root);
      }
    });

  function render(data) {
    var summary = root.querySelector("[data-reviews-summary]");
    if (summary && data.rating) {
      summary.innerHTML =
        '<span class="reviews-score">' + data.rating.toFixed(1) + "</span>" +
        '<span class="reviews-score-stars" aria-hidden="true">' + stars(data.rating) + "</span>" +
        '<span class="reviews-score-count">' + data.ratingCount + " avis Google</span>";
    }

    var list = root.querySelector("[data-reviews-list]");
    if (list) {
      list.innerHTML = data.reviews
        .map(function (rv) {
          var avatar = rv.photo
            ? '<img class="review-avatar" src="' + escapeHtml(rv.photo) +
              '" width="44" height="44" loading="lazy" alt="" referrerpolicy="no-referrer">'
            : '<span class="review-avatar review-avatar-fallback" aria-hidden="true">' +
              escapeHtml(initials(rv.author)) + "</span>";
          return (
            '<article class="review-card">' +
              '<header class="review-head">' +
                avatar +
                "<div>" +
                  '<p class="review-author">' + escapeHtml(rv.author) + "</p>" +
                  '<p class="review-meta">' +
                    '<span class="stars" aria-label="' + rv.rating + ' sur 5">' + stars(rv.rating) + "</span> " +
                    '<span class="review-time">' + escapeHtml(rv.relativeTime) + "</span>" +
                  "</p>" +
                "</div>" +
              "</header>" +
              '<p class="review-text">' + escapeHtml(rv.text) + "</p>" +
            "</article>"
          );
        })
        .join("");
    }

    var link = root.querySelector("[data-reviews-link]");
    if (link && data.mapsUri) {
      link.href = data.mapsUri;
      link.hidden = false;
    }
  }
})();
