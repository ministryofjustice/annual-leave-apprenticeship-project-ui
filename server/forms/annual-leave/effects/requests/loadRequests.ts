import logger from '../../../../logger'
import { formatLeaveRequestToTableRowSections } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const sortByCreatedAtDesc = <T extends { createdAt: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const loadUserRequests = async (deps: AnnualLeaveDeps, context: AnnualLeaveEffectContext, userId: string) => {
  try {
    const { userRequests } = await deps.annualLeaveApiClient.getRequests(userId)

    context.setData('currentRequest', '')
    context.setData('userLeaveRequests', userRequests)

    const sorted = sortByCreatedAtDesc(userRequests)
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

    logger.error({ userId }, `Load requests failed: ${message}`)
    context.setData('loadUserRequestsError', true)
    context.setData('pendingRequests', [])
    context.setData('approvedRequests', [])
    context.setData('rejectedRequests', [])
    context.setData('hasPendingRequests', false)
    context.setData('hasApprovedRequests', false)
    context.setData('hasRejectedRequests', false)
  }
}

const loadAssignedRequests = async (deps: AnnualLeaveDeps, context: AnnualLeaveEffectContext, userId: string) => {
  try {
    const assignedRequests = await deps.annualLeaveApiClient.getAssignedRequests(userId)

    const sorted = sortByCreatedAtDesc(assignedRequests)
    const activeRequests = sorted.filter(r => r.status === 'PENDING').map(formatLeaveRequestToTableRowSections)
    const historyRequests = sorted.filter(r => r.status !== 'PENDING').map(formatLeaveRequestToTableRowSections)

    context.setData('loadAssignedRequestsError', false)
    context.setData('activeAssignedRequests', activeRequests)
    context.setData('historyAssignedRequests', historyRequests)
    context.setData('hasActiveAssignedRequests', activeRequests.length > 0)
    context.setData('hasHistoryAssignedRequests', historyRequests.length > 0)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch assigned requests'

    logger.error({ userId }, `Load assigned requests failed: ${message}`)
    context.setData('loadAssignedRequestsError', true)
    context.setData('activeAssignedRequests', [])
    context.setData('historyAssignedRequests', [])
    context.setData('hasActiveAssignedRequests', false)
    context.setData('hasHistoryAssignedRequests', false)
  }
}

const loadRequests = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    return
  }

  const tasks: Promise<void>[] = [loadUserRequests(deps, context, session.user.id)]

  if (session.user.isManager) {
    tasks.push(loadAssignedRequests(deps, context, session.user.id))
  }

  await Promise.all(tasks)
}

export default loadRequests
