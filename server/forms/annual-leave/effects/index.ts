import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './types'
import authenticateUser from './auth/authenticateUser'
import loadLoginError from './auth/loadLoginError'
import loadUserFromSession from './auth/loadUserFromSession'

interface AnnualLeaveEffectShape {
  authenticateUser: () => EffectFunctionExpr
  loadLoginError: () => EffectFunctionExpr
  loadUserFromSession: () => EffectFunctionExpr
}

export const { effects: AnnualLeaveEffects, implementations: annualLeaveEffectImplementations } = defineEffectFunctions<
  AnnualLeaveEffectShape,
  AnnualLeaveDeps
>({
  authenticateUser,
  loadLoginError,
  loadUserFromSession,
})

export default annualLeaveEffectImplementations
