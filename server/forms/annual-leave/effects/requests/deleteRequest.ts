import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const deleteRequest = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()
  const requestId = context.getRequestParam('id')

  if (!session.user || !requestId) {
    session.deleteRequestError = 'Something went wrong. Please try again'

    return
  }

  const currentRequest = context.getData('currentRequest') as
    | { duration: string; startDate: string; endDate: string }
    | undefined

  try {
    await deps.annualLeaveApiClient.deleteRequest(session.user.id, requestId)

    session.deleteRequestSuccess = `Leave request for ${currentRequest?.duration} (${currentRequest?.startDate} to ${currentRequest?.endDate}) has been successfully deleted`
  } catch (error) {
    const fallbackError = 'Something went wrong while deleting the request. Please try again'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

    logger.error({ requestId, userId: session.user.id }, `Delete request failed: ${message}`)
    session.deleteRequestError = message
  }
}

export default deleteRequest
