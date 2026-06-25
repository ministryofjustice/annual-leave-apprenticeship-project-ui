import { Condition, Data, Format } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKGridRow,
  GovUKHeading,
  GovUKLinkButton,
  GovUKTable,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'

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

const sidebarStats = HtmlBlock({
  content: Format(
    `<div class="dashboard-stats">
  <div class="dashboard-stats__card">
    <span class="govuk-heading-l govuk-!-margin-bottom-0">DAYS</span>
  </div>
  <div class="dashboard-stats__card dashboard-stats__card--blue">
    <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">%1<span class="govuk-body">/%5</span></span>
    <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">Balance</span>
  </div>
  <div class="dashboard-stats__card dashboard-stats__card--green">
    <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">%2<span class="govuk-body">/%5</span></span>
    <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">Available</span>
  </div>
  <div class="dashboard-stats__card dashboard-stats__card--yellow">
    <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">%3<span class="govuk-body">/%5</span></span>
    <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">Pending</span>
  </div>
  <div class="dashboard-stats__card dashboard-stats__card--grey">
    <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">%4<span class="govuk-body">/%5</span></span>
    <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">Used</span>
  </div>
</div>`,
    Data('actualBalance'),
    Data('availableBalance'),
    Data('pendingDays'),
    Data('approvedDays'),
    Data('annualEntitlement'),
  ),
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
