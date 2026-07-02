import AnnualLeaveApiClient from './annualLeaveApiClient'
import type { BalanceRes, LoginRes, UserLeaveRequestsRes } from '../interfaces/annualLeaveApi/response'
import type { CreateLeaveRequestReq } from '../interfaces/annualLeaveApi/request'
import type { LeaveRequest } from '../interfaces/annualLeaveApi/shared'

jest.mock('../config', () => ({
  apis: {
    annualLeaveApi: {
      url: 'http://localhost:8080',
      timeout: { response: 5000, deadline: 5000 },
      agent: { maxSockets: 100, maxFreeSockets: 10, freeSocketTimeout: 30000 },
    },
  },
}))

jest.mock('../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

describe('AnnualLeaveApiClient', () => {
  let client: AnnualLeaveApiClient
  let mockPost: jest.SpyInstance
  let mockGet: jest.SpyInstance
  let mockDelete: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    client = new AnnualLeaveApiClient()
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
    mockDelete = jest.spyOn(client as unknown as { delete: jest.Mock }, 'delete')
  })

  describe('login()', () => {
    it('should send credentials to auth endpoint', async () => {
      const expectedResponse: LoginRes = {
        id: 'user-123',
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        managerId: 'manager-456',
        managerName: 'Bob Jones',
        annualEntitlement: 25,
        isManager: false,
      }

      mockPost.mockResolvedValue(expectedResponse)

      const result = await client.login({ email: 'alice@example.com', password: 'password' })

      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({
        path: '/auth/login',
        data: { email: 'alice@example.com', password: 'password' },
      })
    })

    it('should propagate errors', async () => {
      mockPost.mockRejectedValue(new Error('Login failed'))

      await expect(client.login({ email: 'alice@example.com', password: 'wrong' })).rejects.toThrow('Login failed')
    })
  })

  describe('getRequests()', () => {
    it('should fetch requests with user ID header', async () => {
      const expectedResponse: UserLeaveRequestsRes = {
        userRequests: [
          {
            id: 'req-1',
            createdAt: '2026-06-01T10:00:00Z',
            decisionAt: null,
            creatorId: 'user-123',
            approverId: 'manager-456',
            startDate: '2026-07-01',
            endDate: '2026-07-03',
            duration: 3,
            isFirstDayHalfDay: false,
            isLastDayHalfDay: false,
            status: 'PENDING',
            creatorNote: 'Holiday',
            approverNote: null,
          },
        ],
      }

      mockGet.mockResolvedValue(expectedResponse)

      const result = await client.getRequests('user-123')

      expect(result).toEqual(expectedResponse)
      expect(mockGet).toHaveBeenCalledWith({
        path: '/requests',
        headers: { 'X-User-Id': 'user-123' },
      })
    })

    it('should propagate errors', async () => {
      mockGet.mockRejectedValue(new Error('Failed to fetch requests'))

      await expect(client.getRequests('user-123')).rejects.toThrow('Failed to fetch requests')
    })
  })

  describe('getBalance()', () => {
    it('should fetch balance with user ID header', async () => {
      const expectedResponse: BalanceRes = {
        annualEntitlement: 25,
        availableBalance: 20,
        actualBalance: 22,
        pendingDays: 3,
        approvedDays: 2,
      }

      mockGet.mockResolvedValue(expectedResponse)

      const result = await client.getBalance('user-123')

      expect(result).toEqual(expectedResponse)
      expect(mockGet).toHaveBeenCalledWith({
        path: '/balance',
        headers: { 'X-User-Id': 'user-123' },
      })
    })

    it('should propagate errors', async () => {
      mockGet.mockRejectedValue(new Error('Failed to fetch balance'))

      await expect(client.getBalance('user-123')).rejects.toThrow('Failed to fetch balance')
    })
  })

  describe('createRequest()', () => {
    it('should send request data with user ID header', async () => {
      const requestData: CreateLeaveRequestReq = {
        startDate: '2026-07-14',
        endDate: '2026-07-17',
        isFirstDayHalfDay: false,
        isLastDayHalfDay: true,
        creatorNote: 'Summer holiday',
      }

      const expectedResponse: LeaveRequest = {
        id: 'req-new',
        createdAt: '2026-07-01T10:00:00Z',
        decisionAt: null,
        creatorId: 'user-123',
        approverId: 'manager-456',
        startDate: '2026-07-14',
        endDate: '2026-07-17',
        duration: 3.5,
        isFirstDayHalfDay: false,
        isLastDayHalfDay: true,
        status: 'PENDING',
        creatorNote: 'Summer holiday',
        approverNote: null,
      }

      mockPost.mockResolvedValue(expectedResponse)

      const result = await client.createRequest('user-123', requestData)

      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({
        path: '/requests',
        headers: { 'X-User-Id': 'user-123' },
        data: requestData,
      })
    })

    it('should propagate errors', async () => {
      mockPost.mockRejectedValue(new Error('Failed to create request'))

      await expect(
        client.createRequest('user-123', {
          startDate: '2026-07-14',
          endDate: '2026-07-17',
          isFirstDayHalfDay: false,
          isLastDayHalfDay: false,
          creatorNote: null,
        }),
      ).rejects.toThrow('Failed to create request')
    })
  })

  describe('deleteRequest()', () => {
    it('should send delete request with user ID header', async () => {
      mockDelete.mockResolvedValue(undefined)

      await client.deleteRequest('user-123', 'req-1')

      expect(mockDelete).toHaveBeenCalledWith({
        path: '/requests/req-1',
        headers: { 'X-User-Id': 'user-123' },
      })
    })

    it('should propagate errors', async () => {
      mockDelete.mockRejectedValue(new Error('Failed to delete request'))

      await expect(client.deleteRequest('user-123', 'req-1')).rejects.toThrow('Failed to delete request')
    })
  })
})
