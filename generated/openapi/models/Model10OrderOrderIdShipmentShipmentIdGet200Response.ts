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

import { ShipBobOrdersPresentationViewModelsInternalShipmentViewModel } from '../models/ShipBobOrdersPresentationViewModelsInternalShipmentViewModel';
import { ShipBobOrdersPresentationViewModelsShipmentViewModel } from '../models/ShipBobOrdersPresentationViewModelsShipmentViewModel';
import { HttpFile } from '../http/http';

/**
* Information about a shipment
*/
/**
 * @type Model10OrderOrderIdShipmentShipmentIdGet200Response
 * Type
 * @export
 */
export type Model10OrderOrderIdShipmentShipmentIdGet200Response = ShipBobOrdersPresentationViewModelsInternalShipmentViewModel | ShipBobOrdersPresentationViewModelsShipmentViewModel;

/**
* @type Model10OrderOrderIdShipmentShipmentIdGet200ResponseClass
    * Information about a shipment
* @export
*/
export class Model10OrderOrderIdShipmentShipmentIdGet200ResponseClass {
    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;
}

