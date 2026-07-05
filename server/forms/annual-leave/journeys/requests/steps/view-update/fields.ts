import { Condition, Data, Format, not, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButtonGroup,
  GovUKGridRow,
  GovUKLinkButton,
  GovUKSectionBreak,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJTimeline } from '@ministryofjustice/hmpps-forge/moj-components'
import { createErrorPage, createUserSidebar, requestDurationSummaryList } from '../../../../sharedBlocks'
import {
  creatorNoteForTimeline,
  hasApproverNotes,
  hasCreatorNotes,
  hasCreatorOrApproverNotes,
  isLoadUserRequestError,
  request,
} from '../../../../guards'
import { annualLeaveUrls } from '../../../../constants'
import { ConfirmModal } from '../../../../components/confirmModal'

const headingWithTag = HtmlBlock({
  content: Format(
    `
      <div>
        <strong class="govuk-tag %1 govuk-!-font-size-36 govuk-!-font-weight-bold">%2</strong>
        <h1 class="govuk-heading-l govuk-!-display-inline-block"> request details</h1>
      </div>
  `,
    request.path('statusTagClass'),
    request.path('statusText'),
  ),
})

const summaryListRow = GovUKGridRow({
  columns: [{ width: 'one-half', blocks: [requestDurationSummaryList] }],
})

const requestTimeline = MOJTimeline({
  items: [
    {
      label: { text: 'Request created' },
      text: when(hasCreatorNotes).then(creatorNoteForTimeline).else(''),
      datetime: { timestamp: request.path('requestedOnRaw'), type: 'datetime' },
      byline: { text: 'you' },
    },
    {
      label: { text: 'Awaiting manager decision' },
      datetime: { timestamp: request.path('requestedOnRaw'), type: 'datetime' },
    },
    {
      label: { text: Format('Request %1', request.path('statusText')) },
      text: when(hasApproverNotes)
        .then(Format('Manager note: %1', request.path('approverNote')))
        .else(''),
      datetime: { timestamp: request.path('decisionAtRaw'), type: 'datetime' },
      byline: { text: Data('managerName') },
      visibleWhen: request.path('decisionAt').match(Condition.IsRequired()),
    },
  ],
})

const sectionBreak = GovUKSectionBreak({
  size: 'l',
  visible: true,
  visibleWhen: hasCreatorOrApproverNotes,
})

const deleteButtonWithModal = ConfirmModal({
  modalId: 'delete-user-leave-request-modal',
  openModalButtonText: 'Delete request',
  openModalButtonStyle: 'govuk-button--warning',
  heading: 'Are you sure you want to delete this request?',
  description: Format(
    'Request for %1 from %2 to %3',
    request.path('duration'),
    request.path('startDate'),
    request.path('endDate'),
  ),
  confirmHref: Format(`%1/%2`, annualLeaveUrls.deleteUserRequest, request.path('requestId')),
  confirmStyle: 'govuk-button--warning',
  visibleWhen: request.path('statusText').match(Condition.Equals('Pending')),
})

const backButton = GovUKLinkButton({
  text: 'Back to dashboard',
  href: annualLeaveUrls.dashboard,
  classes: 'govuk-button--secondary',
})

const actionButtons = GovUKButtonGroup({
  buttons: [backButton, deleteButtonWithModal],
  classes: 'govuk-button-group--spread',
})

const errorPage = createErrorPage({
  heading: 'Request not found',
  body: ['We could not find the leave request you are looking for. It may have been removed or the link is incorrect.'],
  backHref: annualLeaveUrls.dashboard,
  backText: 'Back to dashboard',
  visibleWhen: isLoadUserRequestError,
})

const sidebar = createUserSidebar()
sidebar.visibleWhen = not(isLoadUserRequestError)

const requestContent = HtmlBlock({
  content: [headingWithTag, summaryListRow, requestTimeline, sectionBreak, actionButtons],
})
requestContent.visibleWhen = not(isLoadUserRequestError)

export default [sidebar, errorPage, requestContent]
