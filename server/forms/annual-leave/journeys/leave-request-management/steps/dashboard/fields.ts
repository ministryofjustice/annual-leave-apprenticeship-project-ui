import { Condition, Data, Item, Iterator, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButtonGroup,
  GovUKHeading,
  GovUKLinkButton,
  GovUKNotificationBanner,
  GovUKTable,
  GovUKTabs,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { userSidebar } from '../../../../sharedBlocks'
import { isLoadUserRequestError, isLoadUserRequestsError } from '../../../../guards'
import { annualLeaveUrls } from '../../../../constants'

const pageHeading = GovUKHeading({
  text: 'Dashboard',
  size: 'xl',
  classes: 'govuk-!-margin-bottom-6',
})

// dashboard error (when there is a problem with loading requests)
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

const dashboardErrorPage = HtmlBlock({ content: [errorHeading, errorReason, errorActionSuggestion] })
dashboardErrorPage.visibleWhen = isLoadUserRequestsError

// banners (for view-update and create request pages):
const deleteSuccessBanner = GovUKNotificationBanner({
  bannerType: 'success',
  text: Data('deleteRequestSuccess'),
  visibleWhen: Data('deleteRequestSuccess').match(Condition.IsRequired()),
})

const createSuccessBanner = GovUKNotificationBanner({
  bannerType: 'success',
  text: Data('createRequestSuccess'),
  visibleWhen: Data('createRequestSuccess').match(Condition.IsRequired()),
})

const successBanners = HtmlBlock({
  content: [deleteSuccessBanner, createSuccessBanner],
})

const deleteErrorBanner = GovUKWarningText({
  text: Data('deleteRequestError'),
  visibleWhen: Data('deleteRequestError').match(Condition.IsRequired()),
})

const createErrorBanner = GovUKWarningText({
  text: Data('createRequestError'),
  visibleWhen: Data('createRequestError').match(Condition.IsRequired()),
})

const errorBanners = HtmlBlock({
  content: [deleteErrorBanner, createErrorBanner],
})

// buttons:
const managerHubLinkButton = GovUKLinkButton({
  text: 'Go to Manager Hub',
  href: '/manager-hub',
  classes: 'govuk-button--secondary',
  visibleWhen: Data('isManager').match(Condition.Equals(true)),
})

const submitNewRequestLinkButton = GovUKLinkButton({
  text: 'Submit a new absence request',
  href: annualLeaveUrls.createRequest,
  classes: 'govuk-button--primary',
})

const actionButtons = GovUKButtonGroup({
  buttons: [submitNewRequestLinkButton, managerHubLinkButton],
  classes: 'govuk-button-group--spread',
})

// tabs and tables:
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

const sidebar = userSidebar
sidebar.visibleWhen = not(isLoadUserRequestError)

const dashboardContent = HtmlBlock({
  content: [pageHeading, actionButtons, errorBanners, successBanners, requestsTabs],
})
dashboardContent.visibleWhen = not(isLoadUserRequestError)

export default [sidebar, dashboardErrorPage, dashboardContent]
