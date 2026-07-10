import { Condition, Data, Format, not, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButtonGroup,
  GovUKHeading,
  GovUKLinkButton,
  GovUKNotificationBanner,
  GovUKTabs,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBadge } from '@ministryofjustice/hmpps-forge/moj-components'
import { createErrorPage, createRequestsTable, createUserSidebar, noRequestsMessage } from '../../../../sharedBlocks'
import { forgeExpressions } from '../../../../sharedForgeExpressions'
import { annualLeaveUrls } from '../../../../constants'

const onLeaveBadge = MOJBadge({
  text: Data('onLeaveStatus'),
  classes: 'moj-badge--green govuk-!-font-size-36 govuk-!-padding-1',
  visibleWhen: forgeExpressions.user.isOnLeave,
})

const pageHeading = GovUKHeading({
  text: 'Dashboard',
  size: 'xl',
  classes: 'govuk-!-margin-bottom-0',
})

const headingWithStatus = TemplateWrapper({
  template: '<div class="heading-with-badge govuk-!-margin-bottom-6">{{slot:content}}</div>',
  slots: {
    content: [pageHeading, onLeaveBadge],
  },
})

const dashboardErrorPage = createErrorPage({
  heading: 'Sorry, there is a problem',
  body: [
    'We are experiencing issues getting your annual leave data.',
    'Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).',
  ],
  backHref: annualLeaveUrls.dashboard,
  backText: 'Try again',
  visibleWhen: forgeExpressions.errors.hasDataLoadError,
})

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
const managerHubLinkWithTag = HtmlBlock({
  content: Format(
    `<div class="govuk-button-group">
        <a href="%1" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">
          Manager Hub
          <strong class="govuk-tag %2 govuk-!-padding-2 govuk-!-padding-left-4 govuk-!-padding-right-4 govuk-!-margin-left-1 govuk-!-font-weight-bold"> %3</strong>
        </a>
    </div>`,
    annualLeaveUrls.managerHub,
    forgeExpressions.manager.activeAssignedRequestsCountTagClass,
    Data('activeAssignedRequestCount'),
  ),
  visibleWhen: forgeExpressions.manager.isManager,
})

const submitNewRequestLinkButton = GovUKLinkButton({
  text: 'Submit a new absence request',
  href: annualLeaveUrls.createRequest,
  classes: 'govuk-button--primary',
})

const actionButtons = GovUKButtonGroup({
  buttons: [submitNewRequestLinkButton, managerHubLinkWithTag],
  classes: 'govuk-button-group--spread',
})

// tabs and tables:
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
      label: when(forgeExpressions.user.hasUnseenApproved)
        .then(Format('Approved (%1)', Data('unseenApprovedCount')))
        .else('Approved'),
      panel: { blocks: [approvedRequestsTable, noRequestsMessage('hasApprovedRequests', 'approved')] },
    },
    {
      id: 'rejected-requests-table',
      label: when(forgeExpressions.user.hasUnseenRejected)
        .then(Format('Rejected (%1)', Data('unseenRejectedCount')))
        .else('Rejected'),
      panel: { blocks: [rejectedRequestsTable, noRequestsMessage('hasRejectedRequests', 'rejected')] },
    },
  ],
})

const sidebar = createUserSidebar()
sidebar.visibleWhen = not(forgeExpressions.errors.hasDataLoadError)

const dashboardContent = HtmlBlock({
  content: [headingWithStatus, actionButtons, errorBanners, successBanners, requestsTabs],
})
dashboardContent.visibleWhen = not(forgeExpressions.errors.hasDataLoadError)

export default [sidebar, dashboardErrorPage, dashboardContent]
