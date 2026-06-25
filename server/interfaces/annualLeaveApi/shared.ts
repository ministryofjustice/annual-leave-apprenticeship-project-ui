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
  status: string
  creatorNote: string
  approverNote: string | null
}
