import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class ManagerViewRequestPage extends AbstractPage {
  readonly statusTag: Locator

  readonly summaryList: Locator

  readonly timeline: Locator

  readonly approveRadio: Locator

  readonly rejectRadio: Locator

  readonly approverNote: Locator

  readonly submitButton: Locator

  readonly backButton: Locator

  readonly errorSummary: Locator

  private constructor(page: Page) {
    super(page)
    this.statusTag = page.getByTestId('view-assigned-request-status-tag')
    this.summaryList = page.locator('.govuk-summary-list')
    this.timeline = page.locator('.moj-timeline')
    this.approveRadio = page.getByLabel('Approve')
    this.rejectRadio = page.getByLabel('Reject')
    this.approverNote = page.getByLabel('Add a note (optional)')
    this.submitButton = page.getByRole('button', { name: 'Submit decision' })
    this.backButton = page.getByRole('button', { name: 'Back to Manager Hub' })
    this.errorSummary = page.locator('.govuk-error-summary')
  }

  static async verifyOnPage(page: Page): Promise<ManagerViewRequestPage> {
    const viewPage = new ManagerViewRequestPage(page)
    await expect(viewPage.pageHeading).toContainText(/request details for/i)

    return viewPage
  }

  async approve(note?: string): Promise<void> {
    await this.approveRadio.check()
    if (note) await this.approverNote.fill(note)
    await this.submitButton.click()
  }

  async reject(note?: string): Promise<void> {
    await this.rejectRadio.check()
    if (note) await this.approverNote.fill(note)
    await this.submitButton.click()
  }
}
