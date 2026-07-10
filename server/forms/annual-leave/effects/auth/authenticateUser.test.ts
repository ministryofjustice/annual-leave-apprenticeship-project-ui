import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import authenticateUser from './authenticateUser'
import { createMockContext, createMockDeps, mockUser } from '../testHelpers'

describe('authenticateUser', () => {
  it('should set user on session when login succeeds', async () => {
    const deps = createMockDeps({ login: jest.fn().mockResolvedValue(mockUser) })
    const context = createMockContext({ answers: { email: 'alice@example.com', password: 'password123' } })

    await authenticateUser(deps)(context)

    expect(deps.annualLeaveApiClient.login).toHaveBeenCalledWith({
      email: 'alice@example.com',
      password: 'password123',
    })
    expect(context.getSession().user).toEqual(mockUser)
  })

  it('should clear previous loginError on successful login', async () => {
    const deps = createMockDeps({ login: jest.fn().mockResolvedValue(mockUser) })
    const context = createMockContext({
      session: { loginError: 'Old error' },
      answers: { email: 'a@b.com', password: 'x' },
    })

    await authenticateUser(deps)(context)

    expect(context.getSession().loginError).toBeUndefined()
  })

  it('should set loginError from SanitisedError userMessage when login fails', async () => {
    const error = new SanitisedError('fail')
    error.data = { userMessage: 'Invalid credentials' }

    const deps = createMockDeps({ login: jest.fn().mockRejectedValue(error) })
    const context = createMockContext({ answers: { email: 'a@b.com', password: 'x' } })

    await authenticateUser(deps)(context)

    expect(context.getSession().loginError).toBe('Invalid credentials')
    expect(context.setData).toHaveBeenCalledWith('loginError', 'Invalid credentials')
  })

  it('should set fallback error when SanitisedError has no userMessage', async () => {
    const error = new SanitisedError('fail')
    error.data = {}

    const deps = createMockDeps({ login: jest.fn().mockRejectedValue(error) })
    const context = createMockContext({ answers: { email: 'a@b.com', password: 'x' } })

    await authenticateUser(deps)(context)

    expect(context.getSession().loginError).toBe('Something went wrong while signing in. Please try again later')
  })

  it('should set fallback error for non-SanitisedError', async () => {
    const deps = createMockDeps({ login: jest.fn().mockRejectedValue(new Error('network')) })
    const context = createMockContext({ answers: { email: 'a@b.com', password: 'x' } })

    await authenticateUser(deps)(context)

    expect(context.getSession().loginError).toBe('Something went wrong while signing in. Please try again later')
  })
})
