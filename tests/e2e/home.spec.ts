import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Create Next App/); // Title meta tag hasn't changed yet
});

test('shows mock data stats', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('CVE Remediation PoC')).toBeVisible();
    await expect(page.getByText('Mock Data Initialization Complete.')).toBeVisible();
});
