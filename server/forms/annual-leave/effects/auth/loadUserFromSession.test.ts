import loadUserFromSession from './loadUserFromSession'
import { createMockContext, createMockDeps, mockUser } from '../testHelpers'

const deps = createMockDeps()

describe('loadUserFromSession', () => {
  it('should populate data with all user fields from session', async () => {
    const context = createMockContext({ session: { user: mockUser } })

    await loadUserFromSession(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('userId', 'user-1')
    expect(context.setData).toHaveBeenCalledWith('userFirstName', 'Alice')
    expect(context.setData).toHaveBeenCalledWith('userLastName', 'Smith')
    expect(context.setData).toHaveBeenCalledWith('userEmail', 'alice@example.com')
    expect(context.setData).toHaveBeenCalledWith('annualEntitlement', 25)
    expect(context.setData).toHaveBeenCalledWith('isManager', false)
    expect(context.setData).toHaveBeenCalledWith('managerName', 'Bob Jones')
  })

  it('should not set any data when no user in session', async () => {
    const context = createMockContext()

    await loadUserFromSession(deps)(context)

    expect(context.setData).not.toHaveBeenCalled()
  })
})
