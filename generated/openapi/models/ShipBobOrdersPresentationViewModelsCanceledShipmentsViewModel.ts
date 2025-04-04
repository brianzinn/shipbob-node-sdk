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

import { ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel } from '../models/ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel';
import { HttpFile } from '../http/http';

/**
* 
*/
export class ShipBobOrdersPresentationViewModelsCanceledShipmentsViewModel {
    /**
    * The results of all cancellation actions
    */
    'results'?: Array<ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel> | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "results",
            "baseName": "results",
            "type": "Array<ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ShipBobOrdersPresentationViewModelsCanceledShipmentsViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
