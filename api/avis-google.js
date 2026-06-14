// Fonction serverless Vercel : avis Google via Places API (New).
// La cle API reste cote serveur (variable d'environnement Vercel), jamais dans le HTML.
// Le NOM DE LA FICHE n'est ni demande a l'API, ni renvoye ici.
//
// Variables d'environnement attendues sur Vercel :
//   - GOOGLE_PLACES_API_KEY  (alias acceptes : GOOGLE_API_KEY, GOOGLE_MAPS_API_KEY, PLACES_API_KEY)
//   - GOOGLE_PLACE_ID        (alias accepte  : PLACE_ID)
// Optionnel :
//   - REVIEWS_MIN_RATING (defaut 4)
//   - REVIEWS_MAX        (defaut 5, max 5 cote API)

module.exports = async (req, res) => {
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.PLACES_API_KEY;

  const placeId = process.env.GOOGLE_PLACE_ID || process.env.PLACE_ID;

  const minRating = Number(process.env.REVIEWS_MIN_RATING || 4);
  const maxReviews = Number(process.env.REVIEWS_MAX || 5);
  // Exclut un avis si son texte contient un de ces termes (mot entier),
  // ex. masquer la mention d'une autre zone. Configurable via REVIEWS_EXCLUDE.
  const excludeTerms = (process.env.REVIEWS_EXCLUDE || "91")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const isExcluded = (txt) => {
    const t = String(txt || "").toLowerCase();
    return excludeTerms.some((term) => {
      const esc = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp("\\b" + esc + "\\b").test(t);
    });
  };

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  if (!apiKey || !placeId) {
    res.status(500).json({ error: "config_incomplete" });
    return;
  }

  const url =
    "https://places.googleapis.com/v1/places/" +
    encodeURIComponent(placeId) +
    "?languageCode=fr";

  try {
    const r = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
    });

    if (!r.ok) {
      res.status(502).json({ error: "fetch_failed", status: r.status });
      return;
    }

    const data = await r.json();

    const reviews = (data.reviews || [])
      .filter((rv) => (rv.rating || 0) >= minRating)
      .filter(
        (rv) =>
          !isExcluded(
            (rv.text && rv.text.text) ||
              (rv.originalText && rv.originalText.text) ||
              ""
          )
      )
      .slice(0, maxReviews)
      .map((rv) => ({
        author:
          (rv.authorAttribution && rv.authorAttribution.displayName) ||
          "Client Google",
        photo: (rv.authorAttribution && rv.authorAttribution.photoUri) || "",
        rating: rv.rating || 0,
        text:
          (rv.text && rv.text.text) ||
          (rv.originalText && rv.originalText.text) ||
          "",
        relativeTime: rv.relativePublishTimeDescription || "",
      }));

    const out = {
      rating:
        typeof data.rating === "number"
          ? Math.round(data.rating * 10) / 10
          : null,
      ratingCount: data.userRatingCount || 0,
      mapsUri: data.googleMapsUri || "",
      reviews,
    };

    // Cache CDN Vercel : 12 h, puis rafraichissement en arriere-plan.
    res.setHeader(
      "Cache-Control",
      "s-maxage=43200, stale-while-revalidate=86400"
    );
    res.status(200).json(out);
  } catch (e) {
    res.status(502).json({ error: "fetch_failed" });
  }
};
