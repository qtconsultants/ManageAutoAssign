/* This file was auto-generated, do not manually edit. */
import Automate from '../Automate'
import { components } from '../AutomateTypes'
import { CommonParameters, CWAOptions } from '../AutomateAPI'
import { NoContentResponse, OctetStreamResponse, PDFResponse, HTMLResponse } from '../types'
type schemas = components['schemas']
type LabTechModelsCommand = schemas['LabTech.Models.Command']

/**
 * @internal
 */
export default class CommandsAPI extends Automate {
  constructor(props: CWAOptions) {
    super(props)
  }

  GetCommandList(params: CommonParameters = {}): Promise<LabTechModelsCommand[]> {
    return this.request({
      path: `/api/v1/Commands`,
      method: 'get',
      params,
    })
  }

  GetCommand(entityId: string, params: CommonParameters = {}): Promise<LabTechModelsCommand> {
    return this.request({
      path: `/api/v1/Commands/${entityId}`,
      method: 'get',
      params,
    })
  }
}