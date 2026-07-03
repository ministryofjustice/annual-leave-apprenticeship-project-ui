import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../effects'
import { redirectToLoginIfUnauthenticated } from '../../guards'
import managerHubDashboardStep from './steps/dashboard/step'

export const managerHubJourney = journey({
  code: 'manager-hub',
  title: 'Manager Hub',
  path: '/manager-hub',
  steps: [managerHubDashboardStep],
  onAccess: [
    redirectToLoginIfUnauthenticated(),
    access({
      effects: [AnnualLeaveEffects.loadRequests(), AnnualLeaveEffects.loadBalance()],
    }),
  ],
})
