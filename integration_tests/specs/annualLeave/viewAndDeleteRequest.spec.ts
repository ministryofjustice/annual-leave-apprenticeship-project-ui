import { expect, test } from '@playwright/test'
import { annualLeaveUrls, loginAndNavigateToDashboard, seededRequestIds } from '../../support/annualLeaveUtils'
import ViewRequestPage from '../../pages/annualLeave/viewRequestPage'
import DashboardPage from '../../pages/annualLeave/dashboardPage'
import resetDb from '../../support/resetDb'

test.describe('View and Delete Request', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('should display pending request details', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
    await page.goto(`${annualLeaveUrls.viewUpdateUserRequest}/${seededRequestIds.pending}`)
    const viewPage = await ViewRequestPage.verifyOnPage(page)

    await expect(viewPage.statusTag).toContainText(/pending/i)
    await expect(viewPage.summaryList).toContainText('10 June 2026')
    await expect(viewPage.summaryList).toContainText('14 June 2026')
    await expect(viewPage.timeline).toContainText('Family holiday')
    await expect(viewPage.deleteButton).toBeVisible()
  })

  test('should display approved request without delete button', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
    await page.goto(`${annualLeaveUrls.viewUpdateUserRequest}/${seededRequestIds.approved}`)
    const viewPage = await ViewRequestPage.verifyOnPage(page)

    await expect(viewPage.statusTag).toContainText(/approved/i)
    await expect(viewPage.summaryList).toContainText('1 July 2026')
    await expect(viewPage.summaryList).toContainText('3 July 2026')
    await expect(viewPage.timeline).toContainText('Short break')
    await expect(viewPage.deleteButton).not.toBeVisible()
  })

  test('should delete a pending request and show success banner', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
    await page.goto(`${annualLeaveUrls.viewUpdateUserRequest}/${seededRequestIds.pending}`)
    const viewPage = await ViewRequestPage.verifyOnPage(page)

    await viewPage.deleteRequest()

    const dashboard = await DashboardPage.verifyOnPage(page)
    await expect(dashboard.notificationBanner).toBeVisible()
    await expect(dashboard.notificationBanner).toContainText('deleted')

    const panel = page.locator('.govuk-tabs__panel:not([hidden])')
    await expect(panel.locator('.govuk-table tbody tr', { hasText: '10 June 2026' })).not.toBeVisible()
  })

  test('should navigate back to dashboard', async ({ page }) => {
    await loginAndNavigateToDashboard(page)
    await page.goto(`${annualLeaveUrls.viewUpdateUserRequest}/${seededRequestIds.pending}`)
    const viewPage = await ViewRequestPage.verifyOnPage(page)

    await viewPage.backButton.click()

    await DashboardPage.verifyOnPage(page)
  })
})
