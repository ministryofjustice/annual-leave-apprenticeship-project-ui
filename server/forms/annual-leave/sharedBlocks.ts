import {
  Condition,
  Conditional,
  Data,
  Format,
  Item,
  Iterator,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKDetails,
  GovUKHeading,
  GovUKLinkButton,
  GovUKSummaryList,
  GovUKTable,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock, type ResolvableBoolean } from '@ministryofjustice/hmpps-forge/core/components'
import { SidebarStats } from './components/sidebarStats'
import { request } from './guards'

const managerDetails = GovUKDetails({
  summaryText: 'Your manager details',
  text: when(Data('managerName').match(Condition.IsRequired()))
    .then(Data('managerName'))
    .else("You haven't been assigned a manager"),
})

const userSidebarStats = SidebarStats({
  heading: 'DAYS',
  entries: [
    { label: 'Balance', value: Data('actualBalance'), total: Data('annualEntitlement'), style: 'blue' },
    { label: 'Available', value: Data('availableBalance'), total: Data('annualEntitlement'), style: 'green' },
    { label: 'Pending', value: Data('pendingDays'), style: 'yellow' },
    { label: 'Approved', value: Data('approvedDays'), style: 'grey' },
  ],
})

export const createUserSidebar = () => HtmlBlock({ content: [userSidebarStats, managerDetails] })

interface ErrorPageOptions {
  heading: string
  body: string[]
  backHref: string
  backText: string
  visibleWhen: ResolvableBoolean
}

export const createErrorPage = ({ heading, body, backHref, backText, visibleWhen: showWhen }: ErrorPageOptions) => {
  const errorPage = HtmlBlock({
    content: [
      GovUKHeading({ text: heading, size: 'xl' }),
      ...body.map(text => GovUKBody({ text })),
      GovUKLinkButton({ text: backText, href: backHref, classes: 'govuk-button--secondary' }),
    ],
  })
  errorPage.visibleWhen = showWhen

  return errorPage
}

export const noRequestsMessage = (hasDataKey: string, label: string) =>
  GovUKBody({
    text: `There are no ${label} requests.`,
    visibleWhen: Data(hasDataKey).not.match(Condition.Equals(true)),
  })

const baseColumns = [
  { text: Item().path('duration') },
  { text: Item().path('startDate') },
  { text: Item().path('endDate') },
  { text: Item().path('requestedOn') },
  { html: Item().path('statusTag') },
  { html: Item().path('viewLink') },
]

const baseHeaders = [
  { text: 'Duration' },
  { text: 'Start date' },
  { text: 'End date' },
  { text: 'Requested on' },
  { text: 'Status' },
  { text: 'Action' },
]

export const createRequestsTable = (dataKey: string, hasDataKey: string, includeCreatorName = false) =>
  GovUKTable({
    head: includeCreatorName ? [{ text: 'Name' }, ...baseHeaders] : baseHeaders,
    rows: Data(dataKey).each(
      Iterator.Map(includeCreatorName ? [{ text: Item().path('creatorName') }, ...baseColumns] : baseColumns),
    ),
    visibleWhen: Data(hasDataKey).match(Condition.Equals(true)),
  })

export const requestDurationSummaryList = GovUKSummaryList({
  classes: 'govuk-summary-list--no-border',
  rows: [
    {
      key: { text: 'Start date:' },
      value: {
        text: Conditional({
          when: request.path('isFirstDayHalfDay').match(Condition.Equals(true)),
          then: Format('%1 (half day)', request.path('startDate')),
          else: request.path('startDate'),
        }),
      },
    },
    {
      key: { text: 'End date:' },
      value: {
        text: Conditional({
          when: request.path('isLastDayHalfDay').match(Condition.Equals(true)),
          then: Format('%1 (half day)', request.path('endDate')),
          else: request.path('endDate'),
        }),
      },
    },
    {
      key: { text: 'Duration:' },
      value: { text: request.path('duration') },
    },
  ],
})
