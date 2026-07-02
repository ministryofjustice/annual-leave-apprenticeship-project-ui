import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadCreateNotification = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (session.createRequestSuccess) {
    context.setData('createRequestSuccess', session.createRequestSuccess)
    delete session.createRequestSuccess
  }

  if (session.createRequestError) {
    context.setData('createRequestError', session.createRequestError)
    delete session.createRequestError
  }
}

export default loadCreateNotification
