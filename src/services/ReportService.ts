import { RemediationItem } from '@/types/models';

export class ReportService {
    static generateJson(items: RemediationItem[]): Blob {
        const jsonString = JSON.stringify(items, null, 2);
        return new Blob([jsonString], { type: 'application/json' });
    }

    static generateMarkdown(items: RemediationItem[]): Blob {
        let md = '# CVE Remediation Report\n\n';
        md += `Generated on: ${new Date().toLocaleString()}\n`;
        md += `Total Items: ${items.length}\n\n`;

        md += '| Rank | Risk Score | Asset | CVE ID | Severity | Status |\n';
        md += '|---|---|---|---|---|---|\n';

        items.forEach(item => {
            const status = item.threat_info.is_exploited_in_wild ? '⚠️ EXPLOITED' : 'Active';
            md += `| ${item.priority_rank} | ${item.risk_score.toFixed(1)} | ${item.hostname} (${item.ip_address}) | ${item.cve_id} | ${item.threat_info.cvss_score} | ${status} |\n`;
        });

        md += '\n\n## Detailed Remediation Steps\n\n';

        items.forEach(item => {
            md += `### #${item.priority_rank} - ${item.cve_id} on ${item.hostname}\n`;
            md += `- **Risk Score**: ${item.risk_score.toFixed(1)}\n`;
            md += `- **Description**: ${item.threat_info.description}\n`;
            md += `- **Remediation**: ${item.threat_info.remediation_steps || 'See standard patching procedures.'}\n`;
            if (item.threat_info.reference_urls?.length) {
                md += `- **References**:\n`;
                item.threat_info.reference_urls.forEach(url => md += `  - ${url}\n`);
            }
            md += '\n---\n\n';
        });

        return new Blob([md], { type: 'text/markdown' });
    }

    static downloadFile(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}
