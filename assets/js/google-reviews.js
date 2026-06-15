(function () {
  "use strict";

  var GOOGLE_PLACE_ID = "ChIJo-IoGS2iGQoRfvlWr5k0EDs";
  var GOOGLE_API_KEY = "A_REMPLACER";
  var ALLOW_FRONTEND_GOOGLE_KEY = false;
  var MAX_REVIEWS = 3;

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stars(rating) {
    var rounded = Math.round(Number(rating) || 0);
    var output = "";
    for (var i = 0; i < 5; i += 1) {
      output += i < rounded ? "★" : "☆";
    }
    return output;
  }

  function renderFallback(root) {
    var summary = root.querySelector("[data-reviews-summary]");
    var list = root.querySelector("[data-reviews-list]");

    if (summary) {
      summary.innerHTML = '<p class="reviews-fallback">Les avis clients sont consultables sur la fiche Google de JM ELEC.</p>';
    }
    if (list) {
      list.innerHTML =
        '<article class="review-placeholder">L’intégration automatique des avis Google est prête. Aucun faux avis n’est affiché si l’API ne répond pas.</article>';
    }
  }

  function renderReviews(root, data) {
    var summary = root.querySelector("[data-reviews-summary]");
    var list = root.querySelector("[data-reviews-list]");
    var link = root.querySelector("[data-reviews-link]");
    var reviews = Array.isArray(data.reviews) ? data.reviews.slice(0, MAX_REVIEWS) : [];

    if (summary && data.rating) {
      summary.innerHTML =
        '<span class="reviews-score">' + Number(data.rating).toFixed(1) + "</span>" +
        '<span class="reviews-stars" aria-label="' + escapeHtml(data.rating) + ' sur 5">' + stars(data.rating) + "</span>" +
        '<span class="reviews-count">' + escapeHtml(data.ratingCount || 0) + " avis Google</span>";
    }

    if (list && reviews.length) {
      list.innerHTML = reviews.map(function (review) {
        return (
          '<article class="review-card">' +
          '<p class="review-author">' + escapeHtml(review.author) + "</p>" +
          '<p class="reviews-stars" aria-label="' + escapeHtml(review.rating) + ' sur 5">' + stars(review.rating) + "</p>" +
          '<p class="review-text">' + escapeHtml(review.text) + "</p>" +
          "</article>"
        );
      }).join("");
    }

    if (link && data.mapsUri) {
      link.href = data.mapsUri;
    }
  }

  function buildDirectGoogleUrl() {
    if (!ALLOW_FRONTEND_GOOGLE_KEY || GOOGLE_PLACE_ID === "A_REMPLACER" || GOOGLE_API_KEY === "A_REMPLACER") {
      return "";
    }

    var url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", GOOGLE_PLACE_ID);
    url.searchParams.set("fields", "rating,user_ratings_total,reviews,url");
    url.searchParams.set("language", "fr");
    url.searchParams.set("key", GOOGLE_API_KEY);
    return url.toString();
  }

  function loadReviews(root) {
    var endpoint = root.getAttribute("data-endpoint") || "/api/google-reviews";
    var directUrl = buildDirectGoogleUrl();
    var url = directUrl || endpoint;

    window.fetch(url, { headers: { Accept: "application/json" } })
      .then(function (response) {
        if (!response.ok) {
          return Promise.reject(new Error("reviews unavailable"));
        }
        return response.json();
      })
      .then(function (data) {
        if (data && data.result && directUrl) {
          data = {
            rating: data.result.rating,
            ratingCount: data.result.user_ratings_total,
            mapsUri: data.result.url,
            reviews: (data.result.reviews || []).map(function (review) {
              return {
                author: review.author_name,
                rating: review.rating,
                text: review.text
              };
            })
          };
        }

        if (!data || !Array.isArray(data.reviews) || !data.reviews.length) {
          return Promise.reject(new Error("empty reviews"));
        }
        renderReviews(root, data);
      })
      .catch(function () {
        renderFallback(root);
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-google-reviews]");
    if (!root || !window.fetch) {
      return;
    }

    var delay = window.requestIdleCallback || function (callback) {
      return window.setTimeout(callback, 900);
    };

    delay(function () {
      loadReviews(root);
    });
  });
})();
