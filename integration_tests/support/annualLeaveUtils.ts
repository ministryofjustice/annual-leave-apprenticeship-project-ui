import { expect, Page } from '@playwright/test'
import { AxeBuilder } from '@axe-core/playwright'
import DashboardPage from '../pages/annualLeave/dashboardPage'
import LoginPage from '../pages/annualLeave/loginPage'

type AccessibilityCheckOptions = {
  include?: string
  disableRules?: string[]
}

export const annualLeaveUrls = {
  login: '/login',
  dashboard: '/requests/dashboard',
  createRequest: '/requests/create',
  viewUpdateUserRequest: '/requests/view-update',
  deleteUserRequest: '/requests/delete',
  managerHub: '/manager-hub',
  viewAssignedRequest: '/manager-hub/view-update',
}

export const seededRequestIds = {
  pending: '00000000-0000-0000-0000-000000000101',
  approved: '00000000-0000-0000-0000-000000000102',
}

// returns a weekday date, daysFromNow in the future
const futureWeekday = (daysFromNow: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  if (date.getDay() === 0) date.setDate(date.getDate() + 1)
  if (date.getDay() === 6) date.setDate(date.getDate() + 2)

  return date
}

// DD/MM/YYYY for date inputs
export const futureDate = (daysFromNow: number): string =>
  futureWeekday(daysFromNow).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })

// "20 July 2026" matching how dates render in tables
export const futureDateLongFormat = (daysFromNow: number): string =>
  futureWeekday(daysFromNow).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export const loginAndNavigateToDashboard = async (
  page: Page,
  email = 'alice@example.com',
  password = 'password',
): Promise<DashboardPage> => {
  await page.goto(annualLeaveUrls.login)
  const loginPage = await LoginPage.verifyOnPage(page)
  await loginPage.signIn(email, password)

  return DashboardPage.verifyOnPage(page)
}

// runs a WCAG axe scan on the page and expects no violations
export const checkAccessibility = async (
  page: Page,
  { include = '#main-content', disableRules = [] }: AccessibilityCheckOptions = {},
): Promise<void> => {
  let axeBuilder = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).include(include)

  if (disableRules.length > 0) {
    axeBuilder = axeBuilder.disableRules(disableRules)
  }

  const accessibilityScanResults = await axeBuilder.analyze()
  expect(accessibilityScanResults.violations).toEqual([])
}
