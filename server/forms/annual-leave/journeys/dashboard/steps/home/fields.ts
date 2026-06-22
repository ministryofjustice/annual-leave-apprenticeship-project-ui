import { Data, Format } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKBody, GovUKHeading } from '@ministryofjustice/hmpps-forge/govuk-components'

export const greeting = GovUKHeading({
  text: Format('Hello, %1', Data('userFirstName')),
  size: 'l',
})

export const annualEntitlement = HtmlBlock({
  content: Format(
    `<div class="numeric-data">
    <span class="numeric-data__item govuk-heading-xl govuk-!-margin-bottom-0">%1</span>
    <p class="numeric-data__item govuk-body">days is your entitlement</p>
</div>`,
    Data('annualEntitlement'),
  ),
})
export const welcomeMessage = GovUKBody({
  text: 'Welcome to the Annual Leave App.',
})
