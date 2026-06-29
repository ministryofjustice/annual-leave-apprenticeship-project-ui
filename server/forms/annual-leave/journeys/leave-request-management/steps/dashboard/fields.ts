import { Condition, Data, Item, Iterator, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButtonGroup,
  GovUKHeading,
  GovUKLinkButton,
  GovUKTable,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { fullWidthLayout, sidebarLayout } from '../../../../sharedBlocks'
import { isLoadUserRequestError, isLoadUserRequestsError } from '../../../../guards'

const pageHeading = GovUKHeading({
  text: 'Dashboard',
  size: 'xl',
  classes: 'govuk-!-margin-bottom-6',
})

const managerHubLinkButton = GovUKLinkButton({
  text: 'Go to Manager Hub',
  href: '/manager-hub',
  classes: 'govuk-button--secondary',
  visibleWhen: Data('isManager').match(Condition.Equals(true)),
})

const submitNewRequestLinkButton = GovUKLinkButton({
  text: 'Submit a new absence request',
  href: '/submit-new-request',
  classes: 'govuk-button--primary',
})

const actionButtons = GovUKButtonGroup({
  buttons: [submitNewRequestLinkButton, managerHubLinkButton],
  classes: 'govuk-button-group--spread',
})

const noRequestsMessage = (hasDataKey: string, requestStatus: string) =>
  GovUKBody({
    text: `There are no ${requestStatus} requests here yet.`,
    visibleWhen: Data(hasDataKey).not.match(Condition.Equals(true)),
  })

const createRequestsTable = (dataKey: string, hasDataKey: string) =>
  GovUKTable({
    head: [
      { text: 'Duration' },
      { text: 'Start date' },
      { text: 'End date' },
      { text: 'Requested on' },
      { text: 'Status' },
      { text: 'Action' },
    ],
    rows: Data(dataKey).each(
      Iterator.Map([
        { text: Item().path('duration') },
        { text: Item().path('startDate') },
        { text: Item().path('endDate') },
        { text: Item().path('requestedOn') },
        { html: Item().path('statusTag') },
        { html: Item().path('viewLink') },
      ]),
    ),
    visibleWhen: Data(hasDataKey).match(Condition.Equals(true)),
  })

const pendingRequestsTable = createRequestsTable('pendingRequests', 'hasPendingRequests')
const approvedRequestsTable = createRequestsTable('approvedRequests', 'hasApprovedRequests')
const rejectedRequestsTable = createRequestsTable('rejectedRequests', 'hasRejectedRequests')

const requestsTabs = GovUKTabs({
  id: 'requests',
  items: [
    {
      id: 'pending-requests-table',
      label: 'Pending',
      panel: { blocks: [pendingRequestsTable, noRequestsMessage('hasPendingRequests', 'pending')] },
    },
    {
      id: 'approved-requests-table',
      label: 'Approved',
      panel: { blocks: [approvedRequestsTable, noRequestsMessage('hasApprovedRequests', 'approved')] },
    },
    {
      id: 'rejected-requests-table',
      label: 'Rejected',
      panel: { blocks: [rejectedRequestsTable, noRequestsMessage('hasRejectedRequests', 'rejected')] },
    },
  ],
})

const errorHeading = GovUKHeading({
  text: 'Sorry, there is a problem',
  size: 'xl',
})

const errorReason = GovUKBody({
  text: 'We are experiencing issues getting your annual leave data.',
})

const errorActionSuggestion = GovUKBody({
  text: 'Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).',
})

const dashboardErrorPage = fullWidthLayout([errorHeading, errorReason, errorActionSuggestion])
dashboardErrorPage.visibleWhen = isLoadUserRequestsError

const dashboardPage = sidebarLayout([pageHeading, actionButtons, requestsTabs], 'userSidebar')
dashboardPage.visibleWhen = not(isLoadUserRequestError)

export default [dashboardErrorPage, dashboardPage]
