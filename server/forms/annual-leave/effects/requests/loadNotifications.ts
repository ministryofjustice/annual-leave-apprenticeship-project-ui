import type { AnnualLeaveDeps, AnnualLeaveEffectContext, AnnualLeaveSession } from '../types'

const notificationKeys: (keyof AnnualLeaveSession)[] = [
  'deleteRequestSuccess',
  'deleteRequestError',
  'createRequestSuccess',
  'createRequestError',
  'decisionSuccess',
  'decisionError',
]

const loadNotifications = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  notificationKeys.forEach(key => {
    if (session[key]) {
      context.setData(key, session[key])
      delete session[key]
    }
  })
}

export default loadNotifications
