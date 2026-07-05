import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import managerHubBlocks from './fields'

export default step({
  path: '/',
  title: 'Manager Hub',
  reachability: { entryWhen: true },
  onAccess: [
    access({
      effects: [AnnualLeaveEffects.loadNotifications()],
    }),
  ],
  blocks: managerHubBlocks,
})
