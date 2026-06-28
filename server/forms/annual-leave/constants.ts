import { StatusDetails } from './types'

const leaveRequestStatuses: Record<string, StatusDetails> = {
  PENDING: {
    text: 'Pending',
    tagClass: 'govuk-tag--yellow',
  },
  APPROVED: {
    text: 'Approved',
    tagClass: 'govuk-tag--green',
  },
  REJECTED: {
    text: 'Rejected',
    tagClass: 'govuk-tag--red',
  },
}

export default leaveRequestStatuses
