import { access, step, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import dashboardBlocks from './fields'
import { AnnualLeaveEffects } from '../../../../effects'
import { hasDataLoadError } from '../../../../guards'

export const dashboardStep = step({
  path: '/dashboard',
  title: 'Dashboard',
  reachability: { entryWhen: true },
  view: {
    locals: {
      twoColumnLayout: when(hasDataLoadError).then('').else({ sidebarBlockIndex: 0 }),
    },
  },
  onAccess: [
    access({
      effects: [AnnualLeaveEffects.loadNotifications()],
    }),
  ],
  blocks: dashboardBlocks,
})
