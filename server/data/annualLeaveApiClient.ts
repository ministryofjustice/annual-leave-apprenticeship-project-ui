import config from '../config'
import logger from '../logger'

export interface LoginResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  managerId: string | null
  annualEntitlement: number
  isManager: boolean
}

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
}
