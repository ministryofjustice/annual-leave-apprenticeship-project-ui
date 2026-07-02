import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './types'
import authenticateUser from './auth/authenticateUser'
import loadLoginError from './auth/loadLoginError'
import loadUserFromSession from './auth/loadUserFromSession'
import loadRequests from './requests/loadRequests'
import loadRequest from './requests/loadRequest'
import loadBalance from './requests/loadBalance'
import deleteRequest from './requests/deleteRequest'
import loadDeleteNotification from './requests/loadDeleteNotification'
import createRequest from './requests/createRequest'
import loadCreateNotification from './requests/loadCreateNotification'

interface AnnualLeaveEffectShape {
  authenticateUser: () => EffectFunctionExpr
  loadLoginError: () => EffectFunctionExpr
  loadUserFromSession: () => EffectFunctionExpr
  loadRequests: () => EffectFunctionExpr
  loadRequest: () => EffectFunctionExpr
  loadBalance: () => EffectFunctionExpr
  deleteRequest: () => EffectFunctionExpr
  loadDeleteNotification: () => EffectFunctionExpr
  createRequest: () => EffectFunctionExpr
  loadCreateNotification: () => EffectFunctionExpr
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
  deleteRequest,
  loadDeleteNotification,
  createRequest,
  loadCreateNotification,
})

export default annualLeaveEffectImplementations
