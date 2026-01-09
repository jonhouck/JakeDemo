import { MockDataStore } from './MockDataStore';
import { ThreatInfo } from '../types/models';

export class OsintService {
    private store: MockDataStore;
    private static CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

    constructor() {
        this.store = MockDataStore.getInstance();
    }

    /**
     * Fetches the CISA Known Exploited Vulnerabilities catalog
     * and updates the threat cache.
     */
    public async fetchCisaKevData(): Promise<void> {
        try {
            console.log('Fetching CISA KEV data...');
            const response = await fetch(OsintService.CISA_KEV_URL);

            if (!response.ok) {
                throw new Error(`Failed to fetch CISA KEV data: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.vulnerabilities) {
                console.warn('Invalid CISA KEV data format: missing "vulnerabilities" field');
                return;
            }

            let newExploitedCount = 0;
            for (const vul of data.vulnerabilities) {
                // vul structure from CISA: { cveID, vendorProject, product, vulnerabilityName, dateAdded, shortDescription, requiredAction, dueDate, knownRansomwareCampaignUse, notes }
                const cveId = vul.cveID;

                // We update the cache. 
                // Note: CISA data is primarily about "is_exploited_in_wild" being TRUE.
                // We also get some description and remediation (requiredAction).
                this.store.updateThreatCache({
                    cve_id: cveId,
                    is_exploited_in_wild: true,
                    description: vul.shortDescription,
                    remediation_steps: vul.requiredAction,
                    reference_urls: [] // CISA JSON doesn't always have a clean list of URLs in the main object, sometimes in notes
                });
                newExploitedCount++;
            }
            console.log(`Processed ${newExploitedCount} exploited vulnerabilities from CISA.`);

        } catch (error) {
            console.error('Error fetching CISA KEV data:', error);
            // We don't throw here to avoid crashing the app startup, 
            // but we log it.
        }
    }

    /**
     * Enriches a specific CVE.
     * If data is missing in cache (like CVSS), we could fetch from OSV.dev here.
     * For MVP Task 2.1, we focus on returning what's in the store or a default.
     */
    public async enrichCVE(cveId: string): Promise<ThreatInfo> {
        let threat = this.store.getThreat(cveId);

        if (!threat) {
            // If not in cache, create a default entry.
            // In a real scenario, we might query OSV.dev here on demand.
            threat = {
                cve_id: cveId,
                cvss_score: 0,
                is_exploited_in_wild: false,
                description: 'Description pending enrichment...',
                remediation_steps: 'Assess locally.',
                reference_urls: []
            };
            this.store.updateThreatCache(threat);
        }

        return threat;
    }
}
