import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './types'
import authenticateUser from './auth/authenticateUser'
import loadLoginError from './auth/loadLoginError'
import loadUserFromSession from './auth/loadUserFromSession'
import loadRequests from './requests/loadRequests'
import loadRequest from './requests/loadRequest'
import loadBalance from './requests/loadBalance'

interface AnnualLeaveEffectShape {
  authenticateUser: () => EffectFunctionExpr
  loadLoginError: () => EffectFunctionExpr
  loadUserFromSession: () => EffectFunctionExpr
  loadRequests: () => EffectFunctionExpr
  loadRequest: () => EffectFunctionExpr
  loadBalance: () => EffectFunctionExpr
}

export const { effects: AnnualLeaveEffects, implementations: annualLeaveEffectImplementations } = defineEffectFunctions<
  AnnualLeaveEffectShape,
  AnnualLeaveDeps
>({
  authenticateUser,
  loadLoginError,
  loadUserFromSession,
  loadRequests,
  loadRequest,
  loadBalance,
})

export default annualLeaveEffectImplementations
