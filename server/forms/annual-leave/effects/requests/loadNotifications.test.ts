import loadNotifications from './loadNotifications'
import { createMockContext, createMockDeps } from '../testHelpers'

const deps = createMockDeps()

describe('loadNotifications', () => {
  it('should copy all notification keys from session to data and clear them', async () => {
    const context = createMockContext({
      session: {
        deleteRequestSuccess: 'Deleted successfully',
        createRequestError: 'Create failed',
        decisionSuccess: 'Approved',
      },
    })

    await loadNotifications(deps)(context)

    const session = context.getSession()

    expect(context.setData).toHaveBeenCalledWith('deleteRequestSuccess', 'Deleted successfully')
    expect(context.setData).toHaveBeenCalledWith('createRequestError', 'Create failed')
    expect(context.setData).toHaveBeenCalledWith('decisionSuccess', 'Approved')
    expect(session.deleteRequestSuccess).toBeUndefined()
    expect(session.createRequestError).toBeUndefined()
    expect(session.decisionSuccess).toBeUndefined()
  })

  it('should not set data when no notifications in session', async () => {
    const context = createMockContext()

    await loadNotifications(deps)(context)

    expect(context.setData).not.toHaveBeenCalled()
  })
})
