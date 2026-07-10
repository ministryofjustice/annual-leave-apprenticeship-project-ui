import { RestClient } from '@ministryofjustice/hmpps-rest-client'
import config from '../config'
import logger from '../logger'
import {
  AssignedLeaveRequestItem,
  BalanceRes,
  LoginRes,
  UserLeaveRequestsRes,
} from '../interfaces/annualLeaveApi/response'
import { LeaveRequest } from '../interfaces/annualLeaveApi/shared'
import { CreateLeaveRequestReq, DecisionReq, LoginReq } from '../interfaces/annualLeaveApi/request'

export default class AnnualLeaveApiClient extends RestClient {
  constructor() {
    super('Annual Leave API', config.apis.annualLeaveApi, logger)
  }

  async login(credentials: LoginReq): Promise<LoginRes> {
    const { email, password } = credentials
    return this.post({
      path: '/auth/login',
      data: { email, password },
    })
  }

  async getRequests(userId: string): Promise<UserLeaveRequestsRes> {
    return this.get({
      path: '/requests',
      headers: { 'X-User-Id': userId },
    })
  }

  async createRequest(userId: string, request: CreateLeaveRequestReq): Promise<LeaveRequest> {
    return this.post({
      path: '/requests',
      headers: { 'X-User-Id': userId },
      data: { ...request },
    })
  }

  async deleteRequest(userId: string, requestId: string): Promise<void> {
    return this.delete({
      path: `/requests/${requestId}`,
      headers: { 'X-User-Id': userId },
    })
  }

  async getAssignedRequests(userId: string): Promise<AssignedLeaveRequestItem[]> {
    return this.get({
      path: '/requests/assigned',
      headers: { 'X-User-Id': userId },
    })
  }

  async decideRequest(userId: string, requestId: string, decision: DecisionReq): Promise<LeaveRequest> {
    return this.patch({
      path: `/requests/assigned/${requestId}`,
      headers: { 'X-User-Id': userId },
      data: { ...decision },
    })
  }

  async markDecisionSeen(userId: string, requestId: string): Promise<LeaveRequest> {
    return this.patch({
      path: `/requests/mark-decision-seen/${requestId}`,
      headers: { 'X-User-Id': userId },
    })
  }

  async getBalance(userId: string): Promise<BalanceRes> {
    return this.get({
      path: '/balance',
      headers: { 'X-User-Id': userId },
    })
  }
}
