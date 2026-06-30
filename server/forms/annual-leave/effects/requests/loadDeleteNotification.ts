import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadDeleteNotification = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (session.deleteRequestSuccess) {
    context.setData('deleteRequestSuccess', session.deleteRequestSuccess)
    delete session.deleteRequestSuccess
  }

  if (session.deleteRequestError) {
    context.setData('deleteRequestError', session.deleteRequestError)
    delete session.deleteRequestError
  }
}

export default loadDeleteNotification
