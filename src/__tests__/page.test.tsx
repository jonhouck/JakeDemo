import { render, screen, waitFor } from '@testing-library/react';
import Home from '@/app/page';

// Mock global fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
) as jest.Mock;

describe('Home', () => {
    beforeEach(() => {
        // Clear mock calls between tests
        (global.fetch as jest.Mock).mockClear();
    });

    it('renders dashboard with correct header', async () => {
        render(<Home />);

        // Use regex to match text split across elements or with different spacing
        expect(screen.getByText(/CVE Remediation/i)).toBeInTheDocument();
        expect(screen.getByText(/PoC/i)).toBeInTheDocument();

        // Verify dashboard specific content
        expect(screen.getByText(/Security Posture Overview/i)).toBeInTheDocument();
        expect(screen.getByText(/Prioritized Remediation Actions/i)).toBeInTheDocument();
    });
});
