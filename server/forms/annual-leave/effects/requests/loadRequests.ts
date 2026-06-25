import logger from '../../../../logger'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadRequests = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    return
  }

  try {
    const { userRequests } = await deps.annualLeaveApiClient.getRequests(session.user.id)

    const activeRows = userRequests.filter(r => r.status === 'PENDING')
    const historyRows = userRequests.filter(r => r.status !== 'PENDING')

    context.setData('activeRequestRows', activeRows)
    context.setData('historyRequestRows', historyRows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch requests'

    logger.error({ userId: session.user.id }, `Load requests failed: ${message}`)
    context.setData('activeRequestRows', [])
    context.setData('historyRequestRows', [])
  }
}

export default loadRequests
