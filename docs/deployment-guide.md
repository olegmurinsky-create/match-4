# Deployment Guide

This document explains how to deploy the Match-4 application.

## Deployment to GitHub Pages

The project is configured for easy deployment to GitHub Pages.

### Process

The deployment process is automated using the `gh-pages` npm package. It involves two main steps:

1.  **Building the project**: The `predeploy` script (`npm run build`) is run first to create a production-ready build in the `dist` directory.
2.  **Pushing to `gh-pages` branch**: The `deploy` script then takes the contents of the `dist` directory and pushes it to the `gh-pages` branch of the repository. GitHub Pages is then configured to serve the site from this branch.

### How to Deploy

To deploy the application, run the following command from the project's root directory:
```bash
npm run deploy
```
This single command will handle both the build and deployment steps.
