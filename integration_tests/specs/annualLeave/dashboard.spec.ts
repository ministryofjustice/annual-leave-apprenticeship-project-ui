import { expect, test } from '@playwright/test'
import { loginAndNavigateToDashboard } from '../../support/annualLeaveUtils'
import CreateRequestPage from '../../pages/annualLeave/createRequestPage'

test.describe('Dashboard', () => {
  test('should display sidebar stats', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)

    await expect(page.locator('.dashboard-stats')).toBeVisible()
    await expect(dashboard.submitRequestButton).toBeVisible()
  })

  test('should not show manager hub link for non-manager', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)

    await expect(dashboard.managerHubButton).not.toBeVisible()
  })

  test('should show manager hub link for manager', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page, 'bob@example.com')

    await expect(dashboard.managerHubButton).toBeVisible()
  })

  test('should navigate to create request page', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)
    await dashboard.clickSubmitNewAbsenceRequest()

    await CreateRequestPage.verifyOnPage(page)
  })
})
