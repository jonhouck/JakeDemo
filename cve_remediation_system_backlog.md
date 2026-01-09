# CVE Threat Analysis & Remediation System - Architecture & Backlog

## 1. System Overview

**Objective:** A Proof of Concept (PoC) web application to ingest mock infrastructure CVE scans, enrich them with **real** OSINT threat data, prioritize them, and generate remediation reports.

**Core Concept:**
- **Mock Data Layer (In-Memory)**: Simulates a large enterprise environment and scans at runtime. No database persistence.
- **Real Intelligence Layer**: Fetches real-world data (Threat Scores, Exploitation Status) from open (no-auth) sources.
- **Business Logic**: Intersects the *Mock Asset Importance* with the *Real CVE Severity* to produce a Prioritized Remediation Report.

## 2. Architecture Diagram

```mermaid
graph TD
    subgraph "Runtime Memory Store"
        Store[Global State / Context]
        Assets[Mock Assets List]
        Scans[Mock Scans List]
        ThreatCache[OSINT Cache]
        
        Store --- Assets
        Store --- Scans
        Store --- ThreatCache
    end

    subgraph "Core Application (Next.js)"
        Init[Data Generator\n(Runs on Start)]
        API[Target API Routes]
        PE[Prioritization Engine]
        UI[React Frontend]
        
        Init -->|Populates| Store
        API -->|Reads| Store
        PE -->|Reads| Store
        PE -->|Enriches with| OSINT
        UI -->|Consumes| API
    end

    subgraph "Open OSINT Services (No Auth)"
        OSINT[CISA KEV / OSV.dev]
    end

    Init -.->|Fetch Bulk Data| OSINT
    PE -->|Fetch Details| OSINT
```

## 3. Data Models (In-Memory Interfaces)

### A. Mock Data (Runtime Generated)
*   **Asset**: `{ id, hostname, ip, os, criticality_score (1-10), domain, owner }`
*   **ScanResult**: `{ scan_id, asset_id, timestamp, detected_cves: [ "CVE-2023-1234" ] }`
*   **DataStore**: `{ assets: Asset[], scans: ScanResult[], threat_cache: Map<string, ThreatInfo> }`

### B. Real Data (External OSINT)
*   **ThreatInfo**: `{ cve_id, cvss_score, is_exploited_in_wild (CISA KEV), description, remediation_steps, reference_urls }`

### C. Enriched/Prioritized Data
*   **RemediationItem**: `{ asset_context, threat_context, risk_score (Calculated), priority_rank }`

---

## 4. Developer Backlog & Critical Path

**Critical Path Definition:**
1.  **Project Shell (React/Next.js)**.
2.  **In-Memory Data Structures**.
3.  **Mock Data Generation** (Runtime).
4.  **No-Auth OSINT Integration**.
5.  **Prioritization & Reporting**.

> **Legend:**
> - 🛑 **BLOCKER**: Prevents subsequent tasks.
> - 🔗 **DEPENDENCY**: Requires a previous task.

### Phase 1: Foundation & Runtime Generation

#### Task 1.1: Project Initialization 🛑 [DONE]
- **Description**: Initialize a **Next.js** project (using React).
    - Use App Router.
    - Setup TypeScript and Tailwind CSS.
- **Outcome**: A running local web server.
- **Dependencies**: None.

#### Task 1.2: In-Memory Data Structures 🔗 [DONE]
- **Description**: Define TypeScript interfaces for `Asset`, `ScanResult`, and `ThreatInfo`. Create a singleton "Service" or Context to hold this data in memory for the session.
- **Outcome**: A typed structure ready to receive data.
- **Dependencies**: Task 1.1.

#### Task 1.3: Mock Data Generator (Runtime) 🛑 [DONE]
- **Description**: create a utility function `generateMockData()` that runs when the app starts (or is triggered).
    - Generate 500+ assets with realistic names/IPs.
    - Generate random scan results linked to these assets.
    - **Crucial**: Use a curated list of ~50 *real* CVE IDs (e.g., Log4Shell, EternalBlue) so our OSINT lookups actually find data.
- **Outcome**: Calling the function populates the In-Memory Store.
- **Dependencies**: Task 1.2.

### Phase 2: OSINT Integration (No Auth)

#### Task 2.1: OSINT Service Connector 🛑 [DONE]
- **Description**: Implement a service to fetch real CVE data without API keys.
    - **Source 1**: **CISA KEV (Known Exploited Vulnerabilities)**. Download the JSON catalog (public URL) and cache it in memory.
    - **Source 2**: **OSV.dev API** or **CIRCL CVE Search**. Use these for specific CVE details (CVSS scores, descriptions) if not found in CISA.
    - *Constraint*: Do NOT use APIs requiring registration/keys.
- **Outcome**: A function `enrichCVE(cveId)`.
- **Dependencies**: Task 1.1.

### Phase 3: Core Logic & API

#### Task 3.1: Prioritization Engine 🛑
- **Description**: Implement the ranking logic.
    - Formula: `Risk = Asset_Criticality * CVSS_Score`.
    - Booster: If found in CISA KEV, multiply score by **2.0**.
- **Outcome**: Logic that takes the Mock Store + OSINT Cache and returns sorted items.
- **Dependencies**: Task 1.3, Task 2.1.

#### Task 3.2: Internal API Routes
- **Description**: Create Next.js API Routes to serve the frontend.
    - `GET /api/dashboard`: Returns summary stats.
    - `GET /api/remediation`: Returns the full prioritized list.
- **Outcome**: Frontend has endpoints to hit.
- **Dependencies**: Task 3.1.

### Phase 4: User Interface & Reporting

#### Task 4.1: React Dashboard Implementation
- **Description**: Build the UI.
    - **Dashboard**: High-level stats (e.g., "Total Critical Assets").
    - **Remediation List**: A prioritized table of assets and their top threats.
    - **Detail View**: Real OSINT remediation advice for selected CVEs.
- **Outcome**: Interactive React UI.
- **Dependencies**: Task 3.2.

#### Task 4.2: Report Export
- **Description**: Add a "Export Report" button.
    - Generates a clean JSON or Markdown view of the prioritized list for the user to "download" or view.
- **Outcome**: The specific business outcome requested.
- **Dependencies**: Task 4.1.

### Phase 5: Verification

#### Task 5.1: Verification & Demo
- **Description**: Manual walkthrough.
    - Start App -> Generator runs -> Dashboard populates -> OSINT data is fetched -> Report is readable.
- **Dependencies**: Task 4.2.
