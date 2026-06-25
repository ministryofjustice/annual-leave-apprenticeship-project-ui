import { Condition, Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKGridRow,
  GovUKHeading,
  GovUKLinkButton,
  GovUKTable,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { SidebarStats } from '../../../../components/sidebarStats'

const pageHeading = GovUKHeading({
  text: 'Dashboard',
  size: 'xl',
  visibleWhen: Data('isManager').not.match(Condition.Equals(true)),
})

const pageHeadingWithActionHub = HtmlBlock({
  content: `
    <div class="moj-page-header-actions">
      <div class="moj-page-header-actions__title">
        <h1 class="govuk-heading-xl">Dashboard</h1>
      </div>
      <div class="moj-page-header-actions__actions">
        <div class="moj-button-group moj-button-group--inline">
          <a href="/manager-hub" role="button" draggable="false" class="govuk-button govuk-button--secondary" data-module="govuk-button">Manager hub</a>
        </div>
      </div>
    </div>`,
  visibleWhen: Data('isManager').match(Condition.Equals(true)),
})

const submitButton = GovUKLinkButton({
  text: '+ Submit a new leave request',
  href: '/submit-new-request',
  classes: 'govuk-button--primary',
})

const sidebarStats = SidebarStats({
  heading: 'DAYS',
  entries: [
    { label: 'Balance', value: Data('actualBalance'), total: Data('annualEntitlement'), style: 'blue' },
    { label: 'Available', value: Data('availableBalance'), total: Data('annualEntitlement'), style: 'green' },
    { label: 'Pending', value: Data('pendingDays'), total: Data('annualEntitlement'), style: 'yellow' },
    { label: 'Used', value: Data('approvedDays'), total: Data('annualEntitlement'), style: 'grey' },
  ],
})

const activeRequestsTable = GovUKTable({
  head: [
    { text: 'Duration' },
    { text: 'Start date' },
    { text: 'End date' },
    { text: 'Requested on' },
    { text: 'Status' },
  ],
  rows: Data('activeRequestRows'),
})

const historyTable = GovUKTable({
  head: [
    { text: 'Duration' },
    { text: 'Start date' },
    { text: 'End date' },
    { text: 'Requested on' },
    { text: 'Status' },
  ],
  rows: Data('historyRequestRows'),
})

const requestsTabs = GovUKTabs({
  id: 'requests',
  items: [
    {
      id: 'active-requests',
      label: 'Active requests',
      panel: { blocks: [activeRequestsTable] },
    },
    {
      id: 'history',
      label: 'History',
      panel: { blocks: [historyTable] },
    },
  ],
})

const dashboardPage = GovUKGridRow({
  columns: [
    {
      width: 'one-quarter',
      blocks: [sidebarStats],
    },
    {
      width: 'three-quarters',
      blocks: [pageHeading, pageHeadingWithActionHub, submitButton, requestsTabs],
    },
  ],
})

export default dashboardPage
