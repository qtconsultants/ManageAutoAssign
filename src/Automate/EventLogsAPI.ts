/* This file was auto-generated, do not manually edit. */
import Automate from '../Automate'
import { components } from '../AutomateTypes'
import { CommonParameters, CWAOptions } from '../AutomateAPI'
import { NoContentResponse, OctetStreamResponse, PDFResponse, HTMLResponse } from '../types'
type schemas = components['schemas']
type requestBodies = components['requestBodies']
/** {@link LabTechModelsEventLog} */
export type LabTechModelsEventLog = schemas['LabTech.Models.EventLog']

/**
 * @module EventLogsAPI
 */

/**
 * EventLogs module
 * @public
 */
export class EventLogsAPI extends Automate {
  constructor(props: CWAOptions) {
    super(props)
  }

  getEventLogsAsync(params: CommonParameters = {}): Promise<Array<LabTechModelsEventLog>> {
    return this.request({
      path: `/api/v1/EventLogs`,
      method: 'get',
      params,
    })
  }
}
