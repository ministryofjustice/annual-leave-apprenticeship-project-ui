import { StatusDetails } from './types'

export const leaveRequestStatuses: Record<string, StatusDetails> = {
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

export const annualLeaveUrls = {
  login: '/login',
  dashboard: `/requests/dashboard`,
  viewUpdateUserRequest: `/requests/view-update`, // has '/id' at the end (leave request UUID)
  deleteUserRequest: `/requests/delete`, // has '/id' at the end (leave request UUID)
  createRequest: `/requests/create`,
  managerHub: `/manager-hub`,
  viewAssignedRequest: `/manager-hub/view-update`, // has '/id' at the end (leave request UUID)
}
