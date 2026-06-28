import { Condition, Data, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKDetails, GovUKGridRow } from '@ministryofjustice/hmpps-forge/govuk-components'
import type { BlockDefinition } from '@ministryofjustice/hmpps-forge/core/components'
import { SidebarStats } from './components/sidebarStats'

const managerDetails = GovUKDetails({
  summaryText: 'Your manager details',
  text: when(Data('managerName').match(Condition.IsRequired()))
    .then(Data('managerName'))
    .else("You haven't been assigned a manager"),
})

const sidebarStats = SidebarStats({
  heading: 'DAYS',
  entries: [
    { label: 'Balance', value: Data('actualBalance'), total: Data('annualEntitlement'), style: 'blue' },
    { label: 'Available', value: Data('availableBalance'), total: Data('annualEntitlement'), style: 'green' },
    { label: 'Pending', value: Data('pendingDays'), style: 'yellow' },
    { label: 'Approved', value: Data('approvedDays'), style: 'grey' },
  ],
})

const sidebarBlocks = [managerDetails, sidebarStats]

export const sidebarLayout = (mainBlocks: BlockDefinition[]) =>
  GovUKGridRow({
    columns: [
      { width: 'one-quarter', blocks: sidebarBlocks },
      { width: 'three-quarters', blocks: mainBlocks },
    ],
  })

export const fullWidthLayout = (mainBlocks: BlockDefinition[]) =>
  GovUKGridRow({
    columns: [{ width: 'full', blocks: mainBlocks }],
  })
