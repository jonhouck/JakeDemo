import { OsintService } from '../OsintService';
import { MockDataStore } from '../MockDataStore';

// Mock global fetch
global.fetch = jest.fn();

describe('OsintService', () => {
    let service: OsintService;
    let store: MockDataStore;

    beforeEach(() => {
        store = MockDataStore.getInstance();
        store.reset();
        service = new OsintService();
        jest.clearAllMocks();
    });

    it('should fetch CISA KEV data and update the store', async () => {
        const mockCisaResponse = {
            vulnerabilities: [
                {
                    cveID: 'CVE-2021-44228',
                    vendorProject: 'Apache',
                    product: 'Log4j',
                    vulnerabilityName: 'Apache Log4j Core Remote Code Execution Vulnerability',
                    dateAdded: '2021-12-10',
                    shortDescription: 'Apache Log4j2 JNDI features do not protect against attacker controlled LDAP and other JNDI related endpoints.',
                    requiredAction: 'Apply updates.',
                    dueDate: '2021-12-24',
                    notes: 'Legacy'
                }
            ]
        };

        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            json: async () => mockCisaResponse
        });

        await service.fetchCisaKevData();

        const threat = store.getThreat('CVE-2021-44228');
        expect(threat).toBeDefined();
        expect(threat?.is_exploited_in_wild).toBe(true);
        expect(threat?.description).toBe(mockCisaResponse.vulnerabilities[0].shortDescription);
        expect(threat?.remediation_steps).toBe(mockCisaResponse.vulnerabilities[0].requiredAction);
    });

    it('should handle fetch errors gracefully', async () => {
        console.error = jest.fn(); // Suppress console.error
        (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

        await service.fetchCisaKevData();

        // Should not throw and should log error
        expect(console.error).toHaveBeenCalled();
    });

    it('should enrich CVE with default data if not in cache', async () => {
        const cveId = 'CVE-2023-9999';
        const threat = await service.enrichCVE(cveId);

        expect(threat).toBeDefined();
        expect(threat.cve_id).toBe(cveId);
        expect(threat.is_exploited_in_wild).toBe(false); // Default

        // existing entry in store
        const stored = store.getThreat(cveId);
        expect(stored).toEqual(threat);
    });

    it('should return existing data (enriched) if already in cache', async () => {
        const cveId = 'CVE-2021-44228';
        store.updateThreatCache({
            cve_id: cveId,
            is_exploited_in_wild: true,
            description: 'Existing',
            remediation_steps: 'Patch',
            cvss_score: 10,
            reference_urls: []
        });

        const threat = await service.enrichCVE(cveId);

        expect(threat.description).toBe('Existing');
        expect(threat.cvss_score).toBe(10);
    });
});
