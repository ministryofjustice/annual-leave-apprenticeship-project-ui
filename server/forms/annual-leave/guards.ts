import { access, Condition, Data, not, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from './effects'
import { annualLeaveUrls } from './constants'

const isAuthenticated = Data('userId').match(Condition.IsRequired())
export const isLoadUserRequestsError = Data('loadUserRequestsError').match(Condition.Equals(true))
export const isLoadUserRequestError = Data('loadUserRequestError').match(Condition.Equals(true))

export const redirectToLoginIfUnauthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: not(isAuthenticated), goto: annualLeaveUrls.login })],
  })

export const redirectToDashboardIfAuthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: isAuthenticated, goto: annualLeaveUrls.dashboard })],
  })

export const redirectToDashboardIfErrorLoadingUserRequests = () =>
  access({
    next: [redirect({ when: isLoadUserRequestsError, goto: annualLeaveUrls.dashboard })],
  })
