import { Condition, Data, Format, or, when } from '@ministryofjustice/hmpps-forge/core/authoring'

export const forgeExpressions = {
  auth: {
    isAuthenticated: Data('userId').match(Condition.IsRequired()),
  },

  user: {
    isOnLeave: Data('isOnLeave').match(Condition.Equals(true)),
    hasUnseenApproved: Data('hasUnseenApproved').match(Condition.Equals(true)),
    hasUnseenRejected: Data('hasUnseenRejected').match(Condition.Equals(true)),
  },

  manager: {
    isManager: Data('isManager').match(Condition.Equals(true)),
    activeAssignedRequestsCountTagClass: when(Data('hasActiveAssignedRequests').match(Condition.Equals(true)))
      .then('govuk-tag--yellow')
      .else('govuk-tag--green'),
    requestWordForManagerHubHeading: when(Data('activeAssignedRequestCount').match(Condition.Equals(1)))
      .then('request')
      .else('requests'),
  },

  request: {
    data: Data('currentRequest'),
    hasCreatorNotes: Data('currentRequest').path('creatorNote').match(Condition.IsRequired()),
    hasApproverNotes: Data('currentRequest').path('approverNote').match(Condition.IsRequired()),
    creatorNoteForTimeline: Format('Your note: %1', Data('currentRequest').path('creatorNote')),
    isPending: Data('currentRequest').path('statusText').match(Condition.Equals('Pending')),
    hasDecisionBeenSeen: Data('currentRequest').path('decisionSeenAt').match(Condition.IsRequired()),
    hasCreatorOrApproverNotes: or(
      Data('currentRequest').path('creatorNote').match(Condition.IsRequired()),
      Data('currentRequest').path('approverNote').match(Condition.IsRequired()),
    ),
  },

  errors: {
    isLoadUserRequestsError: Data('loadUserRequestsError').match(Condition.Equals(true)),
    isLoadUserRequestError: Data('loadUserRequestError').match(Condition.Equals(true)),
    isLoadBalanceError: Data('loadBalanceError').match(Condition.Equals(true)),
    hasDataLoadError: or(
      Data('loadUserRequestsError').match(Condition.Equals(true)),
      Data('loadBalanceError').match(Condition.Equals(true)),
    ),
    isLoadAssignedRequestsError: Data('loadAssignedRequestsError').match(Condition.Equals(true)),
  },
}
