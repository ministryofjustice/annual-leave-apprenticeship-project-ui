import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import viewUpdateBlocks from './fields'
import {
  redirectToDashboardIfErrorLoadingBalance,
  redirectToDashboardIfErrorLoadingUserRequests,
} from '../../../../guards'

export default step({
  path: '/view-update/:id',
  title: 'Request Details',
  reachability: { entryWhen: true },
  view: {
    locals: {
      twoColumnLayout: { sidebarBlockIndex: 0 },
    },
  },
  blocks: viewUpdateBlocks,
  onAccess: [
    redirectToDashboardIfErrorLoadingUserRequests(),
    redirectToDashboardIfErrorLoadingBalance(),
    access({
      effects: [AnnualLeaveEffects.loadRequest()],
    }),
  ],
})
