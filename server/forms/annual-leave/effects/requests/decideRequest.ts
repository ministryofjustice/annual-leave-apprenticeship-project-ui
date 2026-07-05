import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import type { AssignedLeaveRequestItem } from '../../../../interfaces/annualLeaveApi/response'
import { formatDateWithWeekday, formatDuration } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const decideRequest = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()
  const requestId = context.getRequestParam('id')

  if (!session.user || !requestId) {
    session.decisionError = 'Something went wrong. Please try again'

    return
  }

  const decision = context.getAnswer('decision')
  const approverNote = context.getAnswer('approverNote') || null

  if (decision !== 'approve' && decision !== 'reject') {
    context.setData('decisionError', 'Select whether to approve or reject this request')

    return
  }

  const assignedRequests = context.getData('assignedLeaveRequests') as AssignedLeaveRequestItem[] | undefined
  const request = assignedRequests?.find(r => r.id === requestId)

  if (!request) {
    session.decisionError = 'Request not found'

    return
  }

  if (request.status !== 'PENDING') {
    session.decisionError = `This request has already been ${request.status.toLowerCase()}`

    return
  }

  const status = decision === 'approve' ? 'APPROVED' : 'REJECTED'

  try {
    await deps.annualLeaveApiClient.decideRequest(session.user.id, requestId, {
      status,
      approverNote,
    })

    const duration = formatDuration(request.duration)
    const startDate = formatDateWithWeekday(request.startDate)
    const endDate = formatDateWithWeekday(request.endDate)
    const action = decision === 'approve' ? 'approved' : 'rejected'

    session.decisionSuccess = `Leave request for ${request.creatorName}: ${duration} (${startDate} to ${endDate}) has been ${action}.`
    context.setData('decisionSuccess', session.decisionSuccess)
  } catch (error) {
    const fallbackError = 'Something went wrong while processing the decision. Please try again'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

    logger.error({ requestId, userId: session.user.id }, `Decision request failed: ${message}`)
    context.setData('decisionError', message)
  }
}

export default decideRequest
