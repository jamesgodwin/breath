import { test, expect } from '@playwright/test';

async function fitsViewport(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

test('phone layout, scrolling settings and saved choices survive reload', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeInViewport();
  const title = await page.getByRole('heading').boundingBox();
  expect(title.x).toBeGreaterThanOrEqual(0);
  expect(title.x + title.width).toBeLessThanOrEqual(page.viewportSize().width);
  await fitsViewport(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).tap();
  await fitsViewport(page);
  const lastCard = page.getByRole('heading', { name: 'Cleansing Breath', exact: true });
  await lastCard.scrollIntoViewIfNeeded();
  await expect(lastCard).toBeInViewport();
  const card = await lastCard.locator('..').boundingBox();
  expect(card.x).toBeGreaterThanOrEqual(0);
  expect(card.x + card.width).toBeLessThanOrEqual(page.viewportSize().width);
  await lastCard.tap();
  await page.getByRole('button', { name: 'Close', exact: true }).tap();
  await page.getByRole('button', { name: 'Up', exact: true }).tap();
  const duration = page.getByRole('button', { name: '20 min', exact: true });
  await duration.scrollIntoViewIfNeeded();
  await duration.tap();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Cleansing Breath', exact: true })).toBeVisible();
  await expect(page.getByText('20 min', { exact: true })).toBeVisible();
  await page.screenshot({ path: `output/playwright/${test.info().project.name}-start.png` });
  expect(errors).toEqual([]);
});

test('touch timer pauses, resumes and records completion once', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await page.getByRole('button', { name: 'Up', exact: true }).tap();
  await page.getByRole('button', { name: '0:30', exact: true }).tap();
  await page.getByRole('button', { name: 'Start', exact: true }).tap();
  await page.clock.runFor(2000);
  await page.getByText('Inhale', { exact: true }).tap();
  await page.getByRole('button', { name: 'Pause', exact: true }).tap();
  const timer = page.getByText(/^00:\d{2}$/);
  const paused = await timer.innerText();
  await page.clock.runFor(60000);
  await expect(timer).toHaveText(paused);
  await page.getByRole('button', { name: 'Play', exact: true }).tap();
  await page.clock.runFor(31000);
  await expect(page.getByText('Breathing Sessions', { exact: true })).toBeVisible();
  await page.clock.runFor(30000);
  expect(await page.evaluate(() => localStorage.getItem('taoistBreathSessions'))).toBe('1');
  await page.getByRole('button', { name: 'Continue', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeVisible();
});

test('landscape settings remain scrollable and can be closed', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Settings', exact: true }).tap();
  const lastCard = page.getByRole('heading', { name: 'Cleansing Breath', exact: true });
  await lastCard.scrollIntoViewIfNeeded();
  await lastCard.tap();
  await page.getByRole('button', { name: 'Close', exact: true }).tap();
  await expect(page.getByRole('button', { name: 'Start', exact: true })).toBeInViewport();
  await fitsViewport(page);
});
