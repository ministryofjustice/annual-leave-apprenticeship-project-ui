import { journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import signInStep from './steps/sign-in/step'

const loginJourney = journey({
  code: 'login',
  title: 'Sign in',
  path: '/login',
  steps: [signInStep],
})

export default loginJourney
