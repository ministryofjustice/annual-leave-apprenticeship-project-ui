import config from '../config'
import logger from '../logger'
import { BalanceResponse, LoginResponse, RequestsResponse } from '../interfaces/annualLeaveApi/response'

export default class AnnualLeaveApiClient {
  private readonly apiUrl: string

  constructor() {
    this.apiUrl = config.apis.annualLeaveApi.url
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const errorBody = await response.json().catch((): undefined => undefined)
      const userMessage = (errorBody as { userMessage?: string })?.userMessage ?? 'Login failed'

      logger.warn({ status: response.status }, `Login failed: ${userMessage}`)
      throw new Error(userMessage)
    }

    return response.json() as Promise<LoginResponse>
  }

  async getRequests(userId: string): Promise<RequestsResponse> {
    const response = await fetch(`${this.apiUrl}/requests`, {
      headers: { 'X-User-Id': userId },
    })

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Failed to fetch requests')
      throw new Error('Failed to fetch requests')
    }

    return response.json() as Promise<RequestsResponse>
  }

  async getBalance(userId: string): Promise<BalanceResponse> {
    const response = await fetch(`${this.apiUrl}/balance`, {
      headers: { 'X-User-Id': userId },
    })

    if (!response.ok) {
      logger.warn({ status: response.status }, 'Failed to fetch balance')
      throw new Error('Failed to fetch balance')
    }

    return response.json() as Promise<BalanceResponse>
  }
}
