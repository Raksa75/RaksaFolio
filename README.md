# NZ_ // Game Design Portfolio

Portfolio de **Nicolas Zimmermann**, étudiant en Game Design à LISAA Paris.
En ligne : https://raksa75.github.io/RaksaFolio/

Site statique (HTML / CSS / JS vanilla, aucun build), servi par GitHub Pages.

## Structure

| Fichier / dossier | Contenu |
| --- | --- |
| `index.html` | Toutes les pages (SPA : une `<div class="page" id="page-xxx">` par page) |
| `css/style.css` | Tout le style : tokens (couleurs, polices) en haut, thème clair via `.light` |
| `js/i18n.js` | **Tous les textes FR / EN** (clés utilisées par `data-i18n` / `data-i18n-html`) |
| `js/data.js` | Projets de la page Documentations (`DOCS`) + galerie des cartes IN CANTA |
| `js/app.js` | Intro, langue, thème, navigation (routeur par `#hash`), galeries, lightbox, lecteur PDF |
| `js/terminal.js` | Console du Playground + les 10 mini-jeux + commandes secrètes |
| `assets/` | Images (WebP), `PDF/`, `fonts/` (polices auto-hébergées), favicon, image de partage `og-cover.jpg` |
| `AkipouetteClicker/`, `EchoChase/`, `FeedbackCard/`, `ParastinProto/` | Prototypes jouables chargés en iframe (uniquement quand leur page est ouverte) |

## Modifier le site

- **Changer un texte** : chercher la clé dans `js/i18n.js` (FR en haut, EN en bas).
- **Ajouter un document** : ajouter une entrée dans `DOCS` (`js/data.js`) puis son id dans `buildDocGroups()` (`js/app.js`).
- **Ajouter une page** : créer la `<div class="page" id="page-nom">` dans `index.html` et ajouter `nom` à `PAGES` dans `js/app.js`.
- **Ajouter un PDF à une page** : l'ajouter dans `PDF_PAGES` (`js/app.js`).
- **Images** : privilégier le WebP (`cwebp -q 82 image.png -o image.webp`).
- **PDF lourds** : les compresser avant de les ajouter, par exemple
  `gs -sDEVICE=pdfwrite -dPDFSETTINGS=/printer -dColorImageResolution=200 -o sortie.pdf entree.pdf`.

Liens directs : chaque page a son URL (`#incanta`, `#about`...) et chaque document aussi (`#doc/tft`, `#doc/nb`...).
