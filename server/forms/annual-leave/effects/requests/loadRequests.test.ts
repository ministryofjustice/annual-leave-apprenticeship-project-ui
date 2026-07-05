import loadRequests from './loadRequests'
import { createMockContext, createMockDeps, mockLeaveRequest, mockUser } from '../testHelpers'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import type { AssignedLeaveRequestItem } from '../../../../interfaces/annualLeaveApi/response'

const pendingRequest: LeaveRequest = { ...mockLeaveRequest, id: 'req-pending', status: 'PENDING' }

const approvedRequest: LeaveRequest = {
  ...mockLeaveRequest,
  id: 'req-approved',
  status: 'APPROVED',
  decisionAt: '2026-07-03T14:00:00Z',
  decisionSeenAt: null,
}

const rejectedRequest: LeaveRequest = {
  ...mockLeaveRequest,
  id: 'req-rejected',
  status: 'REJECTED',
  decisionAt: '2026-07-02T10:00:00Z',
  decisionSeenAt: null,
}

const mockAssignedRequest: AssignedLeaveRequestItem = {
  ...mockLeaveRequest,
  id: 'assigned-1',
  creatorName: 'Alice Smith',
}

describe('loadRequests', () => {
  it('should categorise user requests by status', async () => {
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({ userRequests: [pendingRequest, approvedRequest, rejectedRequest] }),
    })
    const context = createMockContext({ session: { user: mockUser } })

    await loadRequests(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('hasPendingRequests', true)
    expect(context.setData).toHaveBeenCalledWith('hasApprovedRequests', true)
    expect(context.setData).toHaveBeenCalledWith('hasRejectedRequests', true)
    expect(context.setData).toHaveBeenCalledWith('loadUserRequestsError', false)
  })

  it('should set empty arrays when user has no requests', async () => {
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({ userRequests: [] }),
    })
    const context = createMockContext({ session: { user: mockUser } })

    await loadRequests(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('hasPendingRequests', false)
    expect(context.setData).toHaveBeenCalledWith('hasApprovedRequests', false)
    expect(context.setData).toHaveBeenCalledWith('hasRejectedRequests', false)
  })

  it('should compute unseen decision counts', async () => {
    const seenApproved: LeaveRequest = {
      ...approvedRequest,
      id: 'req-seen',
      decisionSeenAt: '2026-07-04T09:00:00Z',
    }
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({
        userRequests: [approvedRequest, seenApproved, rejectedRequest],
      }),
    })
    const context = createMockContext({ session: { user: mockUser } })

    await loadRequests(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('unseenApprovedCount', 1)
    expect(context.setData).toHaveBeenCalledWith('hasUnseenApproved', true)
    expect(context.setData).toHaveBeenCalledWith('unseenRejectedCount', 1)
    expect(context.setData).toHaveBeenCalledWith('hasUnseenRejected', true)
  })

  it('should load assigned requests when user is manager', async () => {
    const managerUser = { ...mockUser, isManager: true }
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({ userRequests: [] }),
      getAssignedRequests: jest.fn().mockResolvedValue([mockAssignedRequest]),
    })
    const context = createMockContext({ session: { user: managerUser } })

    await loadRequests(deps)(context)

    expect(deps.annualLeaveApiClient.getAssignedRequests).toHaveBeenCalledWith('user-1')
    expect(context.setData).toHaveBeenCalledWith('hasActiveAssignedRequests', true)
    expect(context.setData).toHaveBeenCalledWith('activeAssignedRequestCount', 1)
  })

  it('should not load assigned requests when user is not manager', async () => {
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({ userRequests: [] }),
    })
    const context = createMockContext({ session: { user: mockUser } })

    await loadRequests(deps)(context)

    expect(deps.annualLeaveApiClient.getAssignedRequests).not.toHaveBeenCalled()
  })

  it('should set loadUserRequestsError when getRequests fails', async () => {
    const deps = createMockDeps({
      getRequests: jest.fn().mockRejectedValue(new Error('fail')),
    })
    const context = createMockContext({ session: { user: mockUser } })

    await loadRequests(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadUserRequestsError', true)
    expect(context.setData).toHaveBeenCalledWith('pendingRequests', [])
    expect(context.setData).toHaveBeenCalledWith('approvedRequests', [])
    expect(context.setData).toHaveBeenCalledWith('rejectedRequests', [])
  })

  it('should set loadAssignedRequestsError when getAssignedRequests fails', async () => {
    const managerUser = { ...mockUser, isManager: true }
    const deps = createMockDeps({
      getRequests: jest.fn().mockResolvedValue({ userRequests: [] }),
      getAssignedRequests: jest.fn().mockRejectedValue(new Error('fail')),
    })
    const context = createMockContext({ session: { user: managerUser } })

    await loadRequests(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadAssignedRequestsError', true)
    expect(context.setData).toHaveBeenCalledWith('activeAssignedRequests', [])
    expect(context.setData).toHaveBeenCalledWith('activeAssignedRequestCount', 0)
  })

  it('should not call API when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext()

    await loadRequests(deps)(context)

    expect(deps.annualLeaveApiClient.getRequests).not.toHaveBeenCalled()
  })
})
