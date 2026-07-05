import type { AssignedLeaveRequestItem } from '../../interfaces/annualLeaveApi/response'
import type { LeaveRequest } from '../../interfaces/annualLeaveApi/shared'
import { annualLeaveUrls, leaveRequestStatuses } from './constants'
import { FormattedLeaveRequestToSummaryListItem, FormattedLeaveRequestToTableRow } from './types'

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatDateWithWeekday = (dateString: string): string => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${datePart} at ${timePart}`
}

export const isValidIsoDate = (value: string): boolean => {
  const date = new Date(value)

  return !Number.isNaN(date.getTime())
}

export const isPastDate = (value: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return new Date(value) < today
}
export const datesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean =>
  startA <= endB && endA >= startB

export const formatDuration = (duration: number): string => {
  let durationText = ''
  switch (duration) {
    case 0.5:
      durationText = 'Half day'
      break
    case 1:
      durationText = '1 day'
      break
    default:
      durationText = `${duration} days`
  }
  return durationText
}

const isAssignedRequest = (request: LeaveRequest): request is AssignedLeaveRequestItem => 'creatorName' in request

export const formatLeaveRequestToTableRowSections = (
  request: LeaveRequest | AssignedLeaveRequestItem,
): FormattedLeaveRequestToTableRow => {
  const status = leaveRequestStatuses[request.status]
  const isAssigned = isAssignedRequest(request)
  const viewUrl = isAssigned ? annualLeaveUrls.viewAssignedRequest : annualLeaveUrls.viewUpdateUserRequest
  const isPending = isAssigned && status.text === 'Pending'
  const viewText = isPending ? 'View/Update' : 'View'

  return {
    id: request.id,
    ...(isAssigned && { creatorName: escapeHtml(request.creatorName) }),
    duration: formatDuration(request.duration),
    startDate: formatDate(request.startDate),
    endDate: formatDate(request.endDate),
    requestedOn: formatDateTime(request.createdAt),
    statusTag: `<strong class="govuk-tag ${status?.tagClass ?? ''}">${status?.text ?? request.status}</strong>`,
    viewLink: `<a href="${viewUrl}/${request.id}" class="govuk-link">${viewText}</a>`,
  }
}

export const getOnLeaveStatus = (approvedRequests: LeaveRequest[]): string | undefined => {
  const todayStr = new Date().toISOString().split('T')[0]
  const activeRequest = approvedRequests.find(r => todayStr >= r.startDate && todayStr <= r.endDate)

  if (!activeRequest) {
    return undefined
  }

  const isHalfDay =
    (todayStr === activeRequest.startDate && activeRequest.isFirstDayHalfDay) ||
    (todayStr === activeRequest.endDate && activeRequest.isLastDayHalfDay)

  return isHalfDay ? 'ON LEAVE (Half day)' : 'ON LEAVE'
}

export const formatRequestDetails = (
  request: LeaveRequest | AssignedLeaveRequestItem,
): FormattedLeaveRequestToSummaryListItem => {
  const status = leaveRequestStatuses[request.status]

  return {
    requestId: request.id,
    ...(isAssignedRequest(request) && { creatorName: escapeHtml(request.creatorName) }),
    startDate: formatDateWithWeekday(request.startDate),
    endDate: formatDateWithWeekday(request.endDate),
    duration: formatDuration(request.duration),
    isFirstDayHalfDay: request.isFirstDayHalfDay,
    isLastDayHalfDay: request.isLastDayHalfDay,
    requestedOn: formatDateTime(request.createdAt),
    requestedOnRaw: request.createdAt,
    decisionAt: request.decisionAt ? formatDateTime(request.decisionAt) : '',
    statusText: status?.text ?? request.status,
    statusTagClass: status?.tagClass ?? '',
    decisionAtRaw: request.decisionAt ?? '',
    creatorNote: request.creatorNote,
    approverNote: request.approverNote ?? '',
    decisionSeenAt: request.decisionSeenAt ? formatDateTime(request.decisionSeenAt) : '',
    decisionSeenAtRaw: request.decisionSeenAt ?? '',
    status: request.status,
  }
}
