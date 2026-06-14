# Plan Google Ads, SEO local et CRO - JM ELEC Montauban / Castelsarrasin

## Sources Google consultées

- Responsive Search Ads: jusqu'à 15 titres et 4 descriptions, limites 30 caractères par titre et 90 par description.
  https://support.google.com/google-ads/answer/7684791?hl=fr
- Quality Score: CTR attendu, pertinence de l'annonce et expérience sur la page de destination.
  https://support.google.com/google-ads/answer/6167118?hl=fr
- Installation de la balise Google.
  https://developers.google.com/tag-platform/gtagjs/install?hl=fr
- Extensions et composants Google Ads à utiliser: appel, liens annexes, accroches et extraits structurés.
  https://support.google.com/google-ads/answer/2375416?hl=fr

## Identité issue du logo

Couleurs exactes extraites du PNG HQ:

| Usage | Couleur | Hex |
| --- | --- | --- |
| Jaune principal JM | Jaune électrique | `#FBC01E` |
| Texte logo | Noir pur | `#000000` |
| Fond et respiration | Blanc | `#FFFFFF` |
| Texte site | Noir doux | `#151515` |
| Texte secondaire | Gris technique | `#5F6875` |
| Accent confiance | Bleu service | `#1D4ED8` |
| Accent validation | Vert technique | `#0F766E` |

Typographies:

- Logo: lettrage sur mesure, très gras, géométrique, industriel, avec éclair intégré dans le monogramme JM.
- Site: police système sans-serif pour vitesse maximale, graisses 700 à 900 pour rappeler le logo sans charger de police externe.
- Hiérarchie: H1 très fort, prix visible juste sous la promesse, CTA téléphone en jaune, garanties immédiatement après.

Style graphique:

- Contraste noir, blanc, jaune pour un signal "électricité" immédiat.
- Angles à 8 px maximum, rendu professionnel et direct.
- Pas de décor inutile: chaque bloc sert la confiance, le SEO local ou la conversion.
- Photos réelles intégrées: bornes IRVE, tableaux électriques, gaines en chantier et éclairages finis.

## Architecture du site livré

