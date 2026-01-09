# JakeDemo - CVE Remediation System

This is a Next.js project initialized with TypeScript, Tailwind CSS, Jest, and Playwright. It serves as a Proof of Concept for a CVE Threat Analysis & Remediation System.

## Project Initialization for Testing

Follow these steps to initialize the application and run verifications.

1.  **Clone & Install**:
    ```bash
    git clone <repository-url>
    cd JakeDemo
    npm install
    npx playwright install # Required for E2E tests
    ```

2.  **Mock Data Generation**:
    The application generates mock infrastructure data in-memory upon startup. No database setup is required.
    OSINT data is fetched from public sources (CISA KEV) automatically in the background.

## Running the Application

1.  **Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000). The dashboard will automatically populate with prioritized remediation items.

2.  **Production Build**:
    ```bash
    npm run build
    npm start
    ```

## Testing Validation

### Unit Tests
Verify the logic of the Prioritization Engine and Dashboard Components:
```bash
npm run test
```

### End-to-End Tests
Verify the full user journey:
```bash
npm run test:e2e
```

### Manual Walkthrough
Refer to [docs/manual_walkthrough.md](docs/manual_walkthrough.md) for a detailed step-by-step verification guide.
