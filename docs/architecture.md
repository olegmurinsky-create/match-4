# Architecture Documentation

## 1. Executive Summary

This document outlines the architecture of the Match-4 game, a simple web-based puzzle game built with React and TypeScript. The application is a single-page application (SPA) with a focus on a fluid user experience through animations.

## 2. Technology Stack

The project utilizes the following technologies:

| Category      | Technology     | Version   | Purpose                                     |
|---------------|----------------|-----------|---------------------------------------------|
| **Frontend**  | React          | ^18.2.0   | Core UI library for building components.    |
|               | TypeScript     | ^5.0.2    | Adds static typing to JavaScript.           |
|               | Vite           | ^4.4.5    | Modern frontend build tool and dev server.  |
| **Animation** | Framer Motion  | ^10.18.0  | For smooth and complex UI animations.       |
| **Testing**   | Vitest         | ^0.34.6   | For unit testing the business logic.        |

## 3. Architecture Pattern

The application follows a **component-based architecture**, which is standard for React applications. The UI is broken down into reusable components, although in this simple project, most of the logic resides in the main `App.tsx` component.

There is a clear separation of concerns between the UI (React components) and the business logic (pure TypeScript functions in `gameLogic.ts`).

## 4. Data Architecture

The application does not have a backend or a database. The game state is managed entirely on the client-side, in memory. React's built-in state management (e.g., `useState` hook) is used to handle the game board and score.

## 5. API Design

There is no explicit API layer in this application as it is a standalone client-side game.

## 6. Component Overview

The project does not have a dedicated component library or a `components` directory. The main UI is encapsulated within the `App.tsx` component.

## 7. Source Tree

For a detailed view of the project structure, please see the [Source Tree Analysis](./source-tree-analysis.md).

## 8. Development Workflow

The development workflow is managed through `npm` scripts defined in `package.json`.

- **Installation**: `npm install`
- **Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Testing**: `npx vitest`

## 9. Deployment Architecture

The application is designed for static hosting and is deployed to **GitHub Pages**. The deployment process is automated with a `deploy` script in `package.json` that uses the `gh-pages` library to push the contents of the `dist` folder to the `gh-pages` branch.

## 10. Testing Strategy

The testing strategy focuses on unit testing the core game logic in `gameLogic.ts`. Tests are written using `vitest`. There are no end-to-end or UI tests in this project.
