import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../effects'
import { redirectToLoginIfUnauthenticated } from '../../guards'
import { dashboardStep } from './steps/dashboard/step'
import viewUpdateLeaveRequestStep from './steps/view-update-leave-request/step'

export const leaveRequestManagementJourney = journey({
  code: 'leave-request-management',
  title: 'Leave request management',
  path: '/requests',
  steps: [dashboardStep, viewUpdateLeaveRequestStep],
  onAccess: [
    redirectToLoginIfUnauthenticated(),
    access({
      effects: [AnnualLeaveEffects.loadRequests(), AnnualLeaveEffects.loadBalance()],
    }),
  ],
})
