import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
    it('renders stats', () => {
        render(<Home />);
        expect(screen.getByText('CVE Remediation PoC')).toBeInTheDocument();
        expect(screen.getByText('Mock Data Initialization Complete.')).toBeInTheDocument();
    });
});
