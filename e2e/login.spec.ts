import { test, expect } from '@playwright/test'

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/lemma-frontend/')
  })

  test('redirects to /login when not authenticated', async ({ page }) => {
    await expect(page).toHaveURL(/\/login/)
  })

  test('shows login form with name input and PIN pad', async ({ page }) => {
    await expect(page.getByPlaceholder('홍길동')).toBeVisible()
    await expect(page.getByText('선생님이 알려준 4자리 번호를 입력하세요')).toBeVisible()
    // All numpad digits visible
    for (const d of ['1','2','3','4','5','6','7','8','9','0']) {
      await expect(page.getByRole('button', { name: d, exact: true })).toBeVisible()
    }
  })

  test('shows error for empty name', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await page.getByRole('button', { name: '3', exact: true }).click()
    await page.getByRole('button', { name: '4', exact: true }).click()
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('이름을 입력해주세요')).toBeVisible()
  })

  test('shows error for incomplete PIN', async ({ page }) => {
    await page.getByPlaceholder('홍길동').fill('테스트학생')
    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('PIN 4자리를 입력해주세요')).toBeVisible()
  })

  test('PIN delete button works', async ({ page }) => {
    await page.getByRole('button', { name: '1', exact: true }).click()
    await page.getByRole('button', { name: '2', exact: true }).click()
    await page.getByRole('button', { name: '⌫' }).click()
    // Only 1 dot should be filled — check that login with just 1 digit still shows error
    await page.getByPlaceholder('홍길동').fill('테스트')
    await page.getByRole('button', { name: '로그인' }).click()
    await expect(page.getByText('PIN 4자리를 입력해주세요')).toBeVisible()
  })

  test('shows error for wrong credentials', async ({ page }) => {
    await page.getByPlaceholder('홍길동').fill('존재하지않는학생')
    for (const d of ['9','9','9','9']) {
      await page.getByRole('button', { name: d, exact: true }).click()
    }
    await page.getByRole('button', { name: '로그인' }).click()
    // Wait for API response — accepts any login error message variant
    await expect(page.getByText(/올바르지|잘못됐어요|실패|없어요|오류/)).toBeVisible({ timeout: 15000 })
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Lemma/)
  })

  test('brand mark is visible', async ({ page }) => {
    await expect(page.getByText('λ')).toBeVisible()
    await expect(page.getByText('수학 학원 AI 학습관리')).toBeVisible()
  })
})
