import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadUserFromSession = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    return
  }

  context.setData('userFirstName', session.user.firstName)
  context.setData('userLastName', session.user.lastName)
  context.setData('userEmail', session.user.email)
  context.setData('userId', session.user.id)
  context.setData('annualEntitlement', session.user.annualEntitlement)
}

export default loadUserFromSession
