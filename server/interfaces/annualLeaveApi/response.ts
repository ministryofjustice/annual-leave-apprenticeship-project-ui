import { LeaveRequest } from './shared'

export interface LoginResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  managerId: string | null
  managerName: string
  annualEntitlement: number
  isManager: boolean
}
export interface AssignedLeaveRequestItem extends LeaveRequest {
  creatorName: string
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
