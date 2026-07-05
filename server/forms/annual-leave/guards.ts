import { access, not, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from './effects'
import { annualLeaveUrls } from './constants'
import { forgeExpressions } from './sharedForgeExpressions'

export const redirectToLoginIfUnauthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: not(forgeExpressions.auth.isAuthenticated), goto: annualLeaveUrls.login })],
  })

export const redirectToDashboardIfAuthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: forgeExpressions.auth.isAuthenticated, goto: annualLeaveUrls.dashboard })],
  })

export const redirectToDashboardIfErrorLoadingUserRequests = () =>
  access({
    next: [redirect({ when: forgeExpressions.errors.isLoadUserRequestsError, goto: annualLeaveUrls.dashboard })],
  })

export const redirectToDashboardIfErrorLoadingBalance = () =>
  access({
    next: [redirect({ when: forgeExpressions.errors.isLoadBalanceError, goto: annualLeaveUrls.dashboard })],
  })

export const redirectToDashboardIfNotManager = () =>
  access({
    next: [redirect({ when: not(forgeExpressions.manager.isManager), goto: annualLeaveUrls.dashboard })],
  })
