import logger from '../../../../logger'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadBalance = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    return
  }

  try {
    const balance = await deps.annualLeaveApiClient.getBalance(session.user.id)

    context.setData('annualEntitlement', balance.annualEntitlement)
    context.setData('availableBalance', balance.availableBalance)
    context.setData('actualBalance', balance.actualBalance)
    context.setData('pendingDays', balance.pendingDays)
    context.setData('approvedDays', balance.approvedDays)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch balance'

    logger.error({ userId: session.user.id }, `Load balance failed: ${message}`)
  }
}

export default loadBalance
