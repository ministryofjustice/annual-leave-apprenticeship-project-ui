import { access, Condition, Data, Format, not, or, redirect, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from './effects'
import { annualLeaveUrls } from './constants'

// CONTEXT SHORTCUTS (forge expressions):
// auth:
const isAuthenticated = Data('userId').match(Condition.IsRequired())
// user:
export const isLoadUserRequestsError = Data('loadUserRequestsError').match(Condition.Equals(true))
export const isLoadUserRequestError = Data('loadUserRequestError').match(Condition.Equals(true))
export const isLoadBalanceError = Data('loadBalanceError').match(Condition.Equals(true))
export const hasDataLoadError = or(isLoadUserRequestsError, isLoadBalanceError)
export const isOnLeave = Data('isOnLeave').match(Condition.Equals(true))

// manager:
export const isManager = Data('isManager').match(Condition.Equals(true))
const hasActiveRequests = Data('hasActiveAssignedRequests').match(Condition.Equals(true))
export const activeAssignedRequestsCountTagClass = when(hasActiveRequests)
  .then('govuk-tag--yellow')
  .else('govuk-tag--green')
export const isLoadAssignedRequestsError = Data('loadAssignedRequestsError').match(Condition.Equals(true))
const isSingleRequest = Data('activeAssignedRequestCount').match(Condition.Equals(1))
export const requestWord = when(isSingleRequest).then('request').else('requests')

export const request = Data('currentRequest')
export const hasCreatorNotes = request.path('creatorNote').match(Condition.IsRequired())
export const hasApproverNotes = request.path('approverNote').match(Condition.IsRequired())
export const creatorNoteForTimeline = Format('Your note: %1', request.path('creatorNote'))
export const isPendingRequest = request.path('statusText').match(Condition.Equals('Pending'))

// GUARDS:
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

export const redirectToDashboardIfErrorLoadingBalance = () =>
  access({
    next: [redirect({ when: isLoadBalanceError, goto: annualLeaveUrls.dashboard })],
  })
export const hasCreatorOrApproverNotes = or(
  request.path('creatorNote').match(Condition.IsRequired()),
  request.path('approverNote').match(Condition.IsRequired()),
)
