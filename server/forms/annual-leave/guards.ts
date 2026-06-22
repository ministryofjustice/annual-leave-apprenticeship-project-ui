import { access, not, Condition, Data, redirect } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from './effects'

const isAuthenticated = Data('userId').match(Condition.IsRequired())

export const redirectToLoginIfUnauthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: not(isAuthenticated), goto: '/login' })],
  })

export const redirectToHomeIfAuthenticated = () =>
  access({
    effects: [AnnualLeaveEffects.loadUserFromSession()],
    next: [redirect({ when: isAuthenticated, goto: '/home' })],
  })
