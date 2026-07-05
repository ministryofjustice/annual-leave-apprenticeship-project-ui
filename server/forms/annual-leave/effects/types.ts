import type { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core/authoring'
import type { Session } from 'express-session'
import type AuditService from '../../../services/auditService'
import type AnnualLeaveApiClient from '../../../data/annualLeaveApiClient'
import { LoginRes } from '../../../interfaces/annualLeaveApi/response'

export interface AnnualLeaveDeps {
  auditService: AuditService
  annualLeaveApiClient: AnnualLeaveApiClient
}

export interface AnnualLeaveSession extends Session {
  user?: LoginRes
  loginError?: string
  deleteRequestSuccess?: string
  deleteRequestError?: string
  createRequestSuccess?: string
  createRequestError?: string
  decisionSuccess?: string
  decisionError?: string
}

export type AnnualLeaveData = Record<string, unknown>

export interface AnnualLeaveAnswers extends Record<string, unknown> {
  email: string
  password: string
  startDate: string
  endDate: string
  isFirstDayHalfDay: string[]
  isLastDayHalfDay: string[]
  creatorNote: string
  decision: string
  approverNote: string
}

export type AnnualLeaveRequestState = Record<string, unknown>

export type AnnualLeaveEffectContext = EffectFunctionContext<
  AnnualLeaveData,
  AnnualLeaveAnswers,
  AnnualLeaveSession,
  AnnualLeaveRequestState
>
