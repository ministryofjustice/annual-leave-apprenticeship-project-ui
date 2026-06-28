import AnnualLeaveApiClient from './annualLeaveApiClient'
import type { BalanceResponse, LoginResponse, RequestsResponse } from '../interfaces/annualLeaveApi/response'

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

  beforeEach(() => {
    jest.clearAllMocks()

    client = new AnnualLeaveApiClient()
    mockPost = jest.spyOn(client as unknown as { post: jest.Mock }, 'post')
    mockGet = jest.spyOn(client as unknown as { get: jest.Mock }, 'get')
  })

  describe('login()', () => {
    it('should send credentials to auth endpoint', async () => {
      const expectedResponse: LoginResponse = {
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

      const result = await client.login('alice@example.com', 'password')

      expect(result).toEqual(expectedResponse)
      expect(mockPost).toHaveBeenCalledWith({
        path: '/auth/login',
        data: { email: 'alice@example.com', password: 'password' },
      })
    })

    it('should propagate errors', async () => {
      mockPost.mockRejectedValue(new Error('Login failed'))

      await expect(client.login('alice@example.com', 'wrong')).rejects.toThrow('Login failed')
    })
  })

  describe('getRequests()', () => {
    it('should fetch requests with user ID header', async () => {
      const expectedResponse: RequestsResponse = {
        userRequests: [
          {
            id: 'req-1',
            createdAt: '2026-06-01T10:00:00Z',
            decisionAt: null,
            creatorId: 'user-123',
            approverId: 'manager-456',
            startDate: '2026-07-01',
            endDate: '2026-07-05',
            duration: 5,
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
      const expectedResponse: BalanceResponse = {
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
})
