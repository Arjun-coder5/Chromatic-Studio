
# Chromatic Studio — Color & Accessibility Toolkit

A client-side React + Vite project for exploring color systems and accessibility.

## Features
- Live background/text color editor with HEX inputs and native color pickers
- Contrast ratio calculator with WCAG AA and AAA checks for normal and large text
- Readable text color suggestion
- Five-color palette generator with lockable swatches and copy actions
- Color-vision simulation approximations for protanopia, deuteranopia, tritanopia, and monochromacy
- Preset palettes
- Save/load/remove palettes in browser localStorage
- Copy CSS design tokens and JSON; download JSON tokens
- Responsive interface with no backend or account required

## Run locally
1. Install Node.js (LTS).
2. Extract this folder and open it in VS Code.
3. Open the integrated terminal in the project folder.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite, commonly `http://localhost:5173`.

## Notes
- Saved palettes remain in the current browser's local storage; clearing site data removes them.
- Color-vision simulation is an approximation and should be used as a design aid, not a clinical representation.
- Contrast checks are focused on the chosen text/background pair and do not constitute a complete accessibility audit.
=======
#  Chromatic Studio

**A modern color palette generator and accessibility toolkit for the web.**

Chromatic Studio helps developers and designers explore color combinations, preview interfaces in real time, evaluate text contrast, and create more accessible digital experiences.

## ✨ Features

- 🎨 **Color Palette Generator** — Generate harmonious color combinations.
- 🔒 **Color Locking** — Lock favorite colors while generating alternatives.
- 👀 **Live Preview** — See how colors look in a sample interface.
- ♿ **WCAG Contrast Checker** — Evaluate text and background contrast against accessibility criteria.
- 🌓 **Color Blindness Simulation** — Explore how palettes may appear under different color-vision deficiencies.
- 💡 **Readable Color Suggestions** — Find alternative text colors with improved contrast.
- 💾 **Saved Palettes** — Save and manage favorite color combinations.
- 📋 **Design Token Export** — Copy CSS variables and export color tokens as JSON.
- 📱 **Responsive UI** — Use the toolkit on desktop and mobile screens.

## 🛠️ Tech Stack

- React
- JavaScript
- Vite
- CSS
- Browser APIs for local interactions and storage

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR-USERNAME/chromatic-studio.git
   ```

2. Enter the project directory:

   ```bash
   cd chromatic-studio
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed in your terminal.

## 🧪 Accessibility

Chromatic Studio is designed to help evaluate color contrast using WCAG criteria. A contrast pass does not guarantee that an entire website is accessible; keyboard navigation, semantic HTML, focus states, and other accessibility requirements should also be tested.

## 🗺️ Roadmap

- [ ] Expand color harmony options
- [ ] Add more palette export formats
- [ ] Improve accessibility guidance
- [ ] Add automated tests
- [ ] Deploy a public demo

## 🤝 Contributing

Contributions, bug reports, and feature suggestions are welcome. Fork the repository, create a branch, and submit a pull request.

## 📄 License

Choose and add a license file before distributing the project. The MIT License is a good option for an open-source portfolio project.

---

**Built with React and a love for thoughtful design.**
>>>>>>> 1c8c57abf6e8ad3096ab27061e93b47ff7b328d4
