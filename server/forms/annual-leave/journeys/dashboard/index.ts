import { journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import homeStep from './steps/home/step'

const dashboardJourney = journey({
  code: 'dashboard',
  title: 'Dashboard',
  path: '/',
  steps: [homeStep],
})

export default dashboardJourney
