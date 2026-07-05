import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { AnnualLeaveDeps } from './types'
import authenticateUser from './auth/authenticateUser'
import loadLoginError from './auth/loadLoginError'
import loadUserFromSession from './auth/loadUserFromSession'
import loadRequests from './requests/loadRequests'
import loadRequest from './requests/loadRequest'
import loadBalance from './requests/loadBalance'
import deleteRequest from './requests/deleteRequest'
import createRequest from './requests/createRequest'
import decideRequest from './requests/decideRequest'
import loadNotifications from './requests/loadNotifications'

interface AnnualLeaveEffectShape {
  authenticateUser: () => EffectFunctionExpr
  loadLoginError: () => EffectFunctionExpr
  loadUserFromSession: () => EffectFunctionExpr
  loadRequests: () => EffectFunctionExpr
  loadRequest: () => EffectFunctionExpr
  loadBalance: () => EffectFunctionExpr
  deleteRequest: () => EffectFunctionExpr
  createRequest: () => EffectFunctionExpr
  decideRequest: () => EffectFunctionExpr
  loadNotifications: () => EffectFunctionExpr
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
  createRequest,
  decideRequest,
  loadNotifications,
})

export default annualLeaveEffectImplementations
