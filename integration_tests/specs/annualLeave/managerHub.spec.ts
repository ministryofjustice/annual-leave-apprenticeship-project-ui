import { expect, test } from '@playwright/test'
import { annualLeaveUrls, loginAndNavigateToDashboard } from '../../support/annualLeaveUtils'
import ManagerHubPage from '../../pages/annualLeave/managerHubPage'
import DashboardPage from '../../pages/annualLeave/dashboardPage'
import resetDb from '../../support/resetDb'

test.describe('Manager Hub', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('should redirect non-manager to dashboard', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
    await page.goto(annualLeaveUrls.managerHub)

    await DashboardPage.verifyOnPage(page)
  })

  test('should display active assigned requests', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(annualLeaveUrls.managerHub)
    await ManagerHubPage.verifyOnPage(page)

    const panel = page.locator('.govuk-tabs__panel:not([hidden])')
    await expect(panel.locator('.govuk-table tbody tr', { hasText: '10 June 2026' })).toBeVisible()
  })

  test('should display history tab with approved requests', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(annualLeaveUrls.managerHub)
    const hub = await ManagerHubPage.verifyOnPage(page)

    await hub.clickTab('History')
    const panel = page.locator('.govuk-tabs__panel:not([hidden])')
    await expect(panel.locator('.govuk-table tbody tr', { hasText: '1 July 2026' })).toBeVisible()
  })

  test('should navigate back to dashboard', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(annualLeaveUrls.managerHub)
    const hub = await ManagerHubPage.verifyOnPage(page)

    await hub.backButton.click()

    await DashboardPage.verifyOnPage(page)
  })
})
