import { expect, test, type Page } from '@playwright/test';

async function mockVisitorHistories(page: Page) {
  await page.route('**/api/anonymous-histories', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ history: 'Una historia de prueba.', usage: { limit: 3, remaining: 2, resetAt: '2026-09-12T00:00:00.000Z' } }) });
      return;
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ histories: [] }) });
  });
}

test('visitor flow shows the daily-limit conversion dialog without a stored account', async ({ page }) => {
  await page.route('**/api/anonymous-histories', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 429, contentType: 'application/json', body: JSON.stringify({ usage: { limit: 3, remaining: 0, resetAt: '2026-09-12T00:00:00.000Z' } }) });
      return;
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ histories: [] }) });
  });

  const response = await page.goto('/explore');
  await expect(page.getByRole('heading', { name: 'Historias con un lugar al que volver.' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Tema' }).fill('Misterio');
  await page.getByRole('button', { name: 'Crear historia' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute('href', '/register');
  await expect(dialog.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/sign-in');
  await expect.poll(() => page.evaluate(() => localStorage.getItem('vault_history_session'))).toBeNull();
  expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  expect(response?.headers()['cache-control']).not.toContain('no-store');
});

test('theme choice persists across a reload', async ({ page }) => {
  await mockVisitorHistories(page);
  await page.goto('/explore');
  await page.getByRole('button', { name: 'Activar modo oscuro' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('sign-in uses the BFF and reaches the personal library without browser token storage', async ({ page }) => {
  let signInRequests = 0;
  await page.route('**/api/auth/sign-in', async (route) => {
    signInRequests += 1;
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ expiresAt: '2026-10-01T00:00:00.000Z' }) });
  });
  await page.route('**/api/histories?*', async (route) => {
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ histories: [], meta: { page: 1, pageSize: 12, total: 0, totalPages: 0 } }) });
  });

  await page.goto('/sign-in');
  await page.getByLabel('Email').fill('reader@example.com');
  await page.getByLabel('Contraseña').fill('a-secure-password');
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();

  await expect(page).toHaveURL('/library');
  await expect(page.getByRole('heading', { name: 'Biblioteca' })).toBeVisible();
  expect(signInRequests).toBe(1);
  await expect.poll(() => page.evaluate(() => localStorage.getItem('vault_history_session'))).toBeNull();
});
