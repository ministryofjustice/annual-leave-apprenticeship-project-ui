import markDecisionSeen from './markDecisionSeen'
import { createMockContext, createMockDeps, mockLeaveRequest, mockUser } from '../testHelpers'

describe('markDecisionSeen', () => {
  it('should call API when request is decided, user is creator, and not already seen', async () => {
    const approvedRequest = { ...mockLeaveRequest, status: 'APPROVED' as const, decisionAt: '2026-07-03T14:00:00Z' }
    const deps = createMockDeps({ markDecisionSeen: jest.fn().mockResolvedValue(undefined) })
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [approvedRequest] },
      requestParams: { id: 'req-1' },
    })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).toHaveBeenCalledWith('user-1', 'req-1')
  })

  it('should not call API when request is still pending', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [mockLeaveRequest] },
      requestParams: { id: 'req-1' },
    })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).not.toHaveBeenCalled()
  })

  it('should not call API when user is not the creator', async () => {
    const approvedRequest = {
      ...mockLeaveRequest,
      status: 'APPROVED' as const,
      decisionAt: '2026-07-03T14:00:00Z',
      creatorId: 'other-user',
    }
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [approvedRequest] },
      requestParams: { id: 'req-1' },
    })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).not.toHaveBeenCalled()
  })

  it('should not call API when decision is already seen', async () => {
    const seenRequest = {
      ...mockLeaveRequest,
      status: 'APPROVED' as const,
      decisionAt: '2026-07-03T14:00:00Z',
      decisionSeenAt: '2026-07-04T09:00:00Z',
    }
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [seenRequest] },
      requestParams: { id: 'req-1' },
    })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).not.toHaveBeenCalled()
  })

  it('should not call API when request not found in userLeaveRequests', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [] },
      requestParams: { id: 'req-1' },
    })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).not.toHaveBeenCalled()
  })

  it('should not throw when API call fails', async () => {
    const approvedRequest = { ...mockLeaveRequest, status: 'APPROVED' as const, decisionAt: '2026-07-03T14:00:00Z' }
    const deps = createMockDeps({ markDecisionSeen: jest.fn().mockRejectedValue(new Error('fail')) })
    const context = createMockContext({
      session: { user: mockUser },
      data: { userLeaveRequests: [approvedRequest] },
      requestParams: { id: 'req-1' },
    })

    await expect(markDecisionSeen(deps)(context)).resolves.toBeUndefined()
  })

  it('should not call API when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext({ requestParams: { id: 'req-1' } })

    await markDecisionSeen(deps)(context)

    expect(deps.annualLeaveApiClient.markDecisionSeen).not.toHaveBeenCalled()
  })
})
