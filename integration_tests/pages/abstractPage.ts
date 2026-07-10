import { type Locator, type Page } from '@playwright/test'

export default class AbstractPage {
  readonly page: Page

  readonly pageHeading: Locator

  protected constructor(page: Page) {
    this.page = page
    this.pageHeading = page.locator('h1')
  }
}
