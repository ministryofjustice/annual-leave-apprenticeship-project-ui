import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import { Forge } from '@ministryofjustice/hmpps-forge/core'
import { ExpressFrameworkAdapter } from '@ministryofjustice/hmpps-forge/express-nunjucks'
import { govukComponents } from '@ministryofjustice/hmpps-forge/govuk-components'
import { mojComponents } from '@ministryofjustice/hmpps-forge/moj-components'
import annualLeavePackage from '../forms/annual-leave'
import nunjucksSetup from '../utils/nunjucksSetup'
import errorHandler from '../errorHandler'
import type { Services } from '../services'
import AuditService from '../services/auditService'
import { HmppsUser } from '../interfaces/hmppsUser'
import setUpWebSession from '../middleware/setUpWebSession'
import HmppsAuditClient from '../data/hmppsAuditClient'
import AnnualLeaveApiClient from '../data/annualLeaveApiClient'

jest.mock('../services/auditService')
jest.mock('../data/annualLeaveApiClient')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(services: Services, production: boolean): Express {
  const app = express()

  app.set('view engine', 'njk')

  const nunjucksEnv = nunjucksSetup(app)

  const forge = new Forge({
    frameworkAdapter: ExpressFrameworkAdapter.configure({ nunjucksEnv }),
  })
  forge.registerGlobalComponents(govukComponents)
  forge.registerGlobalComponents(mojComponents)
  forge.registerPackage(annualLeavePackage, {
    auditService: services.auditService,
    annualLeaveApiClient: services.annualLeaveApiClient,
  })

  app.use(setUpWebSession())
  app.use((req, res, next) => {
    res.locals = {
      cspNonce: '',
      csrfToken: '',
      asset_path: '',
      applicationName: '',
      environmentName: '',
      environmentNameColour: '',
    }
    next()
  })
  app.use((req, _res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(forge.getRouter() as express.Router)
  app.use((_req, _res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService({} as HmppsAuditClient) as jest.Mocked<AuditService>,
    annualLeaveApiClient: new AnnualLeaveApiClient() as jest.Mocked<AnnualLeaveApiClient>,
  },
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
}): Express {
  return appSetup(services as Services, production)
}
