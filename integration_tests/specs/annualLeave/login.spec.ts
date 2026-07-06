import { expect, test } from '@playwright/test'
import LoginPage from '../../pages/annualLeave/loginPage'
import { annualLeaveUrls, loginAndNavigateToDashboard } from '../../support/annualLeaveUtils'

test.describe('Login', () => {
  test('should show sign in page', async ({ page }) => {
    await page.goto(annualLeaveUrls.login)

    await LoginPage.verifyOnPage(page)
  })

  test('should redirect unauthenticated user to login', async ({ page }) => {
    await page.goto(annualLeaveUrls.dashboard)

    await expect(page).toHaveURL(new RegExp(annualLeaveUrls.login))
  })

  test('should navigate to dashboard after successful login', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto(annualLeaveUrls.login)

    const loginPage = await LoginPage.verifyOnPage(page)
    await loginPage.signIn('wrong@example.com', 'wrongpassword')

    await expect(loginPage.errorAlert).toBeVisible()
  })

  test('should show validation error when email is empty', async ({ page }) => {
    await page.goto(annualLeaveUrls.login)

    const loginPage = await LoginPage.verifyOnPage(page)
    await loginPage.signIn('', 'password123')

    await expect(page.locator('.govuk-error-summary').getByText('Enter your email address')).toBeVisible()
  })

  test('should show validation error when password is empty', async ({ page }) => {
    await page.goto(annualLeaveUrls.login)

    const loginPage = await LoginPage.verifyOnPage(page)
    await loginPage.signIn('alice@example.com', '')

    await expect(page.locator('.govuk-error-summary').getByText('Enter your password')).toBeVisible()
  })
})
