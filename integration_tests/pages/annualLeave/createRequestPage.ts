import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class CreateRequestPage extends AbstractPage {
  readonly startDateInput: Locator

  readonly endDateInput: Locator

  readonly startDateHalfDay: Locator

  readonly endDateHalfDay: Locator

  readonly creatorNote: Locator

  readonly submitButton: Locator

  readonly cancelLink: Locator

  readonly errorSummary: Locator

  private constructor(page: Page) {
    super(page)
    this.startDateInput = page.getByLabel('Start date')
    this.endDateInput = page.getByLabel('End date')
    this.startDateHalfDay = page.getByRole('checkbox', { name: 'Half day' }).first()
    this.endDateHalfDay = page.getByRole('checkbox', { name: 'Half day' }).last()
    this.creatorNote = page.getByLabel('Add a note (optional)')
    this.submitButton = page.getByRole('button', { name: 'Submit request' })
    this.cancelLink = page.getByRole('button', { name: 'Cancel' })
    this.errorSummary = page.locator('.govuk-error-summary')
  }

  static async verifyOnPage(page: Page): Promise<CreateRequestPage> {
    const createPage = new CreateRequestPage(page)
    await expect(createPage.pageHeading).toContainText('Submit a new absence request')

    return createPage
  }

  async fillDates(startDate: string, endDate: string): Promise<void> {
    await this.startDateInput.fill(startDate)
    await this.endDateInput.fill(endDate)
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }
}
