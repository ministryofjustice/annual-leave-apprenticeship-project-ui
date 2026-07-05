import { access, Condition, Data, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import { annualLeaveUrls } from '../../../../constants'
import viewUpdateBlocks from './fields'

export default step({
  path: '/view-update/:id',
  title: 'Assigned Request Details',
  reachability: { entryWhen: true },
  blocks: viewUpdateBlocks,
  onAccess: [
    access({
      effects: [AnnualLeaveEffects.loadRequest()],
    }),
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [AnnualLeaveEffects.decideRequest()],
        next: [
          redirect({
            when: Data('decisionSuccess').match(Condition.IsRequired()),
            goto: annualLeaveUrls.managerHub,
          }),
        ],
      },
    }),
  ],
})
