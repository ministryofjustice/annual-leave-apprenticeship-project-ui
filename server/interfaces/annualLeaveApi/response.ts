import { LeaveRequest } from './shared'

export interface LoginRes {
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

export interface UserLeaveRequestsRes {
  userRequests: LeaveRequest[]
}

export interface BalanceRes {
  annualEntitlement: number
  availableBalance: number
  actualBalance: number
  pendingDays: number
  approvedDays: number
}
