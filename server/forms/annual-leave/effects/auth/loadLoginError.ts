import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadLoginError = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (session.loginError) {
    context.setData('loginError', session.loginError)
    delete session.loginError
  }
}

export default loadLoginError
