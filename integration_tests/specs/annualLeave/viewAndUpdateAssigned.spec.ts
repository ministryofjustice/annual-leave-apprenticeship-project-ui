import { expect, test } from '@playwright/test'
import {
  annualLeaveUrls,
  checkAccessibility,
  loginAndNavigateToDashboard,
  seededRequestIds,
} from '../../support/annualLeaveUtils'
import ManagerHubPage from '../../pages/annualLeave/managerHubPage'
import ManagerViewRequestPage from '../../pages/annualLeave/managerViewRequestPage'
import resetDb from '../../support/resetDb'

test.describe('View and update - Manager Hub', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('should display pending request details for employee', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(`${annualLeaveUrls.viewAssignedRequest}/${seededRequestIds.pending}`)
    const viewPage = await ManagerViewRequestPage.verifyOnPage(page)

    await expect(viewPage.statusTag).toContainText(/pending/i)
    await expect(viewPage.summaryList).toContainText('10 June 2026')
    await expect(viewPage.summaryList).toContainText('14 June 2026')
    await expect(viewPage.timeline).toContainText('Family holiday')
    // Accessibility
    await checkAccessibility(page)
  })

  test('should show validation error when no decision is selected', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(`${annualLeaveUrls.viewAssignedRequest}/${seededRequestIds.pending}`)
    const viewPage = await ManagerViewRequestPage.verifyOnPage(page)

    await viewPage.submitButton.click()

    await expect(viewPage.errorSummary).toBeVisible()
    await expect(viewPage.errorSummary).toContainText('Select whether you approve or reject this request')
    // Accessibility
    await checkAccessibility(page)
  })

  test('should approve a pending request and show success banner', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(`${annualLeaveUrls.viewAssignedRequest}/${seededRequestIds.pending}`)
    const viewPage = await ManagerViewRequestPage.verifyOnPage(page)

    await viewPage.approve('Looks good, enjoy!')

    const hub = await ManagerHubPage.verifyOnPage(page)
    await expect(hub.notificationBanner).toBeVisible()
    await expect(hub.notificationBanner).toContainText('approved')
    // Accessibility
    await checkAccessibility(page)
  })

  test('should reject a pending request and show success banner', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(`${annualLeaveUrls.viewAssignedRequest}/${seededRequestIds.pending}`)
    const viewPage = await ManagerViewRequestPage.verifyOnPage(page)

    await viewPage.reject('Not enough cover')

    const hub = await ManagerHubPage.verifyOnPage(page)
    await expect(hub.notificationBanner).toBeVisible()
    await expect(hub.notificationBanner).toContainText('rejected')
  })

  test('should navigate back to manager hub', async ({ page }) => {
    await loginAndNavigateToDashboard(page, 'bob@example.com')
    await page.goto(`${annualLeaveUrls.viewAssignedRequest}/${seededRequestIds.pending}`)
    const viewPage = await ManagerViewRequestPage.verifyOnPage(page)

    await viewPage.backButton.click()

    await ManagerHubPage.verifyOnPage(page)
  })
})
