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

export class ShipbobReceivingPublicApiModelsV2InventoryQuantityViewModel {
    /**
    * ID of the inventory item
    */
    'inventoryId'?: number;
    /**
    * Sku of the inventory item
    */
    'sku'?: string | null;
    /**
    * Quantity of the inventory item submitted in the WRO
    */
    'expectedQuantity'?: number;
    /**
    * Quantity of the inventory item received by the warehouse
    */
    'receivedQuantity'?: number;
    /**
    * Quantity of the inventory item stowed by the warehouse
    */
    'stowedQuantity'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "inventoryId",
            "baseName": "inventory_id",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "sku",
            "baseName": "sku",
            "type": "string",
            "format": ""
        },
        {
            "name": "expectedQuantity",
            "baseName": "expected_quantity",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "receivedQuantity",
            "baseName": "received_quantity",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "stowedQuantity",
            "baseName": "stowed_quantity",
            "type": "number",
            "format": "int32"
        }    ];

    static getAttributeTypeMap() {
        return ShipbobReceivingPublicApiModelsV2InventoryQuantityViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
