# Match-4

A simple web-based puzzle game that combines classic "Match-3" swapping mechanics with "Color Lines" matching rules (4 in a line). Built with React, TypeScript, Vite, and Framer Motion for smooth animations.

## Gameplay Features

- **Match 4 to Clear:** Swap adjacent balls to form lines of 4 or more balls of the same color.
- **Any Direction:** Matches can be formed horizontally, vertically, or diagonally.
- **Gravity & Cascades:** Cleared balls disappear, causing the balls above them to fall down. This can trigger satisfying chain reactions (combos).
- **Smooth Animations:** Powered by `framer-motion` for fluid swapping, falling, and clearing visuals.
- **Endless Mode:** Keep matching to rack up the highest score possible.

## Tech Stack

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)

### Installation

1. Clone the repository and navigate to the project folder:
   ```bash
   cd match-4
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server, run:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser to play the game.

### Building for Production

To create a production-ready build, run:
```bash
npm run build
```
The optimized files will be generated in the `dist` directory. You can preview the build using `npm run preview`.
