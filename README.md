# ⚡ ReMix - Application Web de Révision Gamifiée

ReMix est une application 100% statique (HTML/CSS/JS ES Modules) permettant de réviser ses cours et paquets Anki avec une expérience gamifiée moderne, la répétition espacée (SRS / SM-2) et un affichage élégant des formules LaTeX (MathJax).

---

## 🌟 Fonctionnalités Principales

- **📂 Arborescence par Dossiers** : Naviguez dans vos sous-dossiers de cours comme sur votre ordinateur.
- **🧠 Répétition Espacée (Anki / SM-2)** : Priorise les cartes dues ou mal connues.
- **🟢🟡🔴 Indicateur de Maîtrise Visuel** : Bordures lumineuses de vert à rouge selon votre niveau d'assimilation.
- **🎴 Mode Flashcard Direct** : Consultation directe de la réponse et explication de la règle.
- **📐 Support MathJax / LaTeX** : Rendu dynamique $E=mc^2$ et TeX/SVG.
- **📥 Importateur CSV** : Importez vos cours au format `Question; Bonne Réponse; ...`.
- **🎮 Mode Admin (Secret)** : Cliquez 11 fois sur votre icône de profil pour débloquer le menu triche !

---

## 🚀 Hébergement Gratuit (GitHub Pages / Netlify / Vercel)

Cette application est 100% statique et ne nécessite aucun serveur backend Python/Node.

### Option A : GitHub Pages (Recommandé - 2 minutes)
1. Créez un dépôt GitHub et déposez l'ensemble des fichiers du dossier `site_web_de_revision`.
2. Rendez-vous dans **Settings** ➔ **Pages**.
3. Dans **Source**, choisissez `main` (ou `master`) / `/ (root)` et cliquez sur **Save**.
4. Votre site **ReMix** sera en ligne gratuitement à l'adresse : `https://<votre-pseudo>.github.io/<nom-du-repo>/`.

---

## 📱 Utilisation Locale (Safari / Chrome / Firefox)

Ouvrez simplement le fichier `index.html` dans Safari ou tout autre navigateur. L'application utilise `js/app.bundle.js` pour fonctionner sans bloquer sur les règles CORS locales.
