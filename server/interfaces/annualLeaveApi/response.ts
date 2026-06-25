import { LeaveRequest } from './shared'

export interface LoginResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  managerId: string | null
  annualEntitlement: number
  isManager: boolean
}

export interface RequestsResponse {
  userRequests: LeaveRequest[]
}

export interface BalanceResponse {
  annualEntitlement: number
  availableBalance: number
  actualBalance: number
  pendingDays: number
  approvedDays: number
}
