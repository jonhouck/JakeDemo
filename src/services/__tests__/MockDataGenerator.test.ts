import { MockDataGenerator } from '../../services/MockDataGenerator';
import { MockDataStore } from '../../services/MockDataStore';
import { CURATED_CVES } from '../../data/cve_list';

describe('MockDataGenerator', () => {
    let store: MockDataStore;

    beforeEach(() => {
        store = MockDataStore.getInstance();
        store.reset();
    });

    it('should generate requested number of assets', () => {
        const assets = MockDataGenerator.generateAssets(10);
        expect(assets).toHaveLength(10);
        expect(assets[0].id).toBeDefined();
        expect(assets[0].ip).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });

    it('should generate scans linked to assets', () => {
        const assets = MockDataGenerator.generateAssets(5);
        const scans = MockDataGenerator.generateScans(assets);

        expect(scans).toHaveLength(5);
        expect(scans[0].asset_id).toBe(assets[0].id);
        expect(scans[0].detected_cves).toBeDefined();
    });

    it('should use curated CVEs', () => {
        const assets = MockDataGenerator.generateAssets(1);
        const scans = MockDataGenerator.generateScans(assets);

        // Check if detected CVEs (if any) are in the curated list
        scans[0].detected_cves.forEach(cve => {
            expect(CURATED_CVES).toContain(cve);
        });
    });

    it('initializeData should populate store idempotently', () => {
        // First run
        MockDataGenerator.initializeData(100);
        expect(store.getAssets()).toHaveLength(100);
        expect(store.getScans()).toHaveLength(100);

        // Second run should skip
        MockDataGenerator.initializeData(500);
        expect(store.getAssets()).toHaveLength(100); // Should remain 100
    });
});
