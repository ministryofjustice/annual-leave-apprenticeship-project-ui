import { Condition, Data, Format, Item, Iterator, not, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKHeading,
  GovUKLinkButton,
  GovUKTable,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { annualLeaveUrls } from '../../../../constants'

const isLoadAssignedRequestsError = Data('loadAssignedRequestsError').match(Condition.Equals(true))
const hasActiveRequests = Data('hasActiveAssignedRequests').match(Condition.Equals(true))

const activeCountTagClass = when(hasActiveRequests).then('govuk-tag--yellow').else('govuk-tag--green')

const headingWithTag = HtmlBlock({
  content: Format(
    `
      <div>
        <strong class="govuk-tag %1 govuk-!-font-size-48 govuk-!-font-weight-bold govuk-!-padding-2 govuk-!-padding-left-4 govuk-!-padding-right-4 govuk-!-margin-right-3">%2</strong>
        <h1 class="govuk-heading-l govuk-!-display-inline-block"> New requests - Manager Hub</h1>
      </div>
  `,
    activeCountTagClass,
    Data('activeAssignedRequestCount'),
  ),
})

const backToDashboard = GovUKLinkButton({
  text: 'Back to Dashboard',
  href: annualLeaveUrls.dashboard,
  classes: 'govuk-button--secondary',
})

// error state
const errorHeading = GovUKHeading({
  text: 'Sorry, there is a problem',
  size: 'xl',
})

const errorReason = GovUKBody({
  text: 'We are experiencing issues getting assigned request data.',
})

const errorActionSuggestion = GovUKBody({
  text: 'Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).',
})

const errorPage = HtmlBlock({ content: [errorHeading, errorReason, errorActionSuggestion] })
errorPage.visibleWhen = isLoadAssignedRequestsError

// tables
const noRequestsMessage = (hasDataKey: string, label: string) =>
  GovUKBody({
    text: `There are no ${label} requests.`,
    visibleWhen: Data(hasDataKey).not.match(Condition.Equals(true)),
  })

const assignedRequestsTable = (dataKey: string, hasDataKey: string) =>
  GovUKTable({
    head: [
      { text: 'Name' },
      { text: 'Duration' },
      { text: 'Start date' },
      { text: 'End date' },
      { text: 'Requested on' },
      { text: 'Status' },
      { text: 'Action' },
    ],
    rows: Data(dataKey).each(
      Iterator.Map([
        { text: Item().path('creatorName') },
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

const activeTable = assignedRequestsTable('activeAssignedRequests', 'hasActiveAssignedRequests')
const historyTable = assignedRequestsTable('historyAssignedRequests', 'hasHistoryAssignedRequests')

const requestsTabs = GovUKTabs({
  id: 'assigned-requests',
  items: [
    {
      id: 'active-requests-table',
      label: 'Active',
      panel: { blocks: [activeTable, noRequestsMessage('hasActiveAssignedRequests', 'active')] },
    },
    {
      id: 'history-requests-table',
      label: 'History',
      panel: { blocks: [historyTable, noRequestsMessage('hasHistoryAssignedRequests', 'history')] },
    },
  ],
})

const dashboardContent = HtmlBlock({ content: [headingWithTag, backToDashboard, requestsTabs] })
dashboardContent.visibleWhen = not(isLoadAssignedRequestsError)

export default [errorPage, dashboardContent]
