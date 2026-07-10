import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import deleteRequest from './deleteRequest'
import { createMockContext, createMockDeps, mockUser } from '../testHelpers'

describe('deleteRequest', () => {
  it('should call API and set success message on session', async () => {
    const deps = createMockDeps({ deleteRequest: jest.fn().mockResolvedValue(undefined) })
    const context = createMockContext({
      session: { user: mockUser },
      data: { currentRequest: { duration: '5 days', startDate: '1 July 2026', endDate: '5 July 2026' } },
      requestParams: { id: 'req-1' },
    })

    await deleteRequest(deps)(context)

    expect(deps.annualLeaveApiClient.deleteRequest).toHaveBeenCalledWith('user-1', 'req-1')
    expect(context.getSession().deleteRequestSuccess).toContain('5 days')
    expect(context.getSession().deleteRequestSuccess).toContain('1 July 2026')
  })

  it('should set error from SanitisedError userMessage when API fails', async () => {
    const error = new SanitisedError('fail')
    error.data = { userMessage: 'Request not found' }

    const deps = createMockDeps({ deleteRequest: jest.fn().mockRejectedValue(error) })
    const context = createMockContext({
      session: { user: mockUser },
      requestParams: { id: 'req-1' },
    })

    await deleteRequest(deps)(context)

    expect(context.getSession().deleteRequestError).toBe('Request not found')
  })

  it('should set fallback error for non-SanitisedError', async () => {
    const deps = createMockDeps({ deleteRequest: jest.fn().mockRejectedValue(new Error('network')) })
    const context = createMockContext({
      session: { user: mockUser },
      requestParams: { id: 'req-1' },
    })

    await deleteRequest(deps)(context)

    expect(context.getSession().deleteRequestError).toBe(
      'Something went wrong while deleting the request. Please try again',
    )
  })

  it('should set error when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext({ requestParams: { id: 'req-1' } })

    await deleteRequest(deps)(context)

    expect(context.getSession().deleteRequestError).toBe('Something went wrong. Please try again')
    expect(deps.annualLeaveApiClient.deleteRequest).not.toHaveBeenCalled()
  })

  it('should set error when no request id in params', async () => {
    const deps = createMockDeps()
    const context = createMockContext({ session: { user: mockUser } })

    await deleteRequest(deps)(context)

    expect(context.getSession().deleteRequestError).toBe('Something went wrong. Please try again')
    expect(deps.annualLeaveApiClient.deleteRequest).not.toHaveBeenCalled()
  })
})
