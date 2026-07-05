import { type Page } from '@playwright/test'
import DashboardPage from '../../pages/annualLeave/dashboardPage'
import LoginPage from '../../pages/annualLeave/loginPage'

export const annualLeaveUrls = {
  login: '/login',
  dashboard: '/requests/dashboard',
  createRequest: '/requests/create',
  viewUpdateUserRequest: '/requests/view-update',
  deleteUserRequest: '/requests/delete',
  managerHub: '/manager-hub',
  viewAssignedRequest: '/manager-hub/view-update',
}

export const annualLeavePageTitles = {
  signIn: 'Sign in',
  dashboard: 'Dashboard',
  createRequest: 'Submit a new absence request',
  requestDetails: 'Request Details',
}

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
