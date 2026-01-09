import { MockDataStore } from './MockDataStore';
import { RemediationItem } from '../types/models';

export class PrioritizationEngine {
    private store: MockDataStore;

    constructor() {
        this.store = MockDataStore.getInstance();
    }

    /**
     * Generates a prioritized remediation report.
     * Risk Score = Asset Criticality * CVSS Score * Booster
     * Booster = 2.0 if exploited in wild, else 1.0
     */
    public generateReport(): RemediationItem[] {
        const assets = this.store.getAssets();
        const scans = this.store.getScans();
        const report: RemediationItem[] = [];

        // Map assets for O(1) lookup
        const assetMap = new Map(assets.map(a => [a.id, a]));

        for (const scan of scans) {
            const asset = assetMap.get(scan.asset_id);
            if (!asset) continue;

            for (const cveId of scan.detected_cves) {
                let threat = this.store.getThreat(cveId);

                if (!threat) {
                    // Fallback if threat not in cache (should be enriched by OsintService, 
                    // but we handle missing case safely)
                    threat = {
                        cve_id: cveId,
                        cvss_score: 0,
                        is_exploited_in_wild: false,
                        description: 'Unknown vulnerability',
                        remediation_steps: 'Investigate',
                        reference_urls: []
                    };
                }

                const booster = threat.is_exploited_in_wild ? 2.0 : 1.0;
                const riskScore = asset.criticality_score * threat.cvss_score * booster;

                report.push({
                    asset_id: asset.id,
                    hostname: asset.hostname,
                    ip_address: asset.ip,
                    cve_id: cveId,
                    risk_score: riskScore,
                    priority_rank: 0, // Placeholder, set after sorting
                    threat_info: threat
                });
            }
        }

        // Sort by Risk Score descending
        report.sort((a, b) => b.risk_score - a.risk_score);

        // Assign Rank
        report.forEach((item, index) => {
            item.priority_rank = index + 1;
        });

        return report;
    }
}
