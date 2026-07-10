import { access, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import { annualLeaveUrls } from '../../../../constants'

export default step({
  path: '/delete/:id',
  title: 'Delete Request',
  reachability: { entryWhen: true },
  blocks: [],
  onAccess: [
    access({
      effects: [AnnualLeaveEffects.deleteRequest()],
      next: [redirect({ goto: annualLeaveUrls.dashboard })],
    }),
  ],
})
