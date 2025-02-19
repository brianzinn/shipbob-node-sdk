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

import { ShipbobOrdersCommonShipmentAction } from '../models/ShipbobOrdersCommonShipmentAction';
import { HttpFile } from '../http/http';

/**
* 
*/
export class ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel {
    'action'?: ShipbobOrdersCommonShipmentAction;
    /**
    * The ID of the shipment
    */
    'shipmentId'?: number;
    /**
    * If the cancel action was successful
    */
    'isSuccess'?: boolean;
    /**
    * The reason the cancellation result
    */
    'reason'?: string | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "action",
            "baseName": "action",
            "type": "ShipbobOrdersCommonShipmentAction",
            "format": ""
        },
        {
            "name": "shipmentId",
            "baseName": "shipment_id",
            "type": "number",
            "format": "int64"
        },
        {
            "name": "isSuccess",
            "baseName": "is_success",
            "type": "boolean",
            "format": ""
        },
        {
            "name": "reason",
            "baseName": "reason",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ShipBobOrdersPresentationViewModelsCanceledShipmentViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}


