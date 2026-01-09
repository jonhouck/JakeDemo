export interface Asset {
    id: string;
    hostname: string;
    ip: string;
    os: string;
    criticality_score: number; // 1-10
    domain: string;
    owner: string;
}

export interface ScanResult {
    scan_id: string;
    asset_id: string;
    timestamp: string; // ISO date string
    detected_cves: string[]; // List of CVE IDs
}

export interface ThreatInfo {
    cve_id: string;
    cvss_score: number;
    is_exploited_in_wild: boolean;
    description: string;
    remediation_steps: string;
    reference_urls: string[];
}
