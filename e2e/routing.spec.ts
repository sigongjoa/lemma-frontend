import { test, expect } from '@playwright/test'

test.describe('Route Protection', () => {
  test('/ redirects unauthenticated user to /login', async ({ page }) => {
    await page.goto('/lemma-frontend/')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/student redirects unauthenticated user to /login', async ({ page }) => {
    await page.goto('/lemma-frontend/student')
    await expect(page).toHaveURL(/\/login/)
  })

  test('/teacher redirects unauthenticated user to /login', async ({ page }) => {
    await page.goto('/lemma-frontend/teacher')
    await expect(page).toHaveURL(/\/login/)
  })

  test('unknown route redirects to /', async ({ page }) => {
    await page.goto('/lemma-frontend/nonexistent-route')
    // Should land on login (unauthenticated → redirect to login)
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('404 and Error Handling', () => {
  test('returns 200 for root path (SPA shell)', async ({ page }) => {
    const response = await page.goto('/lemma-frontend/')
    expect(response?.status()).toBe(200)
  })

  test('returns 200 for deep SPA routes (client-side routing)', async ({ page }) => {
    // GitHub Pages SPA routing — the server serves index.html for all paths
    const response = await page.goto('/lemma-frontend/login')
    expect(response?.status()).toBe(200)
  })
})
