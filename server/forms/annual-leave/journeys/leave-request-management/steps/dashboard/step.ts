import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import { redirectToLoginIfUnauthenticated } from '../../../../guards'
import dashboardBlocks from './fields'

export default step({
  path: '/dashboard',
  title: 'Dashboard',
  reachability: { entryWhen: true },
  blocks: dashboardBlocks,
  onAccess: [
    redirectToLoginIfUnauthenticated(),
    access({
      effects: [AnnualLeaveEffects.loadRequests(), AnnualLeaveEffects.loadBalance()],
    }),
  ],
})
