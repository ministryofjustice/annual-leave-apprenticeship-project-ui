import {
  Answer,
  Condition,
  Data,
  Generator,
  or,
  Self,
  Transformer,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKButtonGroup,
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKHeading,
  GovUKLinkButton,
  GovUKWarningText,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJDatePicker } from '@ministryofjustice/hmpps-forge/moj-components'
import { userSidebar } from '../../../../sharedBlocks'
import { annualLeaveUrls } from '../../../../constants'

const todayDDMMYYYY = Generator.Date.Today().pipe(Transformer.Date.Format('DD/MM/YYYY'))
const ddmmyyyyToIso = [Transformer.String.ToDate(), Transformer.Date.Format('YYYY-MM-DD')]
const isoToDdmmyyyy = [Transformer.String.FormatDate({ dateStyle: 'short' })]

const datesAreDifferent = Answer('endDate').not.match(Condition.Equals(Answer('startDate')))

const pageHeading = GovUKHeading({
  text: 'Submit a new absence request',
  size: 'xl',
  classes: 'govuk-!-margin-bottom-6',
})

const createErrorBanner = GovUKWarningText({
  text: Data('createRequestError'),
  visibleWhen: Data('createRequestError').match(Condition.IsRequired()),
})

const startDateField = MOJDatePicker({
  code: 'startDate',
  label: {
    text: 'Start date',
    classes: 'govuk-label--m',
  },
  hint: 'For example, 17/05/2026',
  minDate: todayDDMMYYYY,
  excludedDays: ['saturday', 'sunday'],
  formatters: ddmmyyyyToIso,
  parsers: isoToDdmmyyyy,
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter a start date',
    }),
    validation({
      condition: or(Self().not.match(Condition.IsRequired()), Self().match(Condition.Date.IsValid())),
      message: 'Enter a valid start date',
    }),
    validation({
      condition: or(Self().not.match(Condition.Date.IsValid()), Self().not.match(Condition.Date.IsPastDate())),
      message: 'Start date must be today or in the future',
    }),
  ],
})

const isFirstDayHalfDayField = GovUKCheckboxInput({
  code: 'isFirstDayHalfDay',
  items: [{ value: 'true', text: 'Half day' }],
  classes: 'govuk-checkboxes--small',
  dependentWhen: Answer('startDate').match(Condition.IsRequired()),
})

const endDateField = MOJDatePicker({
  code: 'endDate',
  label: {
    text: 'End date',
    classes: 'govuk-label--m',
  },
  hint: 'For example, 21/05/2026',
  minDate: todayDDMMYYYY,
  excludedDays: ['saturday', 'sunday'],
  formatters: ddmmyyyyToIso,
  parsers: isoToDdmmyyyy,
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter an end date',
    }),
    validation({
      condition: or(Self().not.match(Condition.IsRequired()), Self().match(Condition.Date.IsValid())),
      message: 'Enter a valid end date',
    }),
    validation({
      condition: or(Self().not.match(Condition.Date.IsValid()), Self().not.match(Condition.Date.IsPastDate())),
      message: 'End date must be today or in the future',
    }),
    validation({
      condition: or(
        Self().not.match(Condition.Date.IsValid()),
        Answer('startDate').not.match(Condition.Date.IsValid()),
        Self().not.match(Condition.Date.IsBefore(Answer('startDate'))),
      ),
      message: 'End date must be on or after the start date',
    }),
  ],
})

const isLastDayHalfDayField = GovUKCheckboxInput({
  code: 'isLastDayHalfDay',
  items: [{ value: 'true', text: 'Half day' }],
  classes: 'govuk-checkboxes--small',
  validWhen: [
    validation({
      condition: or(Self().not.match(Condition.Array.Contains('true')), datesAreDifferent),
      message:
        'You cannot select half day for the end date when it is the same as the start date. Use the start date half day option instead.',
    }),
  ],
})

const startDateGroup = HtmlBlock({ content: [startDateField, isFirstDayHalfDayField] })
const endDateGroup = HtmlBlock({ content: [endDateField, isLastDayHalfDayField] })

const creatorNoteField = GovUKCharacterCount({
  code: 'creatorNote',
  label: {
    text: 'Add a note (optional)',
    classes: 'govuk-label--m',
  },
  hint: 'Include any additional information for your manager',
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
  text: 'Submit request',
  preventDoubleClick: true,
})

const cancelButton = GovUKLinkButton({
  text: 'Cancel',
  href: annualLeaveUrls.dashboard,
  classes: 'govuk-button--secondary',
})

const actionButtons = GovUKButtonGroup({
  buttons: [submitButton, cancelButton],
})

export default [
  userSidebar,
  pageHeading,
  createErrorBanner,
  startDateGroup,
  endDateGroup,
  creatorNoteField,
  actionButtons,
]
