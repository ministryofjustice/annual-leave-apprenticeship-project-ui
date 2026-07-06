import { expect, test } from '@playwright/test'
import { futureDate, futureDateLongFormat, loginAndNavigateToDashboard } from '../../support/annualLeaveUtils'
import CreateRequestPage from '../../pages/annualLeave/createRequestPage'
import DashboardPage from '../../pages/annualLeave/dashboardPage'
import resetDb from '../../support/resetDb'

test.describe('Create Request', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)
    await dashboard.clickSubmitNewAbsenceRequest()
    const createPage = await CreateRequestPage.verifyOnPage(page)

    await createPage.submit()

    await expect(createPage.errorSummary).toBeVisible()
    await expect(createPage.errorSummary).toContainText('Enter a start date')
    await expect(createPage.errorSummary).toContainText('Enter an end date')
  })

  test('should show validation error when end date is before start date', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)
    await dashboard.clickSubmitNewAbsenceRequest()
    const createPage = await CreateRequestPage.verifyOnPage(page)

    await createPage.fillDates(futureDate(30), futureDate(14))
    await createPage.submit()

    await expect(createPage.errorSummary).toBeVisible()
    await expect(createPage.errorSummary).toContainText('End date must be on or after the start date')
  })

  test('should create a request and show success banner on dashboard', async ({ page }) => {
    const startDate = futureDate(14)
    const endDate = futureDate(18)

    const dashboard = await loginAndNavigateToDashboard(page)
    await dashboard.clickSubmitNewAbsenceRequest()
    const createPage = await CreateRequestPage.verifyOnPage(page)

    await createPage.fillDates(startDate, endDate)
    await createPage.creatorNote.fill('Test holiday request')
    await createPage.submit()

    const returnedDashboard = await DashboardPage.verifyOnPage(page)
    await expect(returnedDashboard.notificationBanner).toBeVisible()
    await expect(returnedDashboard.notificationBanner).toContainText('has been successfully submitted')

    const panel = page.locator('.govuk-tabs__panel:not([hidden])')
    const displayDate = futureDateLongFormat(14)
    await expect(panel.locator('.govuk-table tbody tr', { hasText: displayDate })).toBeVisible()
  })

  test('should navigate back to dashboard on cancel', async ({ page }) => {
    const dashboard = await loginAndNavigateToDashboard(page)
    await dashboard.clickSubmitNewAbsenceRequest()
    const createPage = await CreateRequestPage.verifyOnPage(page)

    await createPage.cancelLink.click()

    await DashboardPage.verifyOnPage(page)
  })
})
