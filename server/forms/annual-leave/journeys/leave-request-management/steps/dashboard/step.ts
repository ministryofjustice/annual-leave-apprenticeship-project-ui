import { access, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import dashboardBlocks from './fields'
import { AnnualLeaveEffects } from '../../../../effects'

export const dashboardStep = step({
  path: '/dashboard',
  title: 'Dashboard',
  reachability: { entryWhen: true },
  view: {
    locals: {
      twoColumnLayout: { sidebarBlockIndex: 0 },
    },
  },
  onAccess: [
    access({
      effects: [AnnualLeaveEffects.loadDeleteNotification(), AnnualLeaveEffects.loadCreateNotification()],
    }),
  ],
  blocks: dashboardBlocks,
})
