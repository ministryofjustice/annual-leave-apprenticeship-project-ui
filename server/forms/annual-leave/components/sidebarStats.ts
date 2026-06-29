import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  buildComponent,
  type BasicBlockProps,
  type BlockDefinition,
  type ResolvableString,
  type ResolvableArray,
} from '@ministryofjustice/hmpps-forge/core/components'

interface SidebarStatsEntry {
  label: ResolvableString
  value: ResolvableString
  total?: ResolvableString
  style?: ResolvableString
}

export interface SidebarStatsProps extends BasicBlockProps {
  heading: ResolvableString
  entries: ResolvableArray<SidebarStatsEntry>
}

export interface SidebarStats extends BlockDefinition, SidebarStatsProps {
  variant: 'sidebarStats'
}

export const SidebarStats = (props: SidebarStatsProps): SidebarStats => {
  return blockBuilder<SidebarStats>({ ...props, variant: 'sidebarStats' })
}

export const sidebarStatsComponent = buildComponent<SidebarStats>('sidebarStats', block => {
  const entries = (block.entries as SidebarStatsEntry[])
    .map(entry => {
      const style = entry.style ? ` dashboard-stats__card--${entry.style}` : ''
      const totalHtml = entry.total ? `<span class="govuk-body">/${entry.total}</span>` : ''

      return `
      <div class="dashboard-stats__card${style}">
        <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">${entry.value}${totalHtml}</span>
        <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">${entry.label}</span>
      </div>`
    })
    .join('')

  return `
    <div class="dashboard-stats govuk-!-padding-bottom-5">
      <div class="dashboard-stats__card">
        <span class="govuk-heading-l govuk-!-margin-bottom-0">${block.heading}</span>
      </div>
      ${entries}
    </div>`
})
