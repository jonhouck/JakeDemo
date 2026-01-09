// List of real CVEs to ensure OSINT lookups yield results
// Aligned with src/data/remediation_catalog.ts
export const CURATED_CVES = [
    'CVE-2021-44228', // Log4Shell
    'CVE-2017-0144',  // EternalBlue
    'CVE-2023-34362', // MOVEit
    'CVE-2021-26855', // ProxyLogon
    'CVE-2014-0160',  // Heartbleed
    // We can add more, but these ensure we have "Exploited" hits with rich text.
];
