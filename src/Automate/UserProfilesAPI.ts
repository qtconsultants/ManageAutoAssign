/* This file was auto-generated, do not manually edit. */
import Automate from '../Automate'
import { components } from '../AutomateTypes'
import { CommonParameters, CWAOptions } from '../AutomateAPI'
import { NoContentResponse, OctetStreamResponse, PDFResponse, HTMLResponse } from '../types'
type schemas = components['schemas']
type requestBodies = components['requestBodies']
/** {@link LabTechRepositoriesMySQLDomainModelsPresentationLayerUserProfile} */
export type LabTechRepositoriesMySQLDomainModelsPresentationLayerUserProfile =
  schemas['LabTech.Repositories.MySQL.Domain.Models.PresentationLayer.UserProfile']

/**
 * @module UserProfilesAPI
 */

/**
 * UserProfiles module
 * @public
 */
export class UserProfilesAPI extends Automate {
  constructor(props: CWAOptions) {
    super(props)
  }

  getUserProfile(): Promise<LabTechRepositoriesMySQLDomainModelsPresentationLayerUserProfile> {
    return this.request({
      path: `/api/v1/UserProfiles`,
      method: 'get',
    })
  }
}
