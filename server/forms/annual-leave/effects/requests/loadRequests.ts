import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import { formatLeaveRequestToTableRowSections, getOnLeaveStatus } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const sortByCreatedAtDesc = <T extends { createdAt: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

const loadUserRequests = async (deps: AnnualLeaveDeps, context: AnnualLeaveEffectContext, userId: string) => {
  try {
    const { userRequests } = await deps.annualLeaveApiClient.getRequests(userId)

    context.setData('currentRequest', '')
    context.setData('userLeaveRequests', userRequests)

    // user:
    const sorted = sortByCreatedAtDesc(userRequests)
    const pendingRequests = sorted.filter(r => r.status === 'PENDING').map(formatLeaveRequestToTableRowSections)
    const approvedRequests = sorted.filter(r => r.status === 'APPROVED').map(formatLeaveRequestToTableRowSections)
    const rejectedRequests = sorted.filter(r => r.status === 'REJECTED').map(formatLeaveRequestToTableRowSections)

    // for OnLeave badge on user /dashboard:
    const approvedRaw = sorted.filter(r => r.status === 'APPROVED')
    const onLeaveStatus = getOnLeaveStatus(approvedRaw)

    // unseen decision counts for tab notification badges:
    const unseenApprovedCount = approvedRaw.filter(r => r.decisionAt && !r.decisionSeenAt).length
    const unseenRejectedCount = sorted.filter(r => r.status === 'REJECTED' && r.decisionAt && !r.decisionSeenAt).length

    context.setData('onLeaveStatus', onLeaveStatus ?? '')
    context.setData('isOnLeave', !!onLeaveStatus)
    context.setData('unseenApprovedCount', unseenApprovedCount)
    context.setData('hasUnseenApproved', unseenApprovedCount > 0)
    context.setData('unseenRejectedCount', unseenRejectedCount)
    context.setData('hasUnseenRejected', unseenRejectedCount > 0)
    context.setData('loadUserRequestsError', false)
    context.setData('pendingRequests', pendingRequests)
    context.setData('approvedRequests', approvedRequests)
    context.setData('rejectedRequests', rejectedRequests)
    context.setData('hasPendingRequests', pendingRequests.length > 0)
    context.setData('hasApprovedRequests', approvedRequests.length > 0)
    context.setData('hasRejectedRequests', rejectedRequests.length > 0)
  } catch (error) {
    const fallbackError = 'Failed to fetch requests'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

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

    context.setData('assignedLeaveRequests', assignedRequests)

    const sorted = sortByCreatedAtDesc(assignedRequests)
    const activeRequests = sorted.filter(r => r.status === 'PENDING').map(formatLeaveRequestToTableRowSections)
    const historyRequests = sorted.filter(r => r.status !== 'PENDING').map(formatLeaveRequestToTableRowSections)

    context.setData('loadAssignedRequestsError', false)
    context.setData('activeAssignedRequests', activeRequests)
    context.setData('historyAssignedRequests', historyRequests)
    context.setData('hasActiveAssignedRequests', activeRequests.length > 0)
    context.setData('hasHistoryAssignedRequests', historyRequests.length > 0)
    context.setData('activeAssignedRequestCount', activeRequests.length)
  } catch (error) {
    const fallbackError = 'Failed to fetch assigned requests'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

    logger.error({ userId }, `Load assigned requests failed: ${message}`)
    context.setData('loadAssignedRequestsError', true)
    context.setData('activeAssignedRequests', [])
    context.setData('historyAssignedRequests', [])
    context.setData('hasActiveAssignedRequests', false)
    context.setData('hasHistoryAssignedRequests', false)
    context.setData('activeAssignedRequestCount', 0)
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
