import { expect, type Locator, type Page } from '@playwright/test'
import AbstractPage from '../abstractPage'

export default class LoginPage extends AbstractPage {
  readonly emailInput: Locator

  readonly passwordInput: Locator

  readonly signInButton: Locator

  readonly errorAlert: Locator

  private constructor(page: Page) {
    super(page)
    this.emailInput = page.getByLabel('Email address')
    this.passwordInput = page.locator('#password')
    this.signInButton = page.getByRole('button', { name: 'Sign in' })
    this.errorAlert = page.locator('.moj-alert--error')
  }

  static async verifyOnPage(page: Page): Promise<LoginPage> {
    const loginPage = new LoginPage(page)
    await expect(loginPage.pageHeading).toHaveText('Sign in')

    return loginPage
  }

  async signIn(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }
}
