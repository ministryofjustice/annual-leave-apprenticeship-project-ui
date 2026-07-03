import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import managerHubBlocks from './fields'

export default step({
  path: '/',
  title: 'Manager Hub',
  reachability: { entryWhen: true },
  blocks: managerHubBlocks,
})
