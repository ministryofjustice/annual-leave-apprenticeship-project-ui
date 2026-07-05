import { Condition, Data, Format, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKLinkButton,
  GovUKNotificationBanner,
  GovUKTabs,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { createErrorPage, createRequestsTable, noRequestsMessage } from '../../../../sharedBlocks'
import { annualLeaveUrls } from '../../../../constants'
import { forgeExpressions } from '../../../../sharedForgeExpressions'

const errorPage = createErrorPage({
  heading: 'Sorry, there is a problem',
  body: [
    'We are experiencing issues getting assigned request data.',
    'Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).',
  ],
  backHref: annualLeaveUrls.dashboard,
  backText: 'Back to Dashboard',
  visibleWhen: forgeExpressions.errors.isLoadAssignedRequestsError,
})

// content:
const headingWithTag = HtmlBlock({
  content: Format(
    `
      <div>
        <strong class="govuk-tag %1 govuk-!-font-size-48 govuk-!-font-weight-bold govuk-!-padding-2 govuk-!-padding-left-5 govuk-!-padding-right-5 govuk-!-margin-right-3">%2</strong>
        <h1 class="govuk-heading-l govuk-!-display-inline-block"> New %3 - Manager Hub</h1>
      </div>
  `,
    forgeExpressions.manager.activeAssignedRequestsCountTagClass,
    Data('activeAssignedRequestCount'),
    forgeExpressions.manager.requestWordForManagerHubHeading,
  ),
})

const backToDashboard = GovUKLinkButton({
  text: 'Back to Dashboard',
  href: annualLeaveUrls.dashboard,
  classes: 'govuk-button--secondary',
})

// notifications:
const decisionSuccessBanner = GovUKNotificationBanner({
  bannerType: 'success',
  text: Data('decisionSuccess'),
  visibleWhen: Data('decisionSuccess').match(Condition.IsRequired()),
})

const decisionErrorBanner = GovUKWarningText({
  text: Data('decisionError'),
  visibleWhen: Data('decisionError').match(Condition.IsRequired()),
})

// tables
const activeTable = createRequestsTable('activeAssignedRequests', 'hasActiveAssignedRequests', true)
const historyTable = createRequestsTable('historyAssignedRequests', 'hasHistoryAssignedRequests', true)

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

const dashboardContent = HtmlBlock({
  content: [headingWithTag, backToDashboard, decisionErrorBanner, decisionSuccessBanner, requestsTabs],
})
dashboardContent.visibleWhen = not(forgeExpressions.errors.isLoadAssignedRequestsError)

export default [errorPage, dashboardContent]
