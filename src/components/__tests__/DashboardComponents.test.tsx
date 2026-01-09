import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardStats } from '../DashboardStats';
import { RemediationTable } from '../RemediationTable';
import { DashboardStats as StatsType, RemediationItem } from '@/types/models';

describe('DashboardStats', () => {
    const mockStats: StatsType = {
        total_assets: 100,
        total_scans: 50,
        total_vulnerabilities: 200,
        critical_assets: 10,
        exploited_cves: 5
    };

    it('renders loading state', () => {
        const { container } = render(<DashboardStats stats={null} loading={true} />);
        expect(container.getElementsByClassName('animate-pulse').length).toBe(1);
    });

    it('renders stats correctly', () => {
        render(<DashboardStats stats={mockStats} loading={false} />);
        expect(screen.getByText('Total Assets').nextSibling).toHaveTextContent('100');
        expect(screen.getByText('Critical Assets').nextSibling).toHaveTextContent('10');
        expect(screen.getByText('High Risk Vulns').nextSibling).toHaveTextContent('200');
        expect(screen.getByText('Exploited CVEs').nextSibling).toHaveTextContent('5');
    });
});

describe('RemediationTable', () => {
    const mockItem: RemediationItem = {
        asset_id: 'asset-1',
        hostname: 'server-db-01',
        ip_address: '10.0.0.5',
        cve_id: 'CVE-2023-1234',
        risk_score: 95.5,
        priority_rank: 1,
        threat_info: {
            cve_id: 'CVE-2023-1234',
            cvss_score: 9.8,
            is_exploited_in_wild: true,
            description: 'Critical RCE',
            remediation_steps: 'Patch now',
            reference_urls: []
        }
    };

    it('renders loading state', () => {
        render(<RemediationTable items={[]} apiLoading={true} onViewDetails={() => { }} />);
        expect(screen.getByText('Loading remediation data...')).toBeInTheDocument();
    });

    it('renders empty state', () => {
        render(<RemediationTable items={[]} apiLoading={false} onViewDetails={() => { }} />);
        expect(screen.getByText('No remediation items found. System secure?')).toBeInTheDocument();
    });

    it('renders table items', () => {
        render(<RemediationTable items={[mockItem]} apiLoading={false} onViewDetails={() => { }} />);
        expect(screen.getByText('server-db-01')).toBeInTheDocument();
        expect(screen.getByText('CVE-2023-1234')).toBeInTheDocument();
        expect(screen.getByText('9.8')).toBeInTheDocument();
        expect(screen.getByText(/Exploited/i)).toBeInTheDocument();
    });

    it('calls onViewDetails when button clicked', () => {
        const mockViewDetails = jest.fn();
        render(<RemediationTable items={[mockItem]} apiLoading={false} onViewDetails={mockViewDetails} />);
        fireEvent.click(screen.getByText('Details'));
        expect(mockViewDetails).toHaveBeenCalledWith(mockItem);
    });
});
