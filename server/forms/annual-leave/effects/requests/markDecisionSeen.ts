import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const markDecisionSeen = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()
  const requestId = context.getRequestParam('id')

  if (!session.user || !requestId) {
    return
  }

  const userLeaveRequests = context.getData('userLeaveRequests') as LeaveRequest[] | undefined
  const request = userLeaveRequests?.find(r => r.id === requestId)

  if (!request) {
    return
  }

  const isDecided = request.status === 'APPROVED' || request.status === 'REJECTED'
  const isCreator = session.user.id === request.creatorId
  const isAlreadySeen = request.decisionSeenAt !== null

  if (!isDecided || !isCreator || isAlreadySeen) {
    return
  }

  try {
    await deps.annualLeaveApiClient.markDecisionSeen(session.user.id, requestId)
  } catch (error) {
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? 'Unknown error') : 'Unknown error'

    logger.error({ requestId, userId: session.user.id }, `Mark decision seen failed: ${message}`)
  }
}

export default markDecisionSeen
