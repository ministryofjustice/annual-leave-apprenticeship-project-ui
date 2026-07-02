import {
  escapeHtml,
  formatDate,
  formatDateWithWeekday,
  formatDateTime,
  formatDuration,
  formatLeaveRequestToTableRowSections,
} from './helpers'
import { annualLeaveUrls, leaveRequestStatuses } from './constants'
import { LeaveRequest } from '../../interfaces/annualLeaveApi/shared'

describe('helpers', () => {
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
  })
})
