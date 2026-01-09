import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    // Check for the rendered h1, not just the meta title
    await expect(page.getByRole('heading', { name: 'CVE Remediation PoC' })).toBeVisible();
});

test('shows dashboard components', async ({ page }) => {
    await page.goto('/');

    // Check for main dashboard sections
    await expect(page.getByText('Security Posture Overview')).toBeVisible();
    await expect(page.getByText('Prioritized Remediation Actions')).toBeVisible();

    // Check for stats
    await expect(page.getByText('Total Assets')).toBeVisible();

    // Wait for data to load (since it fetches on mount)
    // The skeleton loader disappears and stats appear.
    // We check for a non-zero value or just the labels for now.
    await expect(page.getByText('High Risk Vulns')).toBeVisible();

    // Check that we don't see the loading state anymore (implies successful load)
    await expect(page.getByText('Loading remediation data...')).not.toBeVisible({ timeout: 10000 });
});
