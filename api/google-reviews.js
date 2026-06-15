const CACHE_TTL_MS = 1000 * 60 * 60 * 6;

let cachedResponse = null;
let cachedAt = 0;

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=900, stale-while-revalidate=3600");
  res.end(JSON.stringify(body));
}

function normalizeReview(review) {
  return {
    author:
      (review.authorAttribution && review.authorAttribution.displayName) ||
      review.author_name ||
      "Client Google",
    rating: review.rating || 0,
    relativeTime:
      review.relativePublishTimeDescription ||
      review.relative_time_description ||
      "",
    text:
      (review.text && review.text.text) ||
      (review.originalText && review.originalText.text) ||
      review.text ||
      ""
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET");
    res.end("Method not allowed");
    return;
  }

  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.PLACES_API_KEY;

  const placeId = process.env.GOOGLE_PLACE_ID || process.env.PLACE_ID;

  if (!apiKey || !placeId) {
    sendJson(res, 503, {
      error: "GOOGLE_API_KEY and GOOGLE_PLACE_ID must be configured server-side."
    });
    return;
  }

  if (cachedResponse && Date.now() - cachedAt < CACHE_TTL_MS) {
    sendJson(res, 200, cachedResponse);
    return;
  }

  const url = new URL(
    "https://places.googleapis.com/v1/places/" + encodeURIComponent(placeId)
  );
  url.searchParams.set("languageCode", "fr");

  const response = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews"
    }
  });
  if (!response.ok) {
    sendJson(res, 502, { error: "Google Places API request failed." });
    return;
  }

  const data = await response.json();
  if (!data) {
    sendJson(res, 502, {
      error: "Google Places API returned no place details."
    });
    return;
  }

  cachedResponse = {
    rating: typeof data.rating === "number" ? Math.round(data.rating * 10) / 10 : null,
    ratingCount: data.userRatingCount || 0,
    mapsUri: data.googleMapsUri || "",
    reviews: (data.reviews || []).slice(0, 3).map(normalizeReview)
  };
  cachedAt = Date.now();

  sendJson(res, 200, cachedResponse);
};
