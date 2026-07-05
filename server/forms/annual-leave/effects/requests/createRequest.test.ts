import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import createRequest from './createRequest'
import { createMockContext, createMockDeps, mockLeaveRequest, mockUser } from '../testHelpers'
import type { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'

const validAnswers = {
  startDate: '2026-08-01',
  endDate: '2026-08-05',
  isFirstDayHalfDay: [] as string[],
  isLastDayHalfDay: [] as string[],
  creatorNote: '',
}

const createdRequest: LeaveRequest = {
  ...mockLeaveRequest,
  startDate: '2026-08-01',
  endDate: '2026-08-05',
  duration: 5,
}

describe('createRequest', () => {
  it('should call API with correct payload and set success message', async () => {
    const deps = createMockDeps({ createRequest: jest.fn().mockResolvedValue(createdRequest) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: validAnswers,
      data: { userLeaveRequests: [] },
    })

    await createRequest(deps)(context)

    expect(deps.annualLeaveApiClient.createRequest).toHaveBeenCalledWith('user-1', {
      startDate: '2026-08-01',
      endDate: '2026-08-05',
      isFirstDayHalfDay: false,
      isLastDayHalfDay: false,
      creatorNote: null,
    })
    expect(context.getSession().createRequestSuccess).toBeDefined()
    expect(context.setData).toHaveBeenCalledWith('createRequestSuccess', expect.any(String))
  })

  it('should pass half day flags when checked', async () => {
    const deps = createMockDeps({ createRequest: jest.fn().mockResolvedValue(createdRequest) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: { ...validAnswers, isFirstDayHalfDay: ['true'], isLastDayHalfDay: ['true'] },
      data: { userLeaveRequests: [] },
    })

    await createRequest(deps)(context)

    expect(deps.annualLeaveApiClient.createRequest).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ isFirstDayHalfDay: true, isLastDayHalfDay: true }),
    )
  })

  it('should set error when start date is invalid', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { ...validAnswers, startDate: 'not-a-date' },
    })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'Enter valid dates for start and end date')
    expect(deps.annualLeaveApiClient.createRequest).not.toHaveBeenCalled()
  })

  it('should set error when start date is in the past', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { ...validAnswers, startDate: '2020-01-01' },
    })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'Start date must be today or in the future')
  })

  it('should set error when end date is before start date', async () => {
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: { ...validAnswers, startDate: '2026-08-05', endDate: '2026-08-01' },
    })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'End date must be on or after the start date')
  })

  it('should set error when dates overlap with existing request', async () => {
    const existingRequest: LeaveRequest = {
      ...mockLeaveRequest,
      startDate: '2026-08-03',
      endDate: '2026-08-10',
      status: 'APPROVED',
    }
    const deps = createMockDeps()
    const context = createMockContext({
      session: { user: mockUser },
      answers: validAnswers,
      data: { userLeaveRequests: [existingRequest] },
    })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith(
      'createRequestError',
      expect.stringContaining('overlaps with an existing approved request'),
    )
  })

  it('should not check overlap against rejected requests', async () => {
    const rejectedRequest: LeaveRequest = {
      ...mockLeaveRequest,
      startDate: '2026-08-03',
      endDate: '2026-08-10',
      status: 'REJECTED',
    }
    const deps = createMockDeps({ createRequest: jest.fn().mockResolvedValue(createdRequest) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: validAnswers,
      data: { userLeaveRequests: [rejectedRequest] },
    })

    await createRequest(deps)(context)

    expect(deps.annualLeaveApiClient.createRequest).toHaveBeenCalled()
  })

  it('should set error from SanitisedError userMessage when API fails', async () => {
    const error = new SanitisedError('fail')
    error.data = { userMessage: 'Insufficient balance' }

    const deps = createMockDeps({ createRequest: jest.fn().mockRejectedValue(error) })
    const context = createMockContext({
      session: { user: mockUser },
      answers: validAnswers,
      data: { userLeaveRequests: [] },
    })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'Insufficient balance')
  })

  it('should set error when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext({ answers: validAnswers })

    await createRequest(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'Something went wrong. Please try again')
  })
})
