const { test, expect } = require('@playwright/test');

test.describe('Fieldnote Ops Dashboard — filter flow', () => {
  test('dashboard loads with data, then narrows when the user filters by category', async ({ page }) => {
    await page.goto('/');

    // 1. Dashboard loads and renders real data from the backend
    await expect(page.getByText('Total runs logged')).toBeVisible();
    const totalBefore = await page
      .locator('.stat-card', { hasText: 'Total runs logged' })
      .locator('.stat-card__value')
      .innerText();
    const totalRunsBefore = parseInt(totalBefore, 10);
    expect(totalRunsBefore).toBeGreaterThan(0);

    // The donut chart should show more than one category before filtering
    await expect(page.getByText('Runs by category')).toBeVisible();

    // 2. User applies a category filter — a real interaction, not a mock
    await page.getByLabel('Category').selectOption('Robotics');

    // 3. The stat cards and charts update to reflect the filtered dataset
    await expect(async () => {
      const totalAfter = await page
        .locator('.stat-card', { hasText: 'Total runs logged' })
        .locator('.stat-card__value')
        .innerText();
      expect(parseInt(totalAfter, 10)).toBeLessThan(totalRunsBefore);
    }).toPass({ timeout: 5000 });

    // The donut chart's caption should now report only the "Robotics" category
    await expect(page.getByText(/across 1 categor/i)).toBeVisible();
  });

  test('an out-of-range date filter shows the empty state, not stale data', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Total runs logged')).toBeVisible();

    await page.getByLabel('From').fill('2099-01-01');
    await page.getByLabel('To').fill('2099-01-31');

    await expect(page.getByText(/No runs match these filters/i)).toBeVisible({ timeout: 5000 });
  });
});
