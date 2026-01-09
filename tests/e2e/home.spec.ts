import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Create Next App/);
});

test('get started link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Documentation' })).toBeVisible();
});
