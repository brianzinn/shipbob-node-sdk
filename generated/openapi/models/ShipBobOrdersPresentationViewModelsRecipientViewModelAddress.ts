/**
 * ShipBob Developer API
 * ShipBob Developer API Documentation
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { ShipBobOrdersPresentationViewModelsAddressViewModel } from '../models/ShipBobOrdersPresentationViewModelsAddressViewModel';
import { ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel } from '../models/ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel';
import { HttpFile } from '../http/http';

/**
* Address of the recipient
*/
/**
 * @type ShipBobOrdersPresentationViewModelsRecipientViewModelAddress
 * Type
 * @export
 */
export type ShipBobOrdersPresentationViewModelsRecipientViewModelAddress = ShipBobOrdersPresentationViewModelsAddressViewModel | ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel;

/**
* @type ShipBobOrdersPresentationViewModelsRecipientViewModelAddressClass
    * Address of the recipient
* @export
*/
export class ShipBobOrdersPresentationViewModelsRecipientViewModelAddressClass {
    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;
}

