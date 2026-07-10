import { LeaveRequest } from '../../../../interfaces/annualLeaveApi/shared'
import logger from '../../../../logger'
import {
  datesOverlap,
  extractErrorMessage,
  isoDateToLongDateWithWeekday,
  formatDuration,
  isPastDate,
  isValidIsoDate,
} from '../../helpers'
import type { AnnualLeaveDeps, AnnualLeaveEffectContext } from '../types'

const createRequest = (deps: AnnualLeaveDeps) => async (context: AnnualLeaveEffectContext) => {
  const session = context.getSession()

  if (!session.user) {
    context.setData('createRequestError', 'Something went wrong. Please try again')

    return
  }

  const startDate = context.getAnswer('startDate') as string
  const endDate = context.getAnswer('endDate') as string
  const isFirstDayHalfDay = ((context.getAnswer('isFirstDayHalfDay') as string[]) ?? []).includes('true')
  const isLastDayHalfDay = ((context.getAnswer('isLastDayHalfDay') as string[]) ?? []).includes('true')
  const creatorNote = (context.getAnswer('creatorNote') as string) || null

  // second layer of dates validation on top of (client-side validation):
  if (!isValidIsoDate(startDate) || !isValidIsoDate(endDate)) {
    context.setData('createRequestError', 'Enter valid dates for start and end date')

    return
  }

  if (isPastDate(startDate)) {
    context.setData('createRequestError', 'Start date must be today or in the future')

    return
  }

  if (isPastDate(endDate)) {
    context.setData('createRequestError', 'End date must be today or in the future')

    return
  }

  if (new Date(endDate) < new Date(startDate)) {
    context.setData('createRequestError', 'End date must be on or after the start date')

    return
  }

  const existingRequests = (context.getData('userLeaveRequests') ?? []) as LeaveRequest[]
  const activeRequests = existingRequests.filter(r => r.status === 'PENDING' || r.status === 'APPROVED')

  const overlapping = activeRequests.find(r =>
    datesOverlap(new Date(startDate), new Date(endDate), new Date(r.startDate), new Date(r.endDate)),
  )

  if (overlapping) {
    const status = overlapping.status.toLowerCase()
    const from = isoDateToLongDateWithWeekday(overlapping.startDate)
    const to = isoDateToLongDateWithWeekday(overlapping.endDate)

    context.setData('createRequestError', `This request overlaps with an existing ${status} request (${from} to ${to})`)

    return
  }

  try {
    const request = await deps.annualLeaveApiClient.createRequest(session.user.id, {
      startDate,
      endDate,
      isFirstDayHalfDay,
      isLastDayHalfDay,
      creatorNote,
    })

    const duration = formatDuration(request.duration)
    const formattedStart = isoDateToLongDateWithWeekday(request.startDate)
    const formattedEnd = isoDateToLongDateWithWeekday(request.endDate)

    session.createRequestSuccess = `Leave request for ${duration} (${formattedStart} to ${formattedEnd}) has been successfully submitted`
    context.setData('createRequestSuccess', session.createRequestSuccess)
  } catch (error) {
    const message = extractErrorMessage(error, 'Something went wrong while creating the request. Please try again')

    logger.error({ userId: session.user.id }, `Create request failed: ${message}`)
    context.setData('createRequestError', message)
  }
}

export default createRequest
