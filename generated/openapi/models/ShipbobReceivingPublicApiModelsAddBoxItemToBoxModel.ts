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

import { HttpFile } from '../http/http';

/**
* Information about an inventory item contained inside a receiving order box
*/
export class ShipbobReceivingPublicApiModelsAddBoxItemToBoxModel {
    /**
    * Quantity of the items in the box
    */
    'quantity': number;
    /**
    * Unique inventory id of the items in the box
    */
    'inventoryId': number;
    /**
    * Lot number of the items in the box
    */
    'lotNumber'?: string | null;
    /**
    * Lot expiration date for the items in the box
    */
    'lotDate'?: Date | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "quantity",
            "baseName": "quantity",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "inventoryId",
            "baseName": "inventory_id",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "lotNumber",
            "baseName": "lot_number",
            "type": "string",
            "format": ""
        },
        {
            "name": "lotDate",
            "baseName": "lot_date",
            "type": "Date",
            "format": "date-time"
        }    ];

    static getAttributeTypeMap() {
        return ShipbobReceivingPublicApiModelsAddBoxItemToBoxModel.attributeTypeMap;
    }

    public constructor() {
    }
}
