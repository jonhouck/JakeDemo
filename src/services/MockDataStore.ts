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

    public updateThreatCache(threat: ThreatInfo): void {
        this.threat_cache.set(threat.cve_id, threat);
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
}
