import loadLoginError from './loadLoginError'
import { createMockContext, createMockDeps } from '../testHelpers'

const deps = createMockDeps()

describe('loadLoginError', () => {
  it('should copy loginError from session to data and clear it from session', async () => {
    const context = createMockContext({ session: { loginError: 'Bad credentials' } })

    await loadLoginError(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loginError', 'Bad credentials')
    expect(context.getSession().loginError).toBeUndefined()
  })

  it('should not set data when no loginError in session', async () => {
    const context = createMockContext()

    await loadLoginError(deps)(context)

    expect(context.setData).not.toHaveBeenCalled()
  })
})
