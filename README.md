# Match-4

A simple web-based puzzle game that combines classic "Match-3" swapping mechanics with "Color Lines" matching rules (4 in a line). Built with React, TypeScript, Vite, and Framer Motion for smooth animations.

## Gameplay Features

- **Level-Based Progression:** Swap adjacent balls to form lines of 4 or more to reach the level's target score.
- **Fever Mode:** Once the target score is hit, a fast-paced timed bonus round begins!
- **Cascading Combos:** Cleared balls trigger cascades, allowing for chain reactions with score multipliers.
- **Any-Direction Matches:** Form lines horizontally, vertically, or diagonally.
- **High Score Leaderboard:** At the end of a game, enter your initials and make it into the top 5 high scores.
- **Automatic Hints:** If you get stuck, the game will automatically show you a possible move.
- **Sleek UI:** A dynamic status bar keeps you updated on your score and game state, integrated directly with the game board.
- **Smooth Animations:** Powered by `framer-motion` for a fluid and responsive experience.

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
