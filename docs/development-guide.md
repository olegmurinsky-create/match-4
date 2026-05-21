# Development Guide

This guide provides instructions for setting up and running the Match-4 project locally.

## 1. Prerequisites

- **Node.js**: v16 or higher is recommended.
- **npm**: Should be installed with Node.js.

## 2. Installation

1.  Clone the repository to your local machine.
2.  Navigate to the project's root directory.
3.  Install the dependencies using npm:
    ```bash
    npm install
    ```

## 3. Running the Development Server

To start the local development server, run the following command:
```bash
npm run dev
```
This will start a Vite development server, typically available at `http://localhost:5173`.

## 4. Building for Production

To create a production build of the application, run:
```bash
npm run build
```
The optimized and minified files will be generated in the `dist` directory.

## 5. Testing

The project uses `vitest` for unit testing the core game logic. To run the tests, execute:
```bash
npx vitest
```
