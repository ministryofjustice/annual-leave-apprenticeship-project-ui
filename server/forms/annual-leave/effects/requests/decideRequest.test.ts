import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import decideRequest from './decideRequest'
import { createMockContext, createMockDeps, mockLeaveRequest, mockUser } from '../testHelpers'
import type { AssignedLeaveRequestItem } from '../../../../interfaces/annualLeaveApi/response'

const mockAssignedRequest: AssignedLeaveRequestItem = {
  ...mockLeaveRequest,
  creatorName: 'Alice Smith',
  status: 'PENDING',
}

describe('decideRequest', () => {
  it('should call API with APPROVED status when decision is approve', async () => {
    const deps = createMockDeps({ decideRequest: jest.fn().mockResolvedValue(undefined) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'approve', approverNote: '' },
      data: { assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(deps.annualLeaveApiClient.decideRequest).toHaveBeenCalledWith('user-1', 'req-1', {
      status: 'APPROVED',
      approverNote: null,
    })
    expect(context.getSession().decisionSuccess).toContain('approved')
    expect(context.getSession().decisionSuccess).toContain('Alice Smith')
  })

  it('should call API with REJECTED status when decision is reject', async () => {
    const deps = createMockDeps({ decideRequest: jest.fn().mockResolvedValue(undefined) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'reject', approverNote: 'Not enough cover' },
      data: { assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(deps.annualLeaveApiClient.decideRequest).toHaveBeenCalledWith('user-1', 'req-1', {
      status: 'REJECTED',
      approverNote: 'Not enough cover',
    })
    expect(context.getSession().decisionSuccess).toContain('rejected')
  })

  it('should set error when decision is invalid', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'maybe', approverNote: '' },
      data: { assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('decisionError', 'Select whether to approve or reject this request')
    expect(deps.annualLeaveApiClient.decideRequest).not.toHaveBeenCalled()
  })

  it('should set error when request is not pending', async () => {
    const approvedRequest: AssignedLeaveRequestItem = { ...mockAssignedRequest, status: 'APPROVED' }
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'approve', approverNote: '' },
      data: { assignedLeaveRequests: [approvedRequest] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(context.getSession().decisionError).toBe('This request has already been approved')
    expect(deps.annualLeaveApiClient.decideRequest).not.toHaveBeenCalled()
  })

  it('should set error when request not found in assigned requests', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'approve', approverNote: '' },
      data: { assignedLeaveRequests: [] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(context.getSession().decisionError).toBe('Request not found')
  })

  it('should set error from SanitisedError userMessage when API fails', async () => {
    const error = new SanitisedError('fail')
    error.data = { userMessage: 'Conflict' }

    const deps = createMockDeps({ decideRequest: jest.fn().mockRejectedValue(error) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: { decision: 'approve', approverNote: '' },
      data: { assignedLeaveRequests: [mockAssignedRequest] },
      requestParams: { id: 'req-1' },
    })

    await decideRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('decisionError', 'Conflict')
  })

  it('should set error when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext({ requestParams: { id: 'req-1' } })

    await decideRequest(deps)(context)

    expect(context.getSession().decisionError).toBe('Something went wrong. Please try again')
    expect(deps.annualLeaveApiClient.decideRequest).not.toHaveBeenCalled()
  })
})
