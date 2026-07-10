import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import type { AssignedLeaveRequestItem } from '../../interfaces/annualLeaveApi/response'
import type { LeaveRequest } from '../../interfaces/annualLeaveApi/shared'
import { annualLeaveUrls, leaveRequestStatuses } from './constants'
import { FormattedLeaveRequestToSummaryListItem, FormattedLeaveRequestToTableRow } from './types'

export const extractErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof SanitisedError ? (error.data?.userMessage ?? fallback) : fallback

// new Date('2026-07-01') parses date-only strings as UTC midnight, showing
// previous day in BST. the numeric constructor always uses local time.
const toLocalDate = (dateString: string): Date => {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    throw new Error(`Expected ISO date string (YYYY-MM-DD), got: '${dateString}'`)
  }

  const [year, month, day] = dateString.split('T')[0].split('-').map(Number)

  return new Date(year, month - 1, day)
}

export const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export const isoDateToLongDate = (dateString: string): string => {
  const date = toLocalDate(dateString)

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const isoDateToLongDateWithWeekday = (dateString: string): string => {
  const date = toLocalDate(dateString)

  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export const isoDateTimeToLocalDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${datePart} at ${timePart}`
}

export const isValidIsoDate = (value: string): boolean => {
  try {
    const date = toLocalDate(value)

    return !Number.isNaN(date.getTime())
  } catch {
    return false
  }
}

export const isPastDate = (value: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return toLocalDate(value) < today
}
export const datesOverlap = (startA: Date, endA: Date, startB: Date, endB: Date): boolean =>
  startA <= endB && endA >= startB

export const formatDuration = (duration: number): string => {
  if (duration === 0.5) {
    return 'Half day'
  }

  if (duration === 1) {
    return '1 day'
  }

  return `${duration} days`
}

export const unseenDecisionBadge = '<span class="moj-notification-badge"></span>'

const isAssignedRequest = (request: LeaveRequest): request is AssignedLeaveRequestItem => 'creatorName' in request

export const formatLeaveRequestToTableRowSections = (
  request: LeaveRequest | AssignedLeaveRequestItem,
): FormattedLeaveRequestToTableRow => {
  const status = leaveRequestStatuses[request.status]
  const isAssigned = isAssignedRequest(request)
  const viewUrl = isAssigned ? annualLeaveUrls.viewAssignedRequest : annualLeaveUrls.viewUpdateUserRequest
  const hasUnseenDecision = !isAssigned && request.decisionAt !== null && request.decisionSeenAt === null

  let viewText = 'View'
  if (isAssigned && status.text === 'Pending') {
    viewText = 'View/Update'
  } else if (hasUnseenDecision) {
    viewText = 'View decision'
  }

  const viewLink = hasUnseenDecision
    ? `<span class="action-with-badge"><a href="${viewUrl}/${request.id}" class="govuk-link">${viewText}</a>${unseenDecisionBadge}</span>`
    : `<a href="${viewUrl}/${request.id}" class="govuk-link">${viewText}</a>`

  return {
    id: request.id,
    ...(isAssigned && { creatorName: escapeHtml(request.creatorName) }),
    duration: formatDuration(request.duration),
    startDate: isoDateToLongDate(request.startDate),
    endDate: isoDateToLongDate(request.endDate),
    requestedOn: isoDateTimeToLocalDateTime(request.createdAt),
    statusTag: `<strong class="govuk-tag ${status?.tagClass ?? ''}">${status?.text ?? request.status}</strong>`,
    viewLink,
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
    startDate: isoDateToLongDateWithWeekday(request.startDate),
    endDate: isoDateToLongDateWithWeekday(request.endDate),
    duration: formatDuration(request.duration),
    isFirstDayHalfDay: request.isFirstDayHalfDay,
    isLastDayHalfDay: request.isLastDayHalfDay,
    requestedOn: isoDateTimeToLocalDateTime(request.createdAt),
    requestedOnRaw: request.createdAt,
    decisionAt: request.decisionAt ? isoDateTimeToLocalDateTime(request.decisionAt) : '',
    statusText: status?.text ?? request.status,
    statusTagClass: status?.tagClass ?? '',
    decisionAtRaw: request.decisionAt ?? '',
    creatorNote: request.creatorNote,
    approverNote: request.approverNote ?? '',
    decisionSeenAt: request.decisionSeenAt ? isoDateTimeToLocalDateTime(request.decisionSeenAt) : '',
    decisionSeenAtRaw: request.decisionSeenAt ?? '',
    status: request.status,
  }
}
