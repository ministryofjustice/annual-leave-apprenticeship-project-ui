import { access, Condition, Data, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import { redirectToDashboardIfAuthenticated } from '../../../../guards'
import { emailField, errorAlert, heading, passwordField, signInButton } from './fields'

export default step({
  path: '/',
  title: 'Sign in',
  reachability: { entryWhen: true },
  blocks: [heading, errorAlert, emailField, passwordField, signInButton],
  onAccess: [
    redirectToDashboardIfAuthenticated(),
    access({
      effects: [AnnualLeaveEffects.loadLoginError()],
    }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [AnnualLeaveEffects.authenticateUser()],
        next: [
          redirect({
            when: Data('loginError').match(Condition.IsRequired()),
            goto: '/login',
          }),
          redirect({ goto: '/dashboard' }),
        ],
      },
    }),
  ],
})
