import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../effects'
import { redirectToLoginIfUnauthenticated } from '../../guards'
import { dashboardStep } from './steps/dashboard/step'
import viewUpdateLeaveRequestStep from './steps/view-update/step'
import deleteLeaveRequestStep from './steps/delete/step'
import createLeaveRequestStep from './steps/create/steps'

export const leaveRequestManagementJourney = journey({
  code: 'leave-request-management',
  title: 'Leave request management',
  path: '/requests',
  steps: [dashboardStep, viewUpdateLeaveRequestStep, deleteLeaveRequestStep, createLeaveRequestStep],
  onAccess: [
    redirectToLoginIfUnauthenticated(),
    access({
      effects: [AnnualLeaveEffects.loadRequests(), AnnualLeaveEffects.loadBalance()],
    }),
  ],
})
