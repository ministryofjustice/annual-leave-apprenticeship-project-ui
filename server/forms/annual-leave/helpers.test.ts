import {
  datesOverlap,
  escapeHtml,
  formatDate,
  formatDateWithWeekday,
  formatDateTime,
  formatDuration,
  formatLeaveRequestToTableRowSections,
  formatRequestDetails,
  getOnLeaveStatus,
  isPastDate,
  isValidIsoDate,
} from './helpers'
import { annualLeaveUrls, leaveRequestStatuses } from './constants'
import { AssignedLeaveRequestItem } from '../../interfaces/annualLeaveApi/response'
import { LeaveRequest } from '../../interfaces/annualLeaveApi/shared'

describe('helpers', () => {
  const baseRequest: LeaveRequest = {
    id: 'req-1',
    createdAt: '2026-06-01T10:00:00Z',
    decisionAt: null,
    creatorId: 'user-123',
    approverId: 'manager-456',
    startDate: '2026-07-01',
    endDate: '2026-07-05',
    duration: 5,
    isFirstDayHalfDay: false,
    isLastDayHalfDay: false,
    status: 'PENDING',
    creatorNote: 'Holiday',
    approverNote: null,
  }

  describe('escapeHtml()', () => {
    it('should escape ampersands', () => {
      expect(escapeHtml('Tom & Jerry')).toBe('Tom &amp; Jerry')
    })

    it('should escape angle brackets', () => {
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should escape double quotes', () => {
      expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;')
    })

    it('should escape single quotes', () => {
      expect(escapeHtml("it's")).toBe('it&#39;s')
    })

    it('should return unchanged string when no special characters', () => {
      expect(escapeHtml('plain text')).toBe('plain text')
    })

    it('should handle empty string', () => {
      expect(escapeHtml('')).toBe('')
    })
  })

  describe('formatDate()', () => {
    it('should format ISO date string to readable date', () => {
      expect(formatDate('2026-07-01')).toBe('1 July 2026')
    })

    it('should format full ISO datetime string to date only', () => {
      expect(formatDate('2026-12-25T10:00:00Z')).toBe('25 December 2026')
    })
  })

  describe('formatDateWithWeekday()', () => {
    it('should format ISO date string with day of the week', () => {
      expect(formatDateWithWeekday('2026-07-01')).toBe('Wednesday, 1 July 2026')
    })

    it('should format full ISO datetime string with day of the week', () => {
      expect(formatDateWithWeekday('2026-12-25T10:00:00Z')).toBe('Friday, 25 December 2026')
    })
  })

  describe('formatDateTime()', () => {
    it('should format ISO datetime to readable date and time (24-hour format)', () => {
      expect(formatDateTime('2026-06-01T10:30:00Z')).toMatch(/1 June 2026 at \d{2}:\d{2}/)
    })
  })

  describe('formatDuration()', () => {
    it('should return "Half day" when duration is 0.5', () => {
      expect(formatDuration(0.5)).toBe('Half day')
    })

    it('should return singular when duration is 1', () => {
      expect(formatDuration(1)).toBe('1 day')
    })

    it('should return plural when duration is greater than 1', () => {
      expect(formatDuration(5)).toBe('5 days')
    })
  })

  describe('formatLeaveRequestToTableRowSections()', () => {
    it('should format all fields correctly', () => {
      const result = formatLeaveRequestToTableRowSections(baseRequest)

      expect(result.id).toBe('req-1')
      expect(result.duration).toBe('5 days')
      expect(result.startDate).toBe('1 July 2026')
      expect(result.endDate).toBe('5 July 2026')
      expect(result.requestedOn).toMatch(/1 June 2026 at \d{2}:\d{2}/)
    })

    it('should render status tag with correct GOV.UK class for PENDING', () => {
      const result = formatLeaveRequestToTableRowSections(baseRequest)

      expect(result.statusTag).toBe(
        `<strong class="govuk-tag ${leaveRequestStatuses.PENDING.tagClass}">${leaveRequestStatuses.PENDING.text}</strong>`,
      )
    })

    it('should render status tag with correct GOV.UK class for APPROVED', () => {
      const result = formatLeaveRequestToTableRowSections({ ...baseRequest, status: 'APPROVED' })

      expect(result.statusTag).toBe(
        `<strong class="govuk-tag ${leaveRequestStatuses.APPROVED.tagClass}">${leaveRequestStatuses.APPROVED.text}</strong>`,
      )
    })

    it('should render status tag with correct GOV.UK class for REJECTED', () => {
      const result = formatLeaveRequestToTableRowSections({ ...baseRequest, status: 'REJECTED' })

      expect(result.statusTag).toBe(
        `<strong class="govuk-tag ${leaveRequestStatuses.REJECTED.tagClass}">${leaveRequestStatuses.REJECTED.text}</strong>`,
      )
    })

    it('should render view link with request id', () => {
      const result = formatLeaveRequestToTableRowSections(baseRequest)

      expect(result.viewLink).toBe(
        `<a href="${annualLeaveUrls.viewUpdateUserRequest}/req-1" class="govuk-link">View</a>`,
      )
    })

    it('should not include creatorName for regular leave request', () => {
      const result = formatLeaveRequestToTableRowSections(baseRequest)

      expect(result.creatorName).toBeUndefined()
    })

    it('should include escaped creatorName for assigned request', () => {
      const assignedRequest: AssignedLeaveRequestItem = { ...baseRequest, creatorName: 'Alice Smith' }
      const result = formatLeaveRequestToTableRowSections(assignedRequest)

      expect(result.creatorName).toBe('Alice Smith')
    })

    it('should escape HTML in creatorName for assigned request', () => {
      const assignedRequest: AssignedLeaveRequestItem = { ...baseRequest, creatorName: '<script>alert("xss")</script>' }
      const result = formatLeaveRequestToTableRowSections(assignedRequest)

      expect(result.creatorName).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should render view link to manager hub for assigned request', () => {
      const assignedRequest: AssignedLeaveRequestItem = { ...baseRequest, creatorName: 'Alice Smith' }
      const result = formatLeaveRequestToTableRowSections(assignedRequest)

      expect(result.viewLink).toBe(
        `<a href="${annualLeaveUrls.viewAssignedRequest}/req-1" class="govuk-link">View/Update</a>`,
      )
    })
  })

  describe('isValidIsoDate()', () => {
    it('should return true for valid ISO date string', () => {
      expect(isValidIsoDate('2026-07-14')).toBe(true)
    })

    it('should return true for ISO datetime string', () => {
      expect(isValidIsoDate('2026-07-14T10:00:00Z')).toBe(true)
    })

    it('should return false for invalid date string', () => {
      expect(isValidIsoDate('not-a-date')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidIsoDate('')).toBe(false)
    })
  })

  describe('isPastDate()', () => {
    it('should return true for a date in the past', () => {
      expect(isPastDate('2020-01-01')).toBe(true)
    })

    it('should return false for a date in the future', () => {
      expect(isPastDate('2099-12-31')).toBe(false)
    })

    it('should return false for today', () => {
      const today = new Date()
      const isoToday = today.toISOString().split('T')[0]

      expect(isPastDate(isoToday)).toBe(false)
    })
  })

  describe('datesOverlap()', () => {
    it('should return true when ranges fully overlap', () => {
      expect(
        datesOverlap(new Date('2026-07-01'), new Date('2026-07-10'), new Date('2026-07-05'), new Date('2026-07-15')),
      ).toBe(true)
    })

    it('should return true when one range contains the other', () => {
      expect(
        datesOverlap(new Date('2026-07-01'), new Date('2026-07-20'), new Date('2026-07-05'), new Date('2026-07-10')),
      ).toBe(true)
    })

    it('should return true when ranges share a single day', () => {
      expect(
        datesOverlap(new Date('2026-07-01'), new Date('2026-07-05'), new Date('2026-07-05'), new Date('2026-07-10')),
      ).toBe(true)
    })

    it('should return false when ranges do not overlap', () => {
      expect(
        datesOverlap(new Date('2026-07-01'), new Date('2026-07-04'), new Date('2026-07-05'), new Date('2026-07-10')),
      ).toBe(false)
    })

    it('should return true when ranges are identical', () => {
      expect(
        datesOverlap(new Date('2026-07-01'), new Date('2026-07-05'), new Date('2026-07-01'), new Date('2026-07-05')),
      ).toBe(true)
    })
  })

  describe('getOnLeaveStatus()', () => {
    const todayStr = new Date().toISOString().split('T')[0]

    const createApprovedRequest = (overrides: Partial<LeaveRequest> = {}): LeaveRequest => ({
      ...baseRequest,
      status: 'APPROVED',
      ...overrides,
    })

    it('should return undefined when no approved requests', () => {
      expect(getOnLeaveStatus([])).toBeUndefined()
    })

    it('should return undefined when today is outside all request ranges', () => {
      const request = createApprovedRequest({ startDate: '2020-01-01', endDate: '2020-01-10' })

      expect(getOnLeaveStatus([request])).toBeUndefined()
    })

    it('should return "ON LEAVE" when today is within an approved request range', () => {
      const request = createApprovedRequest({ startDate: '2020-01-01', endDate: todayStr })

      expect(getOnLeaveStatus([request])).toBe('ON LEAVE')
    })

    it('should return "ON LEAVE (Half day)" when today is the start date and isFirstDayHalfDay is true', () => {
      const request = createApprovedRequest({ startDate: todayStr, endDate: todayStr, isFirstDayHalfDay: true })

      expect(getOnLeaveStatus([request])).toBe('ON LEAVE (Half day)')
    })

    it('should return "ON LEAVE (Half day)" when today is the end date and isLastDayHalfDay is true', () => {
      const request = createApprovedRequest({ startDate: '2020-01-01', endDate: todayStr, isLastDayHalfDay: true })

      expect(getOnLeaveStatus([request])).toBe('ON LEAVE (Half day)')
    })

    it('should return "ON LEAVE" when today is the start date but isFirstDayHalfDay is false', () => {
      const request = createApprovedRequest({ startDate: todayStr, endDate: todayStr, isFirstDayHalfDay: false })

      expect(getOnLeaveStatus([request])).toBe('ON LEAVE')
    })

    it('should return "ON LEAVE" when today is mid-range even with half day flags', () => {
      const request = createApprovedRequest({
        startDate: '2020-01-01',
        endDate: todayStr,
        isFirstDayHalfDay: true,
        isLastDayHalfDay: false,
      })

      expect(getOnLeaveStatus([request])).toBe('ON LEAVE')
    })
  })

  describe('formatRequestDetails()', () => {
    it('should format start and end dates with weekday', () => {
      const result = formatRequestDetails(baseRequest)

      expect(result.startDate).toBe('Wednesday, 1 July 2026')
      expect(result.endDate).toBe('Sunday, 5 July 2026')
    })

    it('should format duration', () => {
      const result = formatRequestDetails(baseRequest)

      expect(result.duration).toBe('5 days')
    })

    it('should include half day flags', () => {
      const result = formatRequestDetails({ ...baseRequest, isFirstDayHalfDay: true, isLastDayHalfDay: true })

      expect(result.isFirstDayHalfDay).toBe(true)
      expect(result.isLastDayHalfDay).toBe(true)
    })

    it('should format status text from constants', () => {
      const result = formatRequestDetails(baseRequest)

      expect(result.statusText).toBe(leaveRequestStatuses.PENDING.text)
      expect(result.statusTagClass).toBe(leaveRequestStatuses.PENDING.tagClass)
    })

    it('should format decision date when present', () => {
      const result = formatRequestDetails({ ...baseRequest, decisionAt: '2026-06-15T14:00:00Z' })

      expect(result.decisionAt).toMatch(/15 June 2026 at \d{2}:\d{2}/)
      expect(result.decisionAtRaw).toBe('2026-06-15T14:00:00Z')
    })

    it('should return empty string for decision date when null', () => {
      const result = formatRequestDetails(baseRequest)

      expect(result.decisionAt).toBe('')
      expect(result.decisionAtRaw).toBe('')
    })

    it('should include creatorName for assigned request', () => {
      const assignedRequest: AssignedLeaveRequestItem = { ...baseRequest, creatorName: 'Alice Smith' }
      const result = formatRequestDetails(assignedRequest)

      expect(result.creatorName).toBe('Alice Smith')
    })

    it('should escape HTML in creatorName for assigned request', () => {
      const assignedRequest: AssignedLeaveRequestItem = { ...baseRequest, creatorName: '<script>alert("xss")</script>' }
      const result = formatRequestDetails(assignedRequest)

      expect(result.creatorName).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should not include creatorName for regular request', () => {
      const result = formatRequestDetails(baseRequest)

      expect(result.creatorName).toBeUndefined()
    })
  })
})
