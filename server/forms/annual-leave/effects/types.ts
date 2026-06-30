import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { Session } from 'express-session'
import type AuditService from '../../../services/auditService'
import type AnnualLeaveApiClient from '../../../data/annualLeaveApiClient'
import { LoginResponse } from '../../../interfaces/annualLeaveApi/response'

export interface AnnualLeaveDeps {
  auditService: AuditService
  annualLeaveApiClient: AnnualLeaveApiClient
}

export interface AnnualLeaveSession extends Session {
  user?: LoginResponse
  loginError?: string
  deleteRequestSuccess?: string
  deleteRequestError?: string
}

export type AnnualLeaveData = Record<string, unknown>

export interface AnnualLeaveAnswers extends Record<string, unknown> {
  email: string
  password: string
}

export type AnnualLeaveRequestState = Record<string, unknown>

export type AnnualLeaveEffectContext = EffectFunctionContext<
  AnnualLeaveData,
  AnnualLeaveAnswers,
  AnnualLeaveSession,
  AnnualLeaveRequestState
>
