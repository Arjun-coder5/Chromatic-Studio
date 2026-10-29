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
