import { Asset, ScanResult, ThreatInfo } from '../types/models';

export class MockDataStore {
    private static instance: MockDataStore;

    private assets: Asset[] = [];
    private scans: ScanResult[] = [];
    private threat_cache: Map<string, ThreatInfo> = new Map();

    private constructor() { }

    public static getInstance(): MockDataStore {
        if (!MockDataStore.instance) {
            MockDataStore.instance = new MockDataStore();
        }
        return MockDataStore.instance;
    }

    public reset(): void {
        this.assets = [];
        this.scans = [];
        this.threat_cache.clear();
    }

    public addAsset(asset: Asset): void {
        this.assets.push(asset);
    }

    public addScanResult(scan: ScanResult): void {
        this.scans.push(scan);
    }

    public updateThreatCache(threat: Partial<ThreatInfo> & { cve_id: string }): void {
        const existing = this.threat_cache.get(threat.cve_id);
        if (existing) {
            this.threat_cache.set(threat.cve_id, { ...existing, ...threat });
        } else {
            // We need to ensure all required fields are present if it's a new entry, 
            // or allow partials if we change the map type. 
            // For now, let's assume if it's new, the caller provides a complete ThreatInfo 
            // OR we provide default values for missing fields to satisfy the interface.
            // However, the interface requires all fields. 
            // Let's coerce it for now or assume the "partial" usage will only happen 
            // if we have a way to handle missing fields.
            // Actually, strict TS might complain if we store a Partial in a Map<string, ThreatInfo>.
            // Let's construct a full object with defaults.
            const newThreat: ThreatInfo = {
                cve_id: threat.cve_id,
                cvss_score: threat.cvss_score ?? 0,
                is_exploited_in_wild: threat.is_exploited_in_wild ?? false,
                description: threat.description ?? 'No description available.',
                remediation_steps: threat.remediation_steps ?? 'No specific remediation available.',
                reference_urls: threat.reference_urls ?? []
            };
            this.threat_cache.set(threat.cve_id, newThreat);
        }
    }

    public getAssets(): Asset[] {
        return [...this.assets];
    }

    public getScans(): ScanResult[] {
        return [...this.scans];
    }

    public getThreat(cveId: string): ThreatInfo | undefined {
        return this.threat_cache.get(cveId);
    }

    public getDashboardStats(): import('../types/models').DashboardStats {
        const assets = this.getAssets();
        const scans = this.getScans();

        const uniqueVulnerabilities = new Set<string>();
        scans.forEach(scan => {
            scan.detected_cves.forEach(cve => uniqueVulnerabilities.add(cve));
        });

        // Count exploited CVEs in the unique set
        let exploitedCount = 0;
        uniqueVulnerabilities.forEach(cve => {
            const threat = this.threat_cache.get(cve);
            if (threat?.is_exploited_in_wild) {
                exploitedCount++;
            }
        });

        return {
            total_assets: assets.length,
            total_scans: scans.length,
            total_vulnerabilities: uniqueVulnerabilities.size,
            critical_assets: assets.filter(a => a.criticality_score >= 8).length,
            exploited_cves: exploitedCount
        };
    }
}
