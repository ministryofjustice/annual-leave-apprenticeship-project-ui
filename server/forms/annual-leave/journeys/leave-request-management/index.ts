import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../effects'
import { redirectToLoginIfUnauthenticated } from '../../guards'
import { dashboardStep } from './steps/dashboard/step'
import viewUpdateLeaveRequestStep from './steps/view-update/step'
import deleteLeaveRequestStep from './steps/delete/step'

export const leaveRequestManagementJourney = journey({
  code: 'leave-request-management',
  title: 'Leave request management',
  path: '/requests',
  steps: [dashboardStep, viewUpdateLeaveRequestStep, deleteLeaveRequestStep],
  onAccess: [
    redirectToLoginIfUnauthenticated(),
    access({
      effects: [
        AnnualLeaveEffects.loadRequests(),
        AnnualLeaveEffects.loadBalance(),
        AnnualLeaveEffects.loadDeleteNotification(),
      ],
    }),
  ],
})
