import { LeaveRequest } from '../../../interfaces/annualLeaveApi/shared'
import leaveRequestStatusTagColour from '../constants'

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatDuration = (duration: number): string => {
  return duration === 1 ? '1 day' : `${duration} days`
}

const toUserLeaveRequestTableRow = (request: LeaveRequest) => {
  const tagClass = leaveRequestStatusTagColour[request.status] ?? ''
  const statusLabel = request.status.charAt(0) + request.status.slice(1).toLowerCase()

  return [
    { text: formatDuration(request.duration) },
    { text: formatDate(request.startDate) },
    { text: formatDate(request.endDate) },
    { text: formatDate(request.createdAt) },
    { html: `<strong class="govuk-tag ${tagClass}">${statusLabel}</strong>` },
  ]
}

export default toUserLeaveRequestTableRow
