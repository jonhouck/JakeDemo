import { MockDataStore } from './MockDataStore';
import { Asset, ScanResult } from '../types/models';
import { CURATED_CVES } from '../data/cve_list';

export class MockDataGenerator {
    private static readonly TEAMS = ['Engineering', 'Finance', 'HR', 'Sales', 'Marketing', 'IT'];
    private static readonly OS_LIST = ['Linux (Ubuntu)', 'Linux (CentOS)', 'Windows Server 2019', 'Windows Server 2022', 'Windows 10', 'macOS'];

    public static initializeData(count: number = 500): void {
        const store = MockDataStore.getInstance();

        // Idempotency check: don't generate if already populated
        if (store.getAssets().length > 0) {
            console.log('Mock data already initialized, skipping.');
            return;
        }

        console.log(`Generating ${count} mock assets...`);
        const assets = this.generateAssets(count);
        assets.forEach(asset => store.addAsset(asset));

        console.log('Generating scan results...');
        const scans = this.generateScans(assets);
        scans.forEach(scan => store.addScanResult(scan));

        console.log('Mock data generation complete.');
    }

    public static generateAssets(count: number): Asset[] {
        const assets: Asset[] = [];
        for (let i = 0; i < count; i++) {
            assets.push({
                id: `asset-${i}`,
                hostname: `server-${Math.floor(Math.random() * 10000)}`,
                ip: `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
                os: this.OS_LIST[Math.floor(Math.random() * this.OS_LIST.length)],
                criticality_score: this.getWeightedCriticality(),
                domain: 'example-corp.local',
                owner: this.TEAMS[Math.floor(Math.random() * this.TEAMS.length)],
            });
        }
        return assets;
    }

    public static generateScans(assets: Asset[]): ScanResult[] {
        return assets.map(asset => ({
            scan_id: `scan-${asset.id}`,
            asset_id: asset.id,
            timestamp: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
            detected_cves: this.getRandomCVEs(),
        }));
    }

    private static getWeightedCriticality(): number {
        // Updated for demo: More critical assets to show "problems"
        const rand = Math.random();
        if (rand < 0.1) return Math.floor(Math.random() * 2) + 1; // 1-2 (10%)
        if (rand > 0.7) return Math.floor(Math.random() * 3) + 8; // 8-10 (30%) - Increased from 10%
        return Math.floor(Math.random() * 5) + 3; // 3-7 (60%)
    }

    private static getRandomCVEs(): string[] {
        // Increased density: 1 to 6 CVEs per asset
        const count = Math.floor(Math.random() * 6) + 1;
        const cves: string[] = [];
        for (let i = 0; i < count; i++) {
            const cve = CURATED_CVES[Math.floor(Math.random() * CURATED_CVES.length)];
            if (!cves.includes(cve)) {
                cves.push(cve);
            }
        }
        return cves;
    }
}
