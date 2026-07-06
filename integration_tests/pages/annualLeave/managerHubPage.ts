import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ManagerHubPage extends AbstractPage {
  readonly activeTab: Locator

  readonly historyTab: Locator

  readonly backButton: Locator

  readonly notificationBanner: Locator

  readonly warningBanner: Locator

  private constructor(page: Page) {
    super(page)
    this.activeTab = page.getByRole('tab', { name: 'Active' })
    this.historyTab = page.getByRole('tab', { name: 'History' })
    this.backButton = page.getByRole('button', { name: 'Back to Dashboard' })
    this.notificationBanner = page.locator('.govuk-notification-banner--success')
    this.warningBanner = page.locator('.govuk-warning-text')
  }

  static async verifyOnPage(page: Page): Promise<ManagerHubPage> {
    const hubPage = new ManagerHubPage(page)
    await expect(hubPage.pageHeading).toContainText('- Manager Hub')

    return hubPage
  }

  async clickTab(tab: 'Active' | 'History'): Promise<void> {
    const tabMap = { Active: this.activeTab, History: this.historyTab }
    await tabMap[tab].click()
  }
}
