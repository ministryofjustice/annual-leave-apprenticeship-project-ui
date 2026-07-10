import { Condition, Data, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { AnnualLeaveEffects } from '../../../../effects'
import { annualLeaveUrls } from '../../../../constants'
import createRequestBlocks from './fields'
import { redirectToDashboardIfErrorLoadingBalance } from '../../../../guards'

export default step({
  path: '/create',
  title: 'Submit a new absence request',
  reachability: { entryWhen: true },
  view: {
    locals: {
      twoColumnLayout: { sidebarBlockIndex: 0 },
    },
  },
  blocks: createRequestBlocks,
  onAccess: [redirectToDashboardIfErrorLoadingBalance()],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [AnnualLeaveEffects.createRequest()],
        next: [
          redirect({
            when: Data('createRequestSuccess').match(Condition.IsRequired()),
            goto: annualLeaveUrls.dashboard,
          }),
        ],
      },
    }),
  ],
})