- `index.html`: page de secours, pas la page prioritaire pour Google Ads.
- `borne-recharge.html`: landing page campagne IRVE, Montauban + Castelsarrasin.
- `depannage-electrique.html`: landing page campagne dépannage, Montauban + Castelsarrasin.
- `electricite-generale.html`: landing page campagne électricité générale, Montauban + Castelsarrasin.
- `contact.html`: contact et formulaire court.
- `merci.html`: page de conversion formulaire, noindex.
- `api/send-lead.js`: fonction serverless Vercel, envoi des demandes à `contact@jm-elec.fr` via Resend.
- `api/avis-google.js`: fonction serverless Vercel, avis Google via Places API (clé en variable d'environnement, sans afficher le nom de la fiche).

Mesure Google Ads:

- Balise Google `AW-16619605105` ajoutée sur les pages.
- Conversion appel direct `AW-16619605105/CaPtCLWGgL8cEPGY7PQ9` déclenchée au clic sur les liens téléphone.
- Conversion formulaire `AW-16619605105/dCJTCLKGgL8cEPGY7PQ9` déclenchée sur `merci.html`.

Points à finaliser avant lancement:

- Définir `RESEND_API_KEY` (et vérifier le domaine dans Resend), puis tester l'envoi du formulaire vers `contact@jm-elec.fr`.
- Vérifier la balise dans Google Ads après mise en ligne.
- Activer le numéro de transfert Google dans les composants d'appel.
- Restreindre la clé Google Maps par domaine, API et quota. Ne pas exposer une clé non restreinte.
- Pour les avis Google: utiliser un endpoint serveur. Ne pas afficher la clé API dans le HTML public. Le Place ID suffit pour lire des avis Places, mais l'API Business Profile nécessite les accès du compte et de l'établissement.

## Budget conseillé

Budget total: 1000 €/mois, soit environ 33 €/jour.

| Campagne | Budget mensuel | Budget jour | Raison |
| --- | ---: | ---: | --- |
| Bornes de recharge IRVE | 450 € | 15,00 € | Valeur panier élevée, intention forte, différenciation IRVE/RGE. |
| Dépannage électrique | 350 € | 11,70 € | Besoin immédiat, appels rapides, forte conversion si zone serrée. |
| Électricité générale | 200 € | 6,60 € | Volume utile mais intention plus large, à contrôler avec négatifs. |

Paramètres communs:

- Réseau: Search uniquement au lancement.
- Zone: Montauban + Castelsarrasin + rayon maîtrisé, ciblage "présence" uniquement.
- Langue: français.
- Appareils: mobile prioritaire, ajuster après données.
- Mots-clés: exact et expression au lancement, avec groupes séparés Montauban / Castelsarrasin si le budget le permet.
- Enchères: commencer avec Maximiser les clics avec CPC max si peu de données, puis passer à Maximiser les conversions quand les conversions sont fiables.

## Négatifs partagés

À ajouter en liste partagée dès le lancement:

`emploi`, `recrutement`, `formation`, `salaire`, `stage`, `apprentissage`, `diplome`, `pdf`, `schema`, `cours`, `gratuit`, `occasion`, `pas cher matériel`, `amazon`, `leroy merlin`, `castorama`, `brico depot`, `forum`, `youtube`, `comment faire`, `soi meme`, `brétigny`, `bretigny`, `orge`, `essonne`, `91`, `paris`, `lyon`, `toulouse emploi`.

## Campagne 1 - Bornes de recharge IRVE

Nom conseillé: `S - IRVE - Montauban Castelsarrasin`

URL finale: `https://castelsarrasin.jm-elec.fr/borne-recharge.html`

Objectif: demandes de devis qualifiées pour installation de borne à partir de 1299 €.

Ne pas envoyer cette campagne vers l'accueil. La requête "borne de recharge" doit arriver directement sur cette page.

Groupes d'annonces:

| Groupe | Mots-clés |
| --- | --- |
| Borne Montauban | `[borne recharge montauban]`, `"borne recharge montauban"`, `[installation borne recharge montauban]`, `"installateur borne montauban"` |
| Borne Castelsarrasin | `[borne recharge castelsarrasin]`, `"borne recharge castelsarrasin"`, `[installation borne recharge castelsarrasin]`, `"installateur borne castelsarrasin"` |
| Installateur IRVE | `[installateur irve]`, `"installateur irve montauban"`, `"installateur irve castelsarrasin"`, `"electricien borne recharge"` |
| Borne domicile | `[borne recharge maison]`, `"pose borne recharge domicile"`, `"borne voiture electrique maison"`, `"wallbox domicile"` |
| Pro et copropriété | `"borne recharge entreprise"`, `"borne recharge copropriete"`, `"installation borne parking"`, `"borne recharge flotte"` |

Négatifs spécifiques IRVE:

`borne publique`, `station recharge`, `carte recharge`, `charge gratuite`, `supercharger`, `ionity`, `cable`, `adaptateur`, `prise renforcée seule`, `comparatif borne`, `avis wallbox`, `mode emploi`.

### RSA - Bornes IRVE

Titres validés, tous <= 30 caractères:

| # | Titre | Longueur |
| ---: | --- | ---: |
| 1 | Borne Recharge 82 | 17 |
| 2 | Installateur IRVE | 17 |
| 3 | Borne Voiture Elec | 18 |
| 4 | Devis Borne Rapide | 18 |
| 5 | JM ELEC Montauban | 17 |
| 6 | Borne dès 1299€ | 15 |
| 7 | Électricien IRVE | 16 |
| 8 | Montauban IRVE | 14 |
| 9 | Pose Borne Qualifiée | 20 |
| 10 | Recharge À Domicile | 19 |
| 11 | Borne Copropriété | 17 |
| 12 | Devis Gratuit Borne | 19 |
| 13 | IRVE Certifié RGE | 17 |
| 14 | Installation Sécurisée | 22 |
| 15 | Appelez JM ELEC | 15 |

Descriptions validées, toutes <= 90 caractères:

| # | Description | Longueur |
| ---: | --- | ---: |
| 1 | Installez votre borne IRVE à Montauban. Devis clair, pose dès 1299€. | 68 |
| 2 | Montauban, Castelsarrasin: JM ELEC sécurise votre recharge. | 59 |
| 3 | Conseil, matériel adapté et installation conforme par électricien certifié IRVE. | 80 |
| 4 | Appelez le 07 67 97 38 48 pour une étude rapide dans le secteur. | 64 |

Extensions:

- Appel: `07 67 97 38 48`, avec numéro de transfert Google.
- Accroches: `Certifié IRVE`, `RGE`, `Qualifelec`, `Dès 1299€`, `Devis clair`, `Décennale`.
- Liens annexes:
  - `Borne de recharge` -> `/borne-recharge.html`
  - `Demander un devis` -> `/contact.html`
  - `Dépannage électrique` -> `/depannage-electrique.html`
  - `Électricité générale` -> `/electricite-generale.html`
- Extraits structurés:
  - Services: `Maison`, `Entreprise`, `Copropriété`, `Parking`, `Tableau`.
  - Certifications: `IRVE`, `RGE`, `Qualifelec`, `Décennale`, `RC Pro`.

Landing page dédiée:

- Hero: "Borne de recharge à Montauban et Castelsarrasin", prix dès 1299 €, CTA appel et devis.
- Arguments: certification IRVE, étude du tableau, protection dédiée, usage maison/pro/copro.
- Réassurance: RGE, Qualifelec, décennale, RC Pro, zone locale.
- Photos: borne posée, protection tableau, véhicule en charge.
- FAQ: prix, certification IRVE, copropriété.
- Formulaire: nom, téléphone, ville, profil, besoin.
- CTA: appel direct et formulaire devis.

## Campagne 2 - Dépannage électrique

Nom conseillé: `S - Dépannage - Montauban Castelsarrasin`

URL finale: `https://castelsarrasin.jm-elec.fr/depannage-electrique.html`

Objectif: appels téléphoniques immédiats pour dépannage 7j/7 dès 130 €.

Ne pas envoyer cette campagne vers l'accueil. La page doit ouvrir directement sur l'appel et le rappel.

Groupes d'annonces:

| Groupe | Mots-clés |
| --- | --- |
| Dépannage Montauban | `[depannage electrique montauban]`, `"depannage electrique montauban"`, `[electricien depannage montauban]`, `"electricien urgence montauban"` |
| Dépannage Castelsarrasin | `[depannage electrique castelsarrasin]`, `"depannage electrique castelsarrasin"`, `[electricien depannage castelsarrasin]`, `"electricien urgence castelsarrasin"` |
| Panne de courant | `[panne courant maison]`, `"panne de courant maison"`, `"plus de courant maison"`, `"recherche panne electrique"` |
| Tableau disjoncte | `[tableau electrique disjoncte]`, `"disjoncteur saute"`, `"differentiel disjoncte"`, `"court circuit maison"` |
| Urgence 7j/7 | `[electricien urgence]`, `"urgence electricien"`, `"electricien rapide"`, `"depannage electricien dimanche"` |

Négatifs spécifiques dépannage:

`edf panne`, `enedis coupure`, `coupure générale`, `linky panne réseau`, `numéro edf`, `facture`, `abonnement`, `groupe électrogène`, `lampe torche`, `tuto`, `schéma`.

### RSA - Dépannage électrique

Titres validés, tous <= 30 caractères:

| # | Titre | Longueur |
| ---: | --- | ---: |
| 1 | Dépannage Électrique | 20 |
| 2 | Électricien 7j/7 | 16 |
| 3 | Panne De Courant | 16 |
| 4 | Urgence Électricien | 19 |
| 5 | JM ELEC Montauban | 17 |
| 6 | Intervention Rapide | 19 |
| 7 | Dès 130€ | 8 |
| 8 | Tableau Qui Disjoncte | 21 |
| 9 | Court-Circuit Maison | 20 |
| 10 | Appelez Maintenant | 18 |
| 11 | Diagnostic Sur Place | 20 |
| 12 | Électricien Près De Vous | 24 |
| 13 | Sécurisation Logement | 21 |
| 14 | Dépannage 82 | 12 |
| 15 | Prise Et Tableau | 16 |

Descriptions validées, toutes <= 90 caractères:

| # | Description | Longueur |
| ---: | --- | ---: |
| 1 | Panne, disjoncteur, prise ou tableau: dépannage 7j/7 à partir de 130€. | 70 |
| 2 | Appelez JM ELEC pour une intervention rapide à Montauban et alentours. | 70 |
| 3 | Diagnostic clair, sécurisation immédiate et devis avant travaux complémentaires. | 80 |
| 4 | Électricien assuré, décennale et RC Pro. Demandez une aide rapide maintenant. | 77 |

Extensions:

- Appel: `07 67 97 38 48`, affichage prioritaire mobile, numéro de transfert Google.
- Accroches: `Dépannage 7j/7`, `Dès 130€`, `Diagnostic clair`, `Intervention locale`, `RC Pro`, `Décennale`.
- Liens annexes:
  - `Appel dépannage` -> `/depannage-electrique.html`
  - `Contact rapide` -> `/contact.html`
  - `Borne IRVE` -> `/borne-recharge.html`
  - `Travaux électriques` -> `/electricite-generale.html`
- Extraits structurés:
  - Dépannages: `Panne`, `Disjoncteur`, `Tableau`, `Prise`, `Court-circuit`.
  - Zones: `Castelsarrasin`, `Moissac`, `Montech`, `Valence d'Agen`, `Montauban`.

Landing page dédiée:

- Hero: "Dépannage électrique 7j/7 à Montauban et Castelsarrasin", prix dès 130 €, CTA appel immédiat.
- Arguments: panne, tableau, disjoncteur, prise, court-circuit.
- Réassurance: diagnostic, sécurisation, devis avant travaux complémentaires.
- Photos: tableau avant diagnostic, remplacement prise/protection, intervention.
- FAQ: week-end, prix, réparation immédiate.
- Formulaire: utile pour non-urgence, mais appel prioritaire.
- CTA: appel direct visible en header, hero, bande mobile et footer.

## Campagne 3 - Électricité générale

Nom conseillé: `S - Électricité générale - Montauban Castelsarrasin`

URL finale: `https://castelsarrasin.jm-elec.fr/electricite-generale.html`

Objectif: demandes de devis pour installations, rénovation, tableau, prises, éclairage.

Ne pas envoyer cette campagne vers l'accueil. La page doit correspondre aux mots-clés "électricien", "tableau", "prises" et "rénovation".

Groupes d'annonces:

| Groupe | Mots-clés |
| --- | --- |
| Électricien Montauban | `[electricien montauban]`, `"electricien montauban"`, `[artisan electricien montauban]`, `"electricien autour de moi"` |
| Électricien Castelsarrasin | `[electricien castelsarrasin]`, `"electricien castelsarrasin"`, `[artisan electricien castelsarrasin]`, `"electricien castelsarrasin autour de moi"` |
| Installation | `[installation electrique]`, `"installation prise electrique"`, `"installation tableau electrique"`, `"pose luminaire exterieur"` |
| Rénovation | `[renovation electrique]`, `"renovation electricite maison"`, `"mise aux normes electrique"`, `"mise en securite electrique"` |
| Pro copropriété | `"electricien entreprise"`, `"electricien copropriete"`, `"travaux electriques local professionnel"`, `"electricien commerce"` |

Négatifs spécifiques électricité générale:

`formation electricien`, `emploi electricien`, `auto entrepreneur devenir`, `schema va et vient`, `norme pdf`, `cours electricite`, `materiel electrique`, `magasin`, `grossiste`, `location`.

### RSA - Électricité générale

Titres validés, tous <= 30 caractères:

| # | Titre | Longueur |
| ---: | --- | ---: |
| 1 | Électricien Montauban | 21 |
| 2 | Électricité Générale | 20 |
| 3 | Installation Dès 130€ | 21 |
| 4 | Rénovation Sur Devis | 20 |
| 5 | Mise Aux Normes | 15 |
| 6 | Tableau Électrique | 18 |
| 7 | Prises Et Éclairage | 19 |
| 8 | JM ELEC Qualifelec | 18 |
| 9 | RGE Et Décennale | 16 |
| 10 | Devis Étude Rapide | 18 |
| 11 | Maison Et Entreprise | 20 |
| 12 | Copropriétés | 12 |
| 13 | Artisan Électricien | 19 |
| 14 | Travaux Électriques | 19 |
| 15 | Appelez JM ELEC | 15 |

Descriptions validées, toutes <= 90 caractères:

| # | Description | Longueur |
| ---: | --- | ---: |
| 1 | Installations dès 130€. Rénovation et mise aux normes sur devis après étude. | 76 |
| 2 | JM ELEC intervient à Montauban, Castelsarrasin et alentours pour vos travaux. | 77 |
| 3 | Tableau, prises, éclairage, rénovation: travail propre, assuré et conforme. | 75 |
| 4 | Demandez une étude claire avec un électricien Qualifelec, RGE et décennale. | 75 |

Extensions:

- Appel: `07 67 97 38 48`, avec numéro de transfert Google.
- Accroches: `Dès 130€`, `Rénovation sur devis`, `Qualifelec`, `RGE`, `Décennale`, `RC Pro`.
- Liens annexes:
  - `Électricité générale` -> `/electricite-generale.html`
  - `Contact devis` -> `/contact.html`
  - `Dépannage 7j/7` -> `/depannage-electrique.html`
  - `Borne IRVE` -> `/borne-recharge.html`
- Extraits structurés:
  - Travaux: `Tableau`, `Prises`, `Éclairage`, `Rénovation`, `Mise aux normes`.
  - Clients: `Particuliers`, `Entreprises`, `Copropriétés`.

Landing page dédiée:

- Hero: "Électricien à Montauban et Castelsarrasin".
- Arguments: tableau, prises, éclairage, rénovation, mise aux normes.
- Réassurance: devis après étude, décennale, RC Pro, Qualifelec, RGE.
- Photos: tableau terminé, éclairage, chantier rénovation.
- FAQ: rénovation sur devis, entreprises, mise aux normes.
- Formulaire: type de travaux, ville, téléphone, projet.
- CTA: appel et demande d'étude.

## Stratégie d'optimisation 90 jours

### Semaine 1

- Mettre le site en ligne sur `castelsarrasin.jm-elec.fr`.
- Vérifier la balise Google et les conversions dans Google Ads.
- Tester les clics téléphone sur mobile et desktop.
- Lancer uniquement en exact + expression.
- Ajouter les négatifs partagés dès le départ.
- Activer composants d'appel et numéro de transfert Google.
- Cibler présence dans la zone, pas "intérêt pour la zone".
- Contrôler que les formulaires arrivent bien dans l'outil choisi.

### Semaine 2

- Lire les termes de recherche tous les 2 jours.
- Ajouter les négatifs qui gaspillent le budget.
- Vérifier les appels: durée, heure, service demandé, zone.
- Mettre en pause les mots-clés sans intention locale claire.
- Tester 2 angles RSA: "prix dès" et "certifications".
- Ajuster les budgets selon demandes qualifiées, pas selon clics.

### Mois 1

- Passer vers Maximiser les conversions si les conversions sont fiables.
- Réallouer le budget vers la campagne au meilleur coût par lead qualifié.
- Ajouter les vraies photos chantiers pour renforcer la confiance.
- Améliorer les FAQ selon les objections entendues au téléphone.
- Créer une liste de conversions qualifiées: appel > 60 secondes, formulaire complet.
- Comparer performance mobile vs desktop.

### Mois 2

- Tester un CPA cible si le volume de conversions est suffisant.
- Ajouter des variantes de pages si une campagne dépasse 10 conversions/mois.
- Créer des audiences d'observation: visiteurs du site, appels, formulaire.
- Optimiser par horaires: renforcer les plages qui produisent de vrais appels.
- Travailler le SEO local: pages communes proches, maillage, avis, photos Google Business Profile.

### Mois 3

- Étendre prudemment les mots-clés après consolidation des négatifs.
- Tester requêtes larges uniquement sur campagne rentable et bien trackée.
- Monter le budget IRVE si le coût par devis est rentable.
- Créer une page "zones" si la Search Console montre des requêtes communes.
- Produire un reporting simple: coût par appel qualifié, coût par devis, taux de conversion landing page, part d'impressions en haut absolu.

## Recommandations pour maximiser les performances

Appels téléphoniques:

- Garder le bouton appel en premier sur mobile.
- Utiliser les composants d'appel sur chaque campagne.
- Pour dépannage, diffuser 7j/7 avec priorité mobile.
- Mesurer uniquement les appels utiles: clic téléphone site, appels Ads et durée d'appel.
- Répondre avec une phrase de qualification: ville, type de panne, urgence, accès au tableau.

Formulaires:

- Demander peu de champs: nom, téléphone, ville, service, message.
- Ajouter un endpoint fiable avant lancement payant.
- Rediriger vers `merci.html` pour déclencher la conversion.
- Ajouter des champs cachés UTM/GCLID quand l'endpoint est choisi.
- Rappeler vite: idéalement moins de 5 minutes sur les leads Google Ads.

Taux de conversion:

- Promesse locale dans le H1.
- Prix de départ visible au-dessus de la ligne de flottaison.
- Certifications et assurances visibles dès le hero.
- FAQ proche du formulaire pour lever les objections.
- Photos réelles dès que possible: visage, véhicule, chantiers, borne posée.

Quality Score:

- Un groupe d'annonces par intention.
- Mot-clé principal repris dans le titre de l'annonce, H1 et URL finale.
- Landing page dédiée pour chaque campagne.
- Vitesse élevée: pas de framework, pas de police externe, image hero optimisée.
- Négatifs ajoutés tôt pour protéger le CTR.

Position et visibilité:

- La métrique "position moyenne" n'est plus le meilleur repère moderne. Suivre plutôt le taux d'impressions en haut de page et en haut absolu.
- Pour les requêtes coeur comme `électricien Montauban`, `électricien Castelsarrasin`, `dépannage électrique Montauban`, `borne recharge Montauban`, viser une présence haute avec annonce pertinente et extensions complètes.
- Ne pas chercher à être premier sur les requêtes trop larges si elles ne génèrent pas d'appels qualifiés.

## Photos à fournir

Priorité haute:

- Photo portrait ou artisan en tenue avec véhicule.
- Photo véhicule ou matériel avec logo.
- Borne IRVE installée chez un client.
- Tableau électrique propre après intervention.
- Exemple dépannage avant/après.
- Chantier rénovation ou mise aux normes.

Format idéal:

- Horizontal 1600 x 1000 px pour hero/sections.
- Vertical 900 x 1200 px pour mobile et cartes.
- Photos nettes, lumineuses, sans données client visibles.
