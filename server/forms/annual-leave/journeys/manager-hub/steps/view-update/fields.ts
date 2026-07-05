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
import { forgeExpressions } from '../../../../sharedForgeExpressions'
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
    forgeExpressions.request.data.path('statusTagClass'),
    forgeExpressions.request.data.path('statusText'),
    forgeExpressions.request.data.path('creatorName'),
  ),
})

const summaryListRow = GovUKGridRow({
  columns: [{ width: 'one-half', blocks: [requestDurationSummaryList] }],
})

const requestTimeline = MOJTimeline({
  items: [
    {
      label: { text: Format('%1 submitted a request', forgeExpressions.request.data.path('creatorName')) },
      text: when(forgeExpressions.request.hasCreatorNotes)
        .then(Format('Note: %1', forgeExpressions.request.data.path('creatorNote')))
        .else(''),
      datetime: { timestamp: forgeExpressions.request.data.path('requestedOnRaw'), type: 'datetime' },
    },
    {
      label: { text: 'Awaiting your decision' },
      datetime: { timestamp: forgeExpressions.request.data.path('requestedOnRaw'), type: 'datetime' },
      visibleWhen: forgeExpressions.request.isPending,
    },
    {
      label: { text: Format('Request %1', forgeExpressions.request.data.path('statusText')) },
      text: when(forgeExpressions.request.hasApproverNotes)
        .then(Format('Your note: %1', forgeExpressions.request.data.path('approverNote')))
        .else(''),
      datetime: { timestamp: forgeExpressions.request.data.path('decisionAtRaw'), type: 'datetime' },
      byline: { text: 'you' },
      visibleWhen: forgeExpressions.request.data.path('decisionAt').match(Condition.IsRequired()),
    },
    {
      label: {
        text: when(forgeExpressions.request.hasDecisionBeenSeen)
          .then(Format('%1 viewed the decision', forgeExpressions.request.data.path('creatorName')))
          .else(Format('Awaiting %1 to view the decision', forgeExpressions.request.data.path('creatorName'))),
      },
      datetime: {
        timestamp: when(forgeExpressions.request.hasDecisionBeenSeen)
          .then(forgeExpressions.request.data.path('decisionSeenAtRaw'))
          .else(forgeExpressions.request.data.path('decisionAtRaw')),
        type: 'datetime',
      },
      visibleWhen: forgeExpressions.request.data.path('decisionAt').match(Condition.IsRequired()),
    },
  ],
})

const sectionBreak = GovUKSectionBreak({
  size: 'l',
  visible: true,
  visibleWhen: forgeExpressions.request.hasCreatorOrApproverNotes,
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
decisionForm.visibleWhen = forgeExpressions.request.isPending

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
  visibleWhen: forgeExpressions.errors.isLoadUserRequestError,
})

const requestContent = HtmlBlock({
  content: [headingWithTag, summaryListRow, requestTimeline, sectionBreak, decisionForm, backButton],
})
requestContent.visibleWhen = not(forgeExpressions.errors.isLoadUserRequestError)

export default [errorPage, requestContent]
