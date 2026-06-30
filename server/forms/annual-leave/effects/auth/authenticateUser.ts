import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import logger from '../../../../logger'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const authenticateUser = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const email = context.getAnswer('email') as string
  const password = context.getAnswer('password') as string
  const session = context.getSession()

  try {
    session.user = await deps.annualLeaveApiClient.login(email, password)
    delete session.loginError
  } catch (error) {
    const fallbackError = 'Something went wrong while signing in. Please try again later'
    const message = error instanceof SanitisedError ? (error.data?.userMessage ?? fallbackError) : fallbackError

    logger.info({ email }, `Login failed: ${message}`)
    session.loginError = message
    context.setData('loginError', session.loginError)
  }
}

export default authenticateUser
