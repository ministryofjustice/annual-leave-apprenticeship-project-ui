import { step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { redirectToLoginIfUnauthenticated } from '../../../../guards'
import { annualEntitlement, greeting, welcomeMessage } from './fields'

export default step({
  path: '/home',
  title: 'Home',
  reachability: { entryWhen: true },
  blocks: [greeting, welcomeMessage, annualEntitlement],
  onAccess: [redirectToLoginIfUnauthenticated()],
})
