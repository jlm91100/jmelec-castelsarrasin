# JM ELEC - Site Castelsarrasin Google Ads

Site statique mobile-first pour `castelsarrasin.jm-elec.fr`.

## Pages

- `index.html`: accueil locale.
- `borne-recharge.html`: landing page IRVE.
- `depannage-electrique.html`: landing page dépannage 7j/7.
- `electricite-generale.html`: landing page travaux électriques.
- `contact.html`: formulaire et contact.
- `merci.html`: page de conversion formulaire.
- `api/send-lead.js`: fonction serverless Vercel qui reçoit le formulaire et envoie la demande par email à `contact@jm-elec.fr` via Resend, puis redirige vers `merci.html`.
- `api/avis-google.js`: fonction serverless Vercel qui récupère les avis Google (Places API New) et renvoie un JSON épuré (sans le nom de la fiche). Affiché sur `index.html` et les 3 landings.

## Avis Google (Vercel)

- La fonction `api/avis-google.js` est exposée automatiquement par Vercel sur `/api/avis-google`. Aucune config (`vercel.json`) nécessaire.
- Variables d'environnement à définir dans le projet Vercel (Settings → Environment Variables) :
  - `GOOGLE_PLACES_API_KEY` (alias acceptés : `GOOGLE_API_KEY`, `GOOGLE_MAPS_API_KEY`, `PLACES_API_KEY`)
  - `GOOGLE_PLACE_ID` (alias accepté : `PLACE_ID`)
  - optionnel : `REVIEWS_MIN_RATING` (défaut 4), `REVIEWS_MAX` (défaut 5)
  - optionnel : `REVIEWS_EXCLUDE` — termes (séparés par virgule) qui excluent un avis si son texte les contient en mot entier. Défaut `91` (masque la mention de la zone Essonne).
- Activer la **Places API (New)** dans Google Cloud. Restreindre la clé par **API = Places API (New)** (sur Vercel les IP sortantes ne sont pas stables, donc la restriction par IP n'est pas fiable sauf egress dédié ; ne pas restreindre par référent HTTP car l'appel est côté serveur).
- L'API Places renvoie **5 avis maximum** ; pour tous les avis il faudrait l'API Business Profile (accès propriétaire).
- Le bloc reste masqué tant que les variables ne sont pas définies ou si l'API ne répond pas (dégradation propre).
- Mise en cache via le CDN Vercel (`Cache-Control: s-maxage=43200`, soit 12 h) : coût API négligeable.

## Formulaire de contact (Resend)

- Les formulaires postent vers `/api/send-lead` qui envoie l'email via Resend puis redirige vers `merci.html`.
- Variables d'environnement Vercel :
  - `RESEND_API_KEY` (obligatoire) — clé API Resend.
  - `LEAD_TO` (optionnel) — destinataire, défaut `contact@jm-elec.fr`.
  - `LEAD_FROM` (optionnel) — expéditeur, **doit être sur le domaine vérifié dans Resend**. Domaine vérifié = `castelsarrasin.jm-elec.fr` → ex. `JM ELEC <no-reply@castelsarrasin.jm-elec.fr>`.
- **Vérifier le domaine `jm-elec.fr` dans Resend** (ajout des enregistrements DNS) pour pouvoir envoyer vers une adresse externe. Sans domaine vérifié, l'expéditeur par défaut `onboarding@resend.dev` ne sert qu'aux tests vers l'adresse du compte Resend.
- En cas d'erreur, redirection vers `contact.html?erreur=telephone|config|envoi`.

## À brancher avant lancement payant

- Définir `GOOGLE_PLACES_API_KEY` et `GOOGLE_PLACE_ID` dans Vercel pour activer les avis Google.
- Définir `RESEND_API_KEY` + vérifier le domaine dans Resend, puis tester l'envoi du formulaire.
- Vérification Google Ads de la balise `AW-16619605105`.
- Numéro de transfert Google pour les composants d'appel.
- Restrictions de la clé Google Maps côté Google Cloud avant toute intégration publique.
- Photos réelles de chantier à la place des placeholders.

## Plan Google Ads

Le plan complet est dans `ads/google-ads-plan-jm-elec.md`.
