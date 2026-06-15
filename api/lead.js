const { URLSearchParams } = require("url");

const THANK_YOU_URL = "/merci-demande-borne.html";

function htmlEscape(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.destroy();
        reject(new Error("Body too large"));
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function parseBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    const contentType = req.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      return JSON.parse(req.body || "{}");
    }
    return Object.fromEntries(new URLSearchParams(req.body).entries());
  }

  const raw = await readRawBody(req);
  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("application/json")) {
    return JSON.parse(raw || "{}");
  }

  const params = new URLSearchParams(raw);
  return Object.fromEntries(params.entries());
}

function buildEmailHtml(lead) {
  const rows = [
    ["Nom", lead.nom],
    ["Téléphone", lead.telephone],
    ["Email", lead.email],
    ["Ville", lead.ville],
    ["Maison individuelle", lead.maison_individuelle],
    ["Véhicule livré", lead.vehicule_livre],
    ["Distance tableau / stationnement", lead.distance_tableau_stationnement],
    ["Message", lead.message],
    ["Source", lead.lead_source],
    ["Variant", lead.lead_variant],
    ["Page", lead.landing_page_url],
    ["UTM source", lead.utm_source],
    ["UTM medium", lead.utm_medium],
    ["UTM campaign", lead.utm_campaign],
    ["UTM content", lead.utm_content],
    ["UTM term", lead.utm_term],
    ["fbclid", lead.fbclid],
    ["Event ID", lead.lead_event_id]
  ];

  return `
    <h1>Nouveau lead borne de recharge - Montauban</h1>
    <p>Demande reçue depuis la landing Meta Ads JM ELEC.</p>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#e5e7eb">
      ${rows.map(([label, value]) => `
        <tr>
          <th align="left" style="background:#f7f8fa">${htmlEscape(label)}</th>
          <td>${htmlEscape(value || "-")}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

function buildTextEmail(lead) {
  return [
    "Nouveau lead borne de recharge - Montauban",
    "",
    `Nom: ${lead.nom || "-"}`,
    `Téléphone: ${lead.telephone || "-"}`,
    `Email: ${lead.email || "-"}`,
    `Ville: ${lead.ville || "-"}`,
    `Maison individuelle: ${lead.maison_individuelle || "-"}`,
    `Véhicule livré: ${lead.vehicule_livre || "-"}`,
    `Distance tableau / stationnement: ${lead.distance_tableau_stationnement || "-"}`,
    `Message: ${lead.message || "-"}`,
    "",
    `UTM source: ${lead.utm_source || "-"}`,
    `UTM medium: ${lead.utm_medium || "-"}`,
    `UTM campaign: ${lead.utm_campaign || "-"}`,
    `UTM content: ${lead.utm_content || "-"}`,
    `UTM term: ${lead.utm_term || "-"}`,
    `fbclid: ${lead.fbclid || "-"}`,
    `Event ID: ${lead.lead_event_id || "-"}`
  ].join("\n");
}

async function sendWithResend(lead) {
  if (process.env.LEAD_DRY_RUN === "true") {
    console.log("LEAD_DRY_RUN enabled. Email skipped for:", {
      phone: Boolean(lead.telephone),
      city: lead.ville || "",
      eventId: lead.lead_event_id || ""
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEAD_EMAIL_TO || "contact@jm-elec.fr";

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and RESEND_FROM must be configured in Vercel.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: lead.email || undefined,
      subject: "Nouveau devis borne de recharge - Montauban",
      html: buildEmailHtml(lead),
      text: buildTextEmail(lead)
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Resend failed: ${text}`);
  }
}

function redirect(res, location) {
  // Un POST de formulaire suivi d'un 303 vers une page statique provoque, dans un
  // vrai navigateur, un RE-POST de cette page (-> HTTP 405, car un fichier .html
  // statique n'accepte que GET). On renvoie donc une page 200 qui redirige
  // cote client, en GET, vers la page de remerciement.
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const target = htmlEscape(location);
  res.end(
    "<!doctype html><html lang=\"fr\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
    "<meta http-equiv=\"refresh\" content=\"0; url=" + target + "\">" +
    "<title>Redirection…</title></head><body>" +
    "<script>window.location.replace(" + JSON.stringify(location) + ");</script>" +
    "<p>Votre demande a bien été envoyée. <a href=\"" + target + "\">Continuer</a></p>" +
    "</body></html>"
  );
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end("Method not allowed");
    return;
  }

  try {
    const lead = await parseBody(req);

    if (lead["bot-field"]) {
      redirect(res, THANK_YOU_URL);
      return;
    }

    if (!lead.nom || !lead.telephone || !lead.ville) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end("<h1>Demande incomplète</h1><p>Merci de renseigner votre nom, téléphone et ville.</p>");
      return;
    }

    await sendWithResend(lead);

    const target = new URL(THANK_YOU_URL, `https://${req.headers.host || "localhost"}`);
    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "fbclid",
      "landing_city",
      "lead_source"
    ].forEach((key) => {
      if (lead[key]) {
        target.searchParams.set(key, lead[key]);
      }
    });

    redirect(res, target.pathname + target.search);
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.end(
      "<h1>Formulaire temporairement indisponible</h1>" +
      "<p>Merci d’appeler JM ELEC au <a href=\"tel:0767973848\">07 67 97 38 48</a>.</p>"
    );
  }
};
