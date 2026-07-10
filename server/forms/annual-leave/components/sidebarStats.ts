import { block as blockBuilder } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  buildComponent,
  type BasicBlockProps,
  type BlockDefinition,
  type ResolvableString,
  type ResolvableArray,
} from '@ministryofjustice/hmpps-forge/core/components'
import { escapeHtml } from '../helpers'

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
  const heading = escapeHtml(String(block.heading))
  const entries = (block.entries as SidebarStatsEntry[])
    .map(entry => {
      const label = escapeHtml(String(entry.label))
      const value = escapeHtml(String(entry.value))
      const style = entry.style ? ` dashboard-stats__card--${escapeHtml(String(entry.style))}` : ''
      const totalHtml = entry.total ? `<span class="govuk-body">/${escapeHtml(String(entry.total))}</span>` : ''

      return `
      <div class="dashboard-stats__card${style}">
        <span class="dashboard-stats__number govuk-heading-l govuk-!-margin-bottom-0">${value}${totalHtml}</span>
        <span class="dashboard-stats__label govuk-body govuk-!-margin-bottom-0">${label}</span>
      </div>`
    })
    .join('')

  return `
    <div class="dashboard-stats govuk-!-padding-bottom-5">
      <div class="dashboard-stats__card">
        <span class="govuk-heading-l govuk-!-margin-bottom-0">${heading}</span>
      </div>
      ${entries}
    </div>`
})
