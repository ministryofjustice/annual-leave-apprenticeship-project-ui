import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './effects/types'
import { sidebarStatsComponent } from './components/sidebarStats'
import { confirmModalComponent } from './components/confirmModal'
import loginJourney from './journeys/login'
import { leaveRequestManagementJourney } from './journeys/leave-request-management'
import effectImplementations from './effects'

const annualLeaveRootJourney = journey({
  code: 'annual-leave',
  title: 'Annual Leave App',
  path: '/',
  view: {
    template: 'annual-leave/views/annual-leave-step',
    locals: {
      hmppsHeaderServiceNameLink: '/requests/dashboard',
    },
  },
  children: [loginJourney, leaveRequestManagementJourney],
})

export default createForgePackage<AnnualLeaveDeps>({
  journey: annualLeaveRootJourney,
  components: [sidebarStatsComponent, confirmModalComponent],
  functions: {
    ...effectImplementations,
  },
})
