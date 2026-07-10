import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'
import { checkAccessibility } from '../../support/annualLeaveUtils'

export default class ViewRequestPage extends AbstractPage {
  readonly statusTag: Locator

  readonly summaryList: Locator

  readonly timeline: Locator

  readonly deleteButton: Locator

  readonly confirmDeleteLink: Locator

  readonly backButton: Locator

  private constructor(page: Page) {
    super(page)
    this.statusTag = page.getByTestId('view-request-status-tag')
    this.summaryList = page.locator('.govuk-summary-list')
    this.timeline = page.locator('.moj-timeline')
    this.deleteButton = page.getByRole('button', { name: 'Delete request' })
    this.confirmDeleteLink = page.locator('dialog').getByRole('button', { name: "Yes, I'm sure" })
    this.backButton = page.getByRole('button', { name: 'Back to Dashboard' })
  }

  static async verifyOnPage(page: Page): Promise<ViewRequestPage> {
    const viewPage = new ViewRequestPage(page)
    await expect(viewPage.pageHeading).toContainText(/request details/i)

    return viewPage
  }

  async deleteRequest(page: Page): Promise<void> {
    await this.deleteButton.click()
    // Accessibility
    await checkAccessibility(page)
    await this.confirmDeleteLink.click()
  }
}
