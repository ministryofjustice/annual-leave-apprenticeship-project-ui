export type LeaveRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface LeaveRequest {
  id: string
  createdAt: string
  decisionAt: string | null
  creatorId: string
  approverId: string
  startDate: string
  endDate: string
  duration: number
  isFirstDayHalfDay: boolean
  isLastDayHalfDay: boolean
  status: LeaveRequestStatus
  creatorNote: string
  approverNote: string | null
  decisionSeenAt: string | null
}
