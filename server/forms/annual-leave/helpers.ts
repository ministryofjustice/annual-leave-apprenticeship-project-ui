import type { LeaveRequest } from '../../interfaces/annualLeaveApi/shared'
import leaveRequestStatuses from './constants'
import { FormattedToTableRowLeaveRequest } from './types'

export const escapeHtml = (str: string): string => {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  const datePart = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })

  return `${datePart} at ${timePart}`
}

export const formatDuration = (duration: number): string => {
  return duration === 1 ? '1 day' : `${duration} days`
}

export const formatHalfDayNote = (isFirstHalf: boolean, isLastHalf: boolean): string => {
  if (isFirstHalf && isLastHalf) {
    return 'First and last day are half days.'
  }

  if (isFirstHalf) {
    return 'First day is a half day.'
  }

  if (isLastHalf) {
    return 'Last day is a half day.'
  }

  return ''
}

export const formatLeaveRequest = (request: LeaveRequest): FormattedToTableRowLeaveRequest => {
  const status = leaveRequestStatuses[request.status]

  return {
    id: request.id,
    duration: formatDuration(request.duration),
    startDate: formatDate(request.startDate),
    endDate: formatDate(request.endDate),
    requestedOn: formatDateTime(request.createdAt),
    statusTag: `<strong class="govuk-tag ${status?.tagClass ?? ''}">${status?.text ?? request.status}</strong>`,
    viewLink: `<a href="/view-update-leave-request/${request.id}" class="govuk-link">View</a>`,
  }
}
