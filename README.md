# JakeDemo - CVE Remediation System

This is a Next.js project initialized with TypeScript, Tailwind CSS, Jest, and Playwright.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

### Unit Tests
Run Jest unit tests:
```bash
npm run test
```

### E2E Tests
Run Playwright end-to-end tests:
```bash
# First time setup
npx playwright install

# Run tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### Linting & Building
```bash
npm run lint
npm run build
```
