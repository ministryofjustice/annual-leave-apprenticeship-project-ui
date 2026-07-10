import loadRequest from './loadRequest'
import { createMockContext, createMockDeps, mockLeaveRequest, mockUser } from '../testHelpers'
import type { AssignedLeaveRequestItem } from '../../../../interfaces/annualLeaveApi/response'

const mockAssignedRequest: AssignedLeaveRequestItem = { ...mockLeaveRequest, creatorName: 'Alice Smith' }

describe('loadRequest', () => {
  it('should set currentRequest when found in userLeaveRequests', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      data: { userLeaveRequests: [mockLeaveRequest] },
      requestParams: { id: 'req-1' },
    })

    await loadRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestError', false)
    expect(context.setData).toHaveBeenCalledWith('currentRequest', expect.objectContaining({ requestId: 'req-1' }))
  })

  it('should set currentRequest from assignedLeaveRequests when user is manager', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: { ...mockUser, isManager: true } },
      data: { userLeaveRequests: [], assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await loadRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestError', false)
    expect(context.setData).toHaveBeenCalledWith(
      'currentRequest',
      expect.objectContaining({ requestId: 'req-1', creatorName: 'Alice Smith' }),
    )
  })

  it('should set error when request not found in any list', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: { ...mockUser, isManager: true } },
      data: { userLeaveRequests: [], assignedLeaveRequests: [] },
      requestParams: { id: 'nonexistent' },
    })

    await loadRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestError', true)
  })

  it('should not check assignedLeaveRequests when user is not manager', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: { ...mockUser, isManager: false } },
      data: { userLeaveRequests: [], assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await loadRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestError', true)
  })

  it('should set error when no request id in params', async () => {
    const deps = createMockDeps()
    const context = createMockContext()

    await loadRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestError', true)
  })
})
