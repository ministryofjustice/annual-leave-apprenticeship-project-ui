import logger from '../../../../logger'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import { formatRequestDetails } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const loadRequest = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const requestId = context.getRequestParam('id')

  if (!requestId) {
    context.setData('loadUserRequestError', true)

    return
  }

  const userLeaveRequests = context.getData('userLeaveRequests') as LeaveRequest[] | undefined
  const request = userLeaveRequests?.find(r => r.id === requestId)

  if (!request) {
    logger.error({ requestId }, 'Request not found')
    context.setData('loadUserRequestError', true)

    return
  }

  context.setData('loadUserRequestError', false)
  context.setData('currentRequest', formatRequestDetails(request))
}

export default loadRequest
