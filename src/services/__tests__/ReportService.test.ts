import { ReportService } from '../ReportService';
import { RemediationItem } from '@/types/models';

describe('ReportService', () => {
    const mockItems: RemediationItem[] = [
        {
            asset_id: 'asset-1',
            cve_id: 'CVE-2024-1234',
            risk_score: 9.5,
            priority_rank: 1,
            hostname: 'server-01',
            ip_address: '192.168.1.10',
            threat_info: {
                cve_id: 'CVE-2024-1234',
                description: 'Critical vulnerability',
                cvss_score: 9.8,
                is_exploited_in_wild: true,
                remediation_steps: 'Apply vendor patch',
                reference_urls: []
            }
        },
        {
            asset_id: 'asset-2',
            cve_id: 'CVE-2024-5678',
            risk_score: 7.2,
            priority_rank: 2,
            hostname: 'workstation-05',
            ip_address: '192.168.1.50',
            threat_info: {
                cve_id: 'CVE-2024-5678',
                description: 'High severity issue',
                cvss_score: 7.5,
                is_exploited_in_wild: false,
                remediation_steps: 'Update to v2.0',
                reference_urls: []
            }
        }
    ];

    const readBlobText = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(blob);
        });
    };

    describe('generateJson', () => {
        it('should generate a valid JSON blob', async () => {
            const blob = ReportService.generateJson(mockItems);
            expect(blob).toBeInstanceOf(Blob);
            expect(blob.type).toBe('application/json');

            const text = await readBlobText(blob);
            const parsed = JSON.parse(text);
            expect(parsed).toHaveLength(2);
            expect(parsed[0].cve_id).toBe('CVE-2024-1234');
        });
    });

    describe('generateMarkdown', () => {
        it('should generate a valid Markdown blob with correct formatting', async () => {
            const blob = ReportService.generateMarkdown(mockItems);
            expect(blob).toBeInstanceOf(Blob);
            expect(blob.type).toBe('text/markdown');

            const text = await readBlobText(blob);
            expect(text).toContain('# CVE Remediation Report');
            expect(text).toContain('Total Items: 2');
            expect(text).toContain('| Rank | Risk Score | Asset | CVE ID | Severity | Status |');
            expect(text).toContain('| 1 | 9.5');
            expect(text).toContain('⚠️ EXPLOITED'); // CVE-2024-1234 is exploited
            expect(text).toContain('server-01 (192.168.1.10)');

            // Check second item
            expect(text).toContain('| 2 | 7.2');
            expect(text).toContain('Active'); // Not exploited
        });
    });

    describe('downloadFile', () => {
        let createObjectURLMock: jest.Mock;
        let revokeObjectURLMock: jest.Mock;
        let appendChildSpy: jest.SpyInstance;
        let removeChildSpy: jest.SpyInstance;
        let clickMock: jest.Mock;

        beforeEach(() => {
            createObjectURLMock = jest.fn().mockReturnValue('blob:url');
            revokeObjectURLMock = jest.fn();
            global.URL.createObjectURL = createObjectURLMock;
            global.URL.revokeObjectURL = revokeObjectURLMock;

            clickMock = jest.fn();
            const anchorMock = {
                href: '',
                download: '',
                click: clickMock,
                // Add any other properties accessed by the code
            } as unknown as HTMLAnchorElement;

            jest.spyOn(document, 'createElement').mockReturnValue(anchorMock);
            appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => anchorMock);
            removeChildSpy = jest.spyOn(document.body, 'removeChild').mockImplementation(() => anchorMock);
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('should trigger a download with the correct parameters', () => {
            const blob = new Blob(['test'], { type: 'text/plain' });
            const filename = 'test.txt';

            ReportService.downloadFile(blob, filename);

            expect(createObjectURLMock).toHaveBeenCalledWith(blob);
            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(document.body.appendChild).toHaveBeenCalled();
            expect(clickMock).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalled();
            expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:url');
        });
    });
});
