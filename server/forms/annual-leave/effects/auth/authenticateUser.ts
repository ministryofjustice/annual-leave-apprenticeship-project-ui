import logger from '../../../../logger'
import { extractErrorMessage } from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const authenticateUser = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const email = context.getAnswer('email') as string
  const password = context.getAnswer('password') as string
  const session = context.getSession()

  try {
    session.user = await deps.annualLeaveApiClient.login({ email, password })
    delete session.loginError
  } catch (error) {
    const message = extractErrorMessage(error, 'Something went wrong while signing in. Please try again later')

    logger.info({ email }, `Login failed: ${message}`)
    session.loginError = message
    context.setData('loginError', session.loginError)
  }
}

export default authenticateUser
