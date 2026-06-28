import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../logger'
import { BalanceResponse, LoginResponse, RequestsResponse } from '../interfaces/annualLeaveApi/response'

export default class AnnualLeaveApiClient extends RestClient {
  constructor() {
    super('Annual Leave API', config.apis.annualLeaveApi, logger)
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    return this.post({
      path: '/auth/login',
      data: { email, password },
    })
  }

  async getRequests(userId: string): Promise<RequestsResponse> {
    return this.get({
      path: '/requests',
      headers: { 'X-User-Id': userId },
    })
  }

  async getBalance(userId: string): Promise<BalanceResponse> {
    return this.get({
      path: '/balance',
      headers: { 'X-User-Id': userId },
    })
  }
}
