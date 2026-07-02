import { Condition, Data, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKDetails } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { SidebarStats } from './components/sidebarStats'

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

export const userSidebar = HtmlBlock({ content: [userSidebarStats, managerDetails] })
