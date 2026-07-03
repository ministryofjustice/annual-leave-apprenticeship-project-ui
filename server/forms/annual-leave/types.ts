export type StatusDetails = {
  text: string
  tagClass: string
}

export interface FormattedLeaveRequestToTableRow {
  id: string
  creatorName?: string
  duration: string
  startDate: string
  endDate: string
  requestedOn: string
  statusTag: string
  viewLink: string
}

export interface FormattedLeaveRequestToSummaryListItem {
  requestId: string
  startDate: string
  endDate: string
  duration: string
  isFirstDayHalfDay: boolean
  isLastDayHalfDay: boolean
  requestedOn: string
  requestedOnRaw: string
  decisionAt: string
  statusText: string
  statusTagClass: string
  decisionAtRaw: string
  creatorNote: string
  approverNote: string
  status: string
}
