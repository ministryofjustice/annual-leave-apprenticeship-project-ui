import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import viewUpdateBlocks from './fields'
import { redirectToDashboardIfErrorLoadingUserRequests } from '../../../../guards'

export default step({
  path: '/view-update/:id',
  title: 'Request Details',
  reachability: { entryWhen: true },
  blocks: viewUpdateBlocks,
  onAccess: [
    redirectToDashboardIfErrorLoadingUserRequests(),
    access({
      effects: [AnnualLeaveEffects.loadRequest()],
    }),
  ],
})
