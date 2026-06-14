// Fonction serverless Vercel : reception du formulaire de contact et envoi par
// email via Resend. Le formulaire HTML poste en x-www-form-urlencoded ; on
// repond par une redirection (merci.html en cas de succes).
//
// Variables d'environnement attendues sur Vercel :
//   - RESEND_API_KEY   (obligatoire) cle API Resend.
//   - LEAD_TO          (optionnel) destinataire, defaut contact@jm-elec.fr.
//   - LEAD_FROM        (optionnel) expediteur. DOIT etre un domaine verifie dans
//                      Resend pour livrer a une adresse externe, ex :
//                      "JM ELEC <site@jm-elec.fr>". Defaut : onboarding@resend.dev
//                      (sert uniquement aux tests vers l'adresse du compte Resend).

module.exports = async (req, res) => {
  const redirect = (location) => {
    res.statusCode = 303;
    res.setHeader("Location", location);
    res.end();
  };

  if (req.method !== "POST") {
    redirect("/contact.html");
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO || "contact@jm-elec.fr";
  const from = process.env.LEAD_FROM || "JM ELEC <onboarding@resend.dev>";

  const body = req.body || {};
  const clean = (v, max) =>
    String(v == null ? "" : v)
      .replace(/[\r\n]+/g, " ")
      .trim()
      .slice(0, max || 500);

  const service = clean(body.service || "Demande JM ELEC", 120);
  const phone = clean(body.telephone, 40);
  const city = clean(body.ville, 120);
  const page = clean(body.page, 120);
  const message = String(body.message == null ? "" : body.message)
    .trim()
    .slice(0, 1500);

  if (!phone) {
    redirect("/contact.html?erreur=telephone");
    return;
  }

  if (!apiKey) {
    redirect("/contact.html?erreur=config");
    return;
  }

  const subject = "Nouvelle demande JM ELEC - " + service;
  const text =
    "Nouvelle demande depuis le site JM ELEC\n\n" +
    "Service: " + service + "\n" +
    "Telephone: " + phone + "\n" +
    "Ville: " + (city || "Non precisee") + "\n" +
    "Page: " + (page || "Non precisee") + "\n\n" +
    "Message:\n" + (message || "Non precise") + "\n";

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: from,
        to: [to],
        subject: subject,
        text: text,
      }),
    });

    if (!r.ok) {
      let detail = "";
      try { detail = await r.text(); } catch (e) {}
      if (req.query && req.query.debug === "jmelec-diag") {
        res.setHeader("Content-Type", "application/json; charset=utf-8");
        res.status(200).json({ resendStatus: r.status, resendError: detail, from: from, to: to });
        return;
      }
      redirect("/contact.html?erreur=envoi");
      return;
    }

    redirect("/merci.html");
  } catch (e) {
    if (req.query && req.query.debug === "jmelec-diag") {
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.status(200).json({ exception: String(e && e.message ? e.message : e), from: from, to: to });
      return;
    }
    redirect("/contact.html?erreur=envoi");
  }
};
