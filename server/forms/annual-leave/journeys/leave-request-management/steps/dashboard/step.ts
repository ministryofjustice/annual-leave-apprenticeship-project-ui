import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import dashboardBlocks from './fields'

export const dashboardStep = step({
  path: '/dashboard',
  title: 'Dashboard',
  reachability: { entryWhen: true },
  blocks: dashboardBlocks,
})
