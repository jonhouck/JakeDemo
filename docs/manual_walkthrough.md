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
4.  **Check**: Pass result for `src/services/__tests__/MockDataStore.test.ts` (Data Store Logic).

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

### 6. Verify OSINT Data Integration (Task 2.1)
1.  Review the server/browser console logs during startup.
2.  **Check**: Look for "Fetching CISA KEV data..." and "Processed X exploited vulnerabilities from CISA."
3.  **Check**: Verify that the application doesn't crash even if network is offline (simulated by turning off wifi or blocking request).

### 7. Verify Prioritization Engine (Task 3.1)
1.  Run the unit tests:
    ```bash
    npm test src/services/__tests__/PrioritizationEngine.test.ts
    ```
2.  **Check**: Verify all 3 tests pass (Risk Calculation, Booster Logic, Sorting).

### 8. Verify Internal API Routes (Task 3.2)
1.  Ensure the dev server is running (`npm run dev`).
2.  Open [http://localhost:3000/api/dashboard](http://localhost:3000/api/dashboard).
    - **Check**: Returns a JSON object with `total_assets`, `critical_assets`, etc.
3.  Open [http://localhost:3000/api/remediation](http://localhost:3000/api/remediation).
    - **Check**: Returns a JSON array of remediation items sorted by risk score.

### 9. Verify Dashboard UI (Task 4.1)
1.  Ensure the dev server is running (`npm run dev`).
2.  Navigate to [http://localhost:3000](http://localhost:3000).
3.  **Check**: Dashboard Header "CVE Remediation PoC" is visible.
4.  **Check**: Four summary cards (Total Assets, Critical Assets, High Risk Vulns, Exploited CVEs) display numbers significantly greater than 0.
5.  **Check**: A table titled "Prioritized Remediation Actions" lists multiple items.
6.  **Check**: Verify visually that items with "⚠️ Exploited" are likely present (may require scrolling).
7.  **Check**: Click "Details" on a row. Verify a modal opens with "Description", "CVSS Score", and "Remediation Steps".
8.  **Check**: Close the modal.

### 10. Verify Report Export (Task 4.2)
1.  Locate the "Export JSON" and "MD" buttons in the top right of the dashboard.
2.  Click **Export JSON**.
    - **Expected Result:** A file named `cve-report-YYYY-MM-DD.json` is downloaded.
    - **Verification:** Open the file from your downloads folder and verify it contains a JSON array of remediation items.
3.  Click **MD** (Markdown).
    - **Expected Result:** A file named `cve-report-YYYY-MM-DD.md` is downloaded.
    - **Verification:** Open the file and verify formatted table with columns: Rank, Risk Score, Asset, CVE ID, Severity, Status.
