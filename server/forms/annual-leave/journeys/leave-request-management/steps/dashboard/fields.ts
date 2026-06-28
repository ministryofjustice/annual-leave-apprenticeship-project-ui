import { Condition, Data, Item, Iterator, not, Format, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButtonGroup,
  GovUKDetails,
  GovUKGridRow,
  GovUKHeading,
  GovUKLinkButton,
  GovUKTable,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { SidebarStats } from '../../../../components/sidebarStats'
import { isLoadRequestError } from '../../../../guards'

const pageHeading = GovUKHeading({
  text: 'Dashboard',
  size: 'xl',
})

const managerDetails = GovUKDetails({
  summaryText: 'Your manager details',
  text: when(Data('managerName').match(Condition.IsRequired()))
    .then(Data('managerName'))
    .else("You haven't been assigned a manager"),
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
  buttons: [managerHubLinkButton, submitNewRequestLinkButton],
})

const sidebarStats = SidebarStats({
  heading: 'DAYS',
  entries: [
    { label: 'Balance', value: Data('actualBalance'), total: Data('annualEntitlement'), style: 'blue' },
    { label: 'Available', value: Data('availableBalance'), total: Data('annualEntitlement'), style: 'green' },
    { label: 'Pending', value: Data('pendingDays'), style: 'yellow' },
    { label: 'Approved', value: Data('approvedDays'), style: 'grey' },
  ],
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

const dashboardErrorPage = GovUKGridRow({
  columns: [
    {
      width: 'full',
      blocks: [errorHeading, errorReason, errorActionSuggestion],
    },
  ],
  visibleWhen: isLoadRequestError,
})

const dashboardPage = GovUKGridRow({
  columns: [
    {
      width: 'one-quarter',
      blocks: [managerDetails, sidebarStats],
    },
    {
      width: 'three-quarters',
      blocks: [pageHeading, actionButtons, requestsTabs],
    },
  ],
  visibleWhen: not(isLoadRequestError),
})

export default [dashboardErrorPage, dashboardPage]
