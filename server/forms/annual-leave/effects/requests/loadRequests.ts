import logger from '../../../../logger'
import { formatLeaveRequestToTableRowSections } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadRequests = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    return
  }

  try {
    const { userRequests } = await deps.annualLeaveApiClient.getRequests(session.user.id)

    context.setData('currentRequest', '')
    context.setData('userLeaveRequests', userRequests)

    const sorted = [...userRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    const pendingRequests = sorted.filter(r => r.status === 'PENDING').map(formatLeaveRequestToTableRowSections)
    const approvedRequests = sorted.filter(r => r.status === 'APPROVED').map(formatLeaveRequestToTableRowSections)
    const rejectedRequests = sorted.filter(r => r.status === 'REJECTED').map(formatLeaveRequestToTableRowSections)

    context.setData('loadUserRequestsError', false)
    context.setData('pendingRequests', pendingRequests)
    context.setData('approvedRequests', approvedRequests)
    context.setData('rejectedRequests', rejectedRequests)

    context.setData('hasPendingRequests', pendingRequests.length > 0)
    context.setData('hasApprovedRequests', approvedRequests.length > 0)
    context.setData('hasRejectedRequests', rejectedRequests.length > 0)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch requests'

    logger.error({ userId: session.user.id }, `Load requests failed: ${message}`)
    context.setData('loadUserRequestsError', true)
    context.setData('pendingRequests', [])
    context.setData('approvedRequests', [])
    context.setData('rejectedRequests', [])

    context.setData('hasPendingRequests', false)
    context.setData('hasApprovedRequests', false)
    context.setData('hasRejectedRequests', false)
  }
}

export default loadRequests
