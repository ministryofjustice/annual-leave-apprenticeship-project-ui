import loadBalance from './loadBalance'
import { createMockContext, createMockDeps, mockUser } from '../testHelpers'
import type { BalanceRes } from '../../../../interfaces/annualLeaveApi/response'

const mockBalance: BalanceRes = {
  annualEntitlement: 25,
  availableBalance: 18,
  actualBalance: 20,
  pendingDays: 2,
  approvedDays: 5,
}

describe('loadBalance', () => {
  it('should populate balance data when API call succeeds', async () => {
    const deps = createMockDeps({ getBalance: jest.fn().mockResolvedValue(mockBalance) })
    const context = createMockContext({ session: { user: mockUser } })

    await loadBalance(deps)(context)

    expect(deps.annualLeaveApiClient.getBalance).toHaveBeenCalledWith('user-1')
    expect(context.setData).toHaveBeenCalledWith('loadBalanceError', false)
    expect(context.setData).toHaveBeenCalledWith('availableBalance', 18)
    expect(context.setData).toHaveBeenCalledWith('actualBalance', 20)
    expect(context.setData).toHaveBeenCalledWith('pendingDays', 2)
    expect(context.setData).toHaveBeenCalledWith('approvedDays', 5)
  })

  it('should set loadBalanceError when API call fails', async () => {
    const deps = createMockDeps({ getBalance: jest.fn().mockRejectedValue(new Error('fail')) })
    const context = createMockContext({ session: { user: mockUser } })

    await loadBalance(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('loadBalanceError', true)
  })

  it('should not call API when no user in session', async () => {
    const deps = createMockDeps()
    const context = createMockContext()

    await loadBalance(deps)(context)

    expect(deps.annualLeaveApiClient.getBalance).not.toHaveBeenCalled()
  })
})
