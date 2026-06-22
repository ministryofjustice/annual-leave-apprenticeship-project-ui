import { Condition, Data, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKHeading,
  GovUKPasswordInput,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { MOJAlert } from '@ministryofjustice/hmpps-forge/moj-components'

export const heading = GovUKHeading({ text: 'Sign in', size: 'l' })

export const errorAlert = MOJAlert({
  alertVariant: 'error',
  title: 'There is a problem',
  text: Data('loginError'),
  visibleWhen: Data('loginError').match(Condition.IsRequired()),
})

export const emailField = GovUKTextInput({
  code: 'email',
  classes: 'govuk-input--width-20',
  label: {
    text: 'Email address',
    classes: 'govuk-label--m',
  },
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter your email address',
    }),
    validation({
      condition: Self().match(Condition.Email.IsValidEmail()),
      message: 'Enter an email address in the correct format, like name@example.com',
    }),
  ],
})

export const passwordField = GovUKPasswordInput({
  code: 'password',
  classes: 'govuk-input--width-20',
  label: {
    text: 'Password',
    classes: 'govuk-label--m',
  },
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter your password',
    }),
  ],
})

export const signInButton = GovUKButton({
  text: 'Sign in',
  preventDoubleClick: true,
})
