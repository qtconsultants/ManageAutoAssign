/* This file was auto-generated, do not manually edit. */
import Automate from '../Automate'
import { components } from '../AutomateTypes'
import { CommonParameters, CWAOptions } from '../AutomateAPI'
import { NoContentResponse, OctetStreamResponse, PDFResponse, HTMLResponse } from '../types'
type schemas = components['schemas']
type requestBodies = components['requestBodies']
export type AutomateApiDomainContractsMaintenanceMaintenanceWindowDefinition =
  schemas['Automate.Api.Domain.Contracts.Maintenance.MaintenanceWindowDefinition']

/**
 * @public
 */
export default class MaintenanceWindowDefinitionsAPI extends Automate {
  constructor(props: CWAOptions) {
    super(props)
  }

  getDefinitionList(
    params: CommonParameters = {},
  ): Promise<Array<AutomateApiDomainContractsMaintenanceMaintenanceWindowDefinition>> {
    return this.request({
      path: `/api/v1/MaintenanceWindowDefinitions`,
      method: 'get',
      params,
    })
  }
}
