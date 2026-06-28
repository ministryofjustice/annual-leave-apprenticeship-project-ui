export type StatusDetails = {
  text: string
  tagClass: string
}

export interface FormattedToTableRowLeaveRequest {
  id: string
  duration: string
  startDate: string
  endDate: string
  requestedOn: string
  statusTag: string
  viewLink: string
}
