import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class DashboardPage extends AbstractPage {
  readonly submitRequestButton: Locator

  readonly managerHubButton: Locator

  readonly pendingTab: Locator

  readonly approvedTab: Locator

  readonly rejectedTab: Locator

  readonly requestsTable: Locator

  readonly notificationBanner: Locator

  readonly errorBanner: Locator

  private constructor(page: Page) {
    super(page)
    this.submitRequestButton = page.getByRole('button', { name: 'Submit a new absence request' })
    this.managerHubButton = page.getByRole('button', { name: 'Manager Hub' })
    this.pendingTab = page.getByRole('tab', { name: 'Pending' })
    this.approvedTab = page.getByRole('tab', { name: 'Approved' })
    this.rejectedTab = page.getByRole('tab', { name: 'Rejected' })
    this.requestsTable = page.locator('.govuk-table')
    this.notificationBanner = page.locator('.govuk-notification-banner--success')
    this.errorBanner = page.locator('.govuk-warning-text')
  }

  static async verifyOnPage(page: Page): Promise<DashboardPage> {
    const dashboardPage = new DashboardPage(page)
    await expect(dashboardPage.pageHeading).toHaveText('Dashboard')

    return dashboardPage
  }

  async clickSubmitNewAbsenceRequest(): Promise<void> {
    await this.submitRequestButton.click()
  }

  async clickTab(tab: 'Pending' | 'Approved' | 'Rejected'): Promise<void> {
    const tabMap = { Pending: this.pendingTab, Approved: this.approvedTab, Rejected: this.rejectedTab }
    await tabMap[tab].click()
  }

  async getTableRowCount(): Promise<number> {
    return this.requestsTable.locator('tbody tr').count()
  }
}
