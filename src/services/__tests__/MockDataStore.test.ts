import { MockDataStore } from '../MockDataStore';
import { Asset, ScanResult, ThreatInfo } from '../../types/models';

describe('MockDataStore', () => {
    let store: MockDataStore;

    beforeEach(() => {
        store = MockDataStore.getInstance();
        store.reset();
    });

    it('should maintain singleton instance', () => {
        const store2 = MockDataStore.getInstance();
        expect(store).toBe(store2);
    });

    it('should manage assets', () => {
        const asset: Asset = {
            id: '1',
            hostname: 'test-host',
            ip: '192.168.1.1',
            os: 'Linux',
            criticality_score: 5,
            domain: 'example.com',
            owner: 'admin',
        };

        store.addAsset(asset);
        expect(store.getAssets()).toHaveLength(1);
        expect(store.getAssets()[0]).toEqual(asset);
    });

    it('should manage scan results', () => {
        const scan: ScanResult = {
            scan_id: 'scan-1',
            asset_id: '1',
            timestamp: '2023-01-01T00:00:00Z',
            detected_cves: ['CVE-2023-1234'],
        };

        store.addScanResult(scan);
        expect(store.getScans()).toHaveLength(1);
        expect(store.getScans()[0]).toEqual(scan);
    });

    it('should manage threat cache', () => {
        const threat: ThreatInfo = {
            cve_id: 'CVE-2023-1234',
            cvss_score: 9.8,
            is_exploited_in_wild: true,
            description: 'Critical vulnerability',
            remediation_steps: 'Patch immediately',
            reference_urls: ['http://example.com'],
        };

        store.updateThreatCache(threat);
        expect(store.getThreat('CVE-2023-1234')).toEqual(threat);
        expect(store.getThreat('CVE-UNKNOWN')).toBeUndefined();
    });

    it('should reset data', () => {
        store.addAsset({ id: '1' } as Asset);
        store.reset();
        expect(store.getAssets()).toHaveLength(0);
    });

    it('should calculate dashboard stats correctly', () => {
        // Add assets
        store.addAsset({ id: 'a1', criticality_score: 9 } as Asset); // Critical
        store.addAsset({ id: 'a2', criticality_score: 5 } as Asset); // Normal

        // Add scans
        // Scan 1: Exploit
        store.addScanResult({
            scan_id: 's1', asset_id: 'a1', timestamp: 'now', detected_cves: ['CVE-EXPLOITED']
        } as ScanResult);

        // Scan 2: Non-exploit
        store.addScanResult({
            scan_id: 's2', asset_id: 'a2', timestamp: 'now', detected_cves: ['CVE-SAFE']
        } as ScanResult);

        // Add threats to cache
        store.updateThreatCache({
            cve_id: 'CVE-EXPLOITED', is_exploited_in_wild: true
        } as unknown as ThreatInfo); // Using unknown for partial mocking in test context

        store.updateThreatCache({
            cve_id: 'CVE-SAFE', is_exploited_in_wild: false
        } as unknown as ThreatInfo);

        const stats = store.getDashboardStats();

        expect(stats.total_assets).toBe(2);
        expect(stats.total_scans).toBe(2);
        expect(stats.total_vulnerabilities).toBe(2); // Unique CVEs
        expect(stats.critical_assets).toBe(1); // Score >= 8
        expect(stats.exploited_cves).toBe(1);
    });
});
