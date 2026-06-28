import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './effects/types'
import { sidebarStatsComponent } from './components/sidebarStats'
import { confirmModalComponent } from './components/confirmModal'
import loginJourney from './journeys/login'
import homeStep from './journeys/dashboard/steps/home/step'
import effectImplementations from './effects'

const annualLeaveRootJourney = journey({
  code: 'annual-leave',
  title: 'Annual Leave App',
  path: '/',
  view: { template: 'annual-leave/views/annual-leave-step' },
  steps: [homeStep],
  children: [loginJourney],
})

export default createForgePackage<AnnualLeaveDeps>({
  journey: annualLeaveRootJourney,
  components: [sidebarStatsComponent, confirmModalComponent],
  functions: {
    ...effectImplementations,
  },
})
