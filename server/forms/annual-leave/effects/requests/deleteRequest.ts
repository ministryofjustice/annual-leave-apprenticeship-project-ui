import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import { formatDuration, formatDateWithWeekday } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const deleteRequest = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()
  const requestId = context.getRequestParam('id')

  if (!session.user || !requestId) {
    session.deleteRequestError = 'Something went wrong. Please try again'

    return
  }

  try {
    const { userRequests } = await deps.annualLeaveApiClient.getRequests(session.user.id)
    const request = userRequests.find((r: LeaveRequest) => r.id === requestId)

    if (!request) {
      session.deleteRequestError = 'Request not found. It may have already been deleted'

      return
    }

    if (request.status !== 'PENDING') {
      session.deleteRequestError = `This request has already been ${request.status.toLowerCase()} and cannot be deleted`

      return
    }

    await deps.annualLeaveApiClient.deleteRequest(session.user.id, requestId)

    const duration = formatDuration(request.duration)
    const startDate = formatDateWithWeekday(request.startDate)
    const endDate = formatDateWithWeekday(request.endDate)

    session.deleteRequestSuccess = `Leave request for ${duration} (${startDate} to ${endDate}) has been successfully deleted`
  } catch (error) {
    const fallbackError = 'Something went wrong while deleting the request. Please try again'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

    logger.error({ requestId, userId: session.user.id }, `Delete request failed: ${message}`)
    session.deleteRequestError = message
  }
}

export default deleteRequest
