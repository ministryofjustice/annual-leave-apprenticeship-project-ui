export interface CreateLeaveRequestReq {
  startDate: string
  endDate: string
  isFirstDayHalfDay: boolean
  isLastDayHalfDay: boolean
  creatorNote: string | null
}

export interface LoginReq {
  email: string
  password: string
}
