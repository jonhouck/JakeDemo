# Manual Walkthrough - Project Initialization

This document outlines the steps to manually verify the initialization of the JakeDemo project.

## Prerequisites
- Node.js (v20+)
- npm

## Verification Steps

### 1. Installation and Setup
1.  Clone the repository (or ensure you are in the project root).
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Install Playwright browsers (if not already installed):
    ```bash
    npx playwright install
    ```

### 2. Verify Development Server
1.  Start the dev server:
    ```bash
    npm run dev
    ```
2.  Open [http://localhost:3000](http://localhost:3000) in your browser.
3.  **Check**: The default Next.js landing page should load without errors.
4.  **Check**: The console should not show any errors.

### 3. Verify Unit Tests
1.  Open a new terminal.
2.  Run unit tests:
    ```bash
    npm run test
    ```
3.  **Check**: Pass result for `src/__tests__/page.test.tsx` (renders a heading).

### 4. Verify E2E Tests
1.  Ensure dev server is running (or let Playwright start it - but running it explicitly is fine too).
2.  Run E2E tests:
    ```bash
    npm run test:e2e
    ```
3.  **Check**: Tests for "has title" and "get started link" pass.

### 5. Verify Build
1.  Stop the dev server.
2.  Run production build:
    ```bash
    npm run build
    ```
3.  **Check**: Build completes successfully.
4.  Start production server:
    ```bash
    npm start
    ```
5.  **Check**: App loads at localhost:3000.
