import logger from '../../../../logger'
import type { AssignedLeaveRequestItem } from '../../../../interfaces/annualLeaveApi/response'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import { formatRequestDetails } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

// used for loading both user requests and manager assigned requests
const loadRequest = (_deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()
  const requestId = context.getRequestParam('id')

  if (!requestId) {
    context.setData('loadUserRequestError', true)

    return
  }

  // finds request in loaded userLeaveRequests (set by loadRequests effect which runs on journey level - for hydrated data in sidebar stats)
  const userLeaveRequests = context.getData('userLeaveRequests') as LeaveRequest[] | undefined
  const userRequest = userLeaveRequests?.find(r => r.id === requestId)

  if (userRequest) {
    context.setData('loadUserRequestError', false)
    context.setData('currentRequest', formatRequestDetails(userRequest))

    return
  }

  // if it's manager > will look through assigned requests to find a match
  if (session.user?.isManager) {
    const assignedRequests = context.getData('assignedLeaveRequests') as AssignedLeaveRequestItem[] | undefined
    const assignedRequest = assignedRequests?.find(r => r.id === requestId)

    if (assignedRequest) {
      context.setData('loadUserRequestError', false)
      context.setData('currentRequest', formatRequestDetails(assignedRequest))

      return
    }
  }

  logger.error({ requestId }, 'Request not found')
  context.setData('loadUserRequestError', true)
}

export default loadRequest
