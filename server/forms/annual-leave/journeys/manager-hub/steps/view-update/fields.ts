import { Condition, Data, Format, not, Self, validation, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKCharacterCount,
  GovUKGridRow,
  GovUKLinkButton,
  GovUKRadioInput,
  GovUKSectionBreak,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJTimeline } from '@ministryofjustice/hmpps-forge/moj-components'
import {
  hasApproverNotes,
  hasCreatorNotes,
  hasCreatorOrApproverNotes,
  isLoadUserRequestError,
  isPendingRequest,
  request,
} from '../../../../guards'
import { annualLeaveUrls } from '../../../../constants'
import { createErrorPage, requestDurationSummaryList } from '../../../../sharedBlocks'

const headingWithTag = HtmlBlock({
  content: Format(
    `
      <div>
        <strong class="govuk-tag %1 govuk-!-font-size-36 govuk-!-font-weight-bold">%2</strong>
        <h1 class="govuk-heading-l govuk-!-display-inline-block"> request details for %3</h1>
      </div>
  `,
    request.path('statusTagClass'),
    request.path('statusText'),
    request.path('creatorName'),
  ),
})

const summaryListRow = GovUKGridRow({
  columns: [{ width: 'one-half', blocks: [requestDurationSummaryList] }],
})

const requestTimeline = MOJTimeline({
  items: [
    {
      label: { text: Format('%1 submitted a request', request.path('creatorName')) },
      text: when(hasCreatorNotes)
        .then(Format('Note: %1', request.path('creatorNote')))
        .else(''),
      datetime: { timestamp: request.path('requestedOnRaw'), type: 'datetime' },
    },
    {
      label: { text: 'Awaiting your decision' },
      datetime: { timestamp: request.path('requestedOnRaw'), type: 'datetime' },
      visibleWhen: isPendingRequest,
    },
    {
      label: { text: Format('Request %1', request.path('statusText')) },
      text: when(hasApproverNotes)
        .then(Format('Your note: %1', request.path('approverNote')))
        .else(''),
      datetime: { timestamp: request.path('decisionAtRaw'), type: 'datetime' },
      byline: { text: 'you' },
      visibleWhen: request.path('decisionAt').match(Condition.IsRequired()),
    },
  ],
})

const sectionBreak = GovUKSectionBreak({
  size: 'l',
  visible: true,
  visibleWhen: hasCreatorOrApproverNotes,
})

// decision form (only for pending requests)
const decisionError = GovUKWarningText({
  text: Data('decisionError'),
  visibleWhen: Data('decisionError').match(Condition.IsRequired()),
})

const decisionRadio = GovUKRadioInput({
  code: 'decision',
  items: [
    { value: 'approve', text: 'Approve' },
    { value: 'reject', text: 'Reject' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select whether you approve or reject this request',
    }),
  ],
})

const approverNoteField = GovUKCharacterCount({
  code: 'approverNote',
  label: {
    text: 'Add a note (optional)',
    classes: 'govuk-label--m',
  },
  hint: 'Include any feedback for the employee',
  maxLength: 2000,
  rows: 4,
  validWhen: [
    validation({
      condition: Self().match(Condition.String.HasMaxLength(2000)),
      message: 'Note must be 2000 characters or less',
    }),
  ],
})

const submitButton = GovUKButton({
  text: 'Submit decision',
  preventDoubleClick: true,
  buttonType: 'submit',
})

const decisionForm = HtmlBlock({
  content: [decisionError, decisionRadio, approverNoteField, submitButton],
})
decisionForm.visibleWhen = isPendingRequest

const backButton = GovUKLinkButton({
  text: 'Back to Manager Hub',
  href: annualLeaveUrls.managerHub,
  classes: 'govuk-button--secondary',
})

const errorPage = createErrorPage({
  heading: 'Request not found',
  body: ['We could not find the leave request you are looking for. It may have been removed or the link is incorrect.'],
  backHref: annualLeaveUrls.managerHub,
  backText: 'Back to Manager Hub',
  visibleWhen: isLoadUserRequestError,
})

const requestContent = HtmlBlock({
  content: [headingWithTag, summaryListRow, requestTimeline, sectionBreak, decisionForm, backButton],
})
requestContent.visibleWhen = not(isLoadUserRequestError)

export default [errorPage, requestContent]
