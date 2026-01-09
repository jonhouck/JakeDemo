import { PrioritizationEngine } from '../PrioritizationEngine';
import { MockDataStore } from '../MockDataStore';

describe('PrioritizationEngine', () => {
    let engine: PrioritizationEngine;
    let store: MockDataStore;

    beforeEach(() => {
        store = MockDataStore.getInstance();
        store.reset();
        engine = new PrioritizationEngine();
    });

    it('should calculate risk score correctly: Criticality * CVSS', () => {
        store.addAsset({
            id: 'asset-1',
            hostname: 'host-1',
            ip: '10.0.0.1',
            os: 'Linux',
            criticality_score: 5,
            domain: 'local',
            owner: 'IT'
        });

        store.addScanResult({
            scan_id: 'scan-1',
            asset_id: 'asset-1',
            timestamp: new Date().toISOString(),
            detected_cves: ['CVE-TEST-1']
        });

        store.updateThreatCache({
            cve_id: 'CVE-TEST-1',
            cvss_score: 8.0,
            is_exploited_in_wild: false,
            description: 'Test',
            remediation_steps: 'Fix',
            reference_urls: []
        });

        const report = engine.generateReport();

        expect(report.length).toBe(1);
        // Score = 5 * 8 * 1.0 (Booster) = 40
        expect(report[0].risk_score).toBe(40);
        expect(report[0].priority_rank).toBe(1);
    });

    it('should apply 2.0 booster for exploited vulnerabilities', () => {
        store.addAsset({
            id: 'asset-1',
            hostname: 'host-1',
            ip: '10.0.0.1',
            os: 'Linux',
            criticality_score: 10,
            domain: 'local',
            owner: 'IT'
        });

        store.addScanResult({
            scan_id: 'scan-1',
            asset_id: 'asset-1',
            timestamp: new Date().toISOString(),
            detected_cves: ['CVE-CRITICAL']
        });

        store.updateThreatCache({
            cve_id: 'CVE-CRITICAL',
            cvss_score: 10.0,
            is_exploited_in_wild: true,
            description: 'Critical Exploit',
            remediation_steps: 'Patch Now',
            reference_urls: []
        });

        const report = engine.generateReport();

        // Score = 10 (Criticality) * 10 (CVSS) * 2.0 (Booster) = 200
        expect(report[0].risk_score).toBe(200);
    });

    it('should sort report by risk score descending', () => {
        // High Risk Asset
        store.addAsset({
            id: 'asset-high',
            hostname: 'high',
            ip: '1.1.1.1',
            os: 'Linux',
            criticality_score: 10,
            domain: 'local',
            owner: 'IT'
        });
        store.addScanResult({
            scan_id: 'scan-high',
            asset_id: 'asset-high',
            timestamp: 'now',
            detected_cves: ['CVE-HIGH']
        });
        store.updateThreatCache({ cve_id: 'CVE-HIGH', cvss_score: 10, is_exploited_in_wild: true });

        // Low Risk Asset
        store.addAsset({
            id: 'asset-low',
            hostname: 'low',
            ip: '2.2.2.2',
            os: 'Linux',
            criticality_score: 1,
            domain: 'local',
            owner: 'IT'
        });
        store.addScanResult({
            scan_id: 'scan-low',
            asset_id: 'asset-low',
            timestamp: 'now',
            detected_cves: ['CVE-LOW']
        });
        store.updateThreatCache({ cve_id: 'CVE-LOW', cvss_score: 1, is_exploited_in_wild: false });

        const report = engine.generateReport();

        expect(report.length).toBe(2);
        expect(report[0].asset_id).toBe('asset-high');
        expect(report[0].risk_score).toBe(200); // 10*10*2
        expect(report[1].asset_id).toBe('asset-low');
        expect(report[1].risk_score).toBe(1);   // 1*1*1
    });
});
