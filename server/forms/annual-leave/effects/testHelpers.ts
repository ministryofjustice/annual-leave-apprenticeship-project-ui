import type { AnnualLeaveDeps, AnnualLeaveEffectContext, AnnualLeaveSession } from './types'
import type { LoginRes } from '../../../interfaces/annualLeaveApi/response'
import type { LeaveRequest } from '../../../interfaces/annualLeaveApi/shared'

export const mockUser: LoginRes = {
  id: 'user-1',
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice@example.com',
  managerId: 'mgr-1',
  managerName: 'Bob Jones',
  annualEntitlement: 25,
  isManager: false,
}

export const mockLeaveRequest: LeaveRequest = {
  id: 'req-1',
  createdAt: '2026-06-01T10:00:00Z',
  decisionAt: null,
  creatorId: 'user-1',
  approverId: 'mgr-1',
  startDate: '2026-07-01',
  endDate: '2026-07-05',
  duration: 5,
  isFirstDayHalfDay: false,
  isLastDayHalfDay: false,
  status: 'PENDING',
  creatorNote: 'Holiday',
  approverNote: null,
  decisionSeenAt: null,
}

interface MockContextOptions {
  session?: Partial<AnnualLeaveSession>
  data?: Record<string, unknown>
  answers?: Record<string, unknown>
  requestParams?: Record<string, string>
}

export const createMockContext = (options: MockContextOptions = {}) => {
  const sessionData: AnnualLeaveSession = { ...options.session } as AnnualLeaveSession
  const dataMap: Record<string, unknown> = { ...options.data }
  const answersMap: Record<string, unknown> = { ...options.answers }
  const paramsMap: Record<string, string> = { ...options.requestParams }

  return {
    getSession: jest.fn(() => sessionData),
    setData: jest.fn((key: string, value: unknown) => {
      dataMap[key] = value
    }),
    getData: jest.fn((key: string) => dataMap[key]),
    getAnswer: jest.fn((key: string) => answersMap[key]),
    getRequestParam: jest.fn((key: string) => paramsMap[key]),
  } as unknown as AnnualLeaveEffectContext
}

export const createMockDeps = (
  overrides: Partial<Record<keyof AnnualLeaveDeps['annualLeaveApiClient'], jest.Mock>> = {},
) => {
  return {
    annualLeaveApiClient: {
      login: jest.fn(),
      getRequests: jest.fn(),
      createRequest: jest.fn(),
      deleteRequest: jest.fn(),
      getAssignedRequests: jest.fn(),
      decideRequest: jest.fn(),
      markDecisionSeen: jest.fn(),
      getBalance: jest.fn(),
      ...overrides,
    },
  } as unknown as AnnualLeaveDeps
}
