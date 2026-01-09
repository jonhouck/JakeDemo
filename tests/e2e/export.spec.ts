import { test, expect } from '@playwright/test';

test.describe('Dashboard Export', () => {
    test('export buttons are visible and triggering download', async ({ page }) => {
        await page.goto('/');

        // Check availability of buttons
        const jsonBtn = page.getByRole('button', { name: 'Export JSON' });
        const mdBtn = page.getByRole('button', { name: 'MD' });

        await expect(jsonBtn).toBeVisible();
        await expect(mdBtn).toBeVisible();

        // Wait for data to load
        await expect(page.getByText('Loading remediation data...')).not.toBeVisible({ timeout: 10000 });
        // Also ensuring table has items (check for rows or specific text)
        await expect(page.locator('table tbody tr')).not.toHaveCount(0);

        // Verify download JSON
        const downloadPromiseJson = page.waitForEvent('download');
        await jsonBtn.click();
        const downloadJson = await downloadPromiseJson;
        expect(downloadJson.suggestedFilename()).toMatch(/cve-report-.*\.json/);

        // Verify download Markdown
        const downloadPromiseMd = page.waitForEvent('download');
        await mdBtn.click();
        const downloadMd = await downloadPromiseMd;
        expect(downloadMd.suggestedFilename()).toMatch(/cve-report-.*\.md/);
    });
});
