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
* The product to create
*/
export class ShipbobProductsApiModelsPublicCreateProductModel {
    /**
    * Unique reference identifier for the product. Any linked or generated inventory will also be uniquely identified by this value
    */
    'referenceId': string;
    /**
    * Stock keeping unit for the product
    */
    'sku'?: string | null;
    /**
    * The name of the product
    */
    'name': string;
    /**
    * Barcode for the product
    */
    'barcode'?: string | null;
    /**
    * Global Trade Item Number - unique and internationally recognized identifier assigned to item by company GS1.
    */
    'gtin'?: string | null;
    /**
    * Universal Product Code - Unique external identifier
    */
    'upc'?: string | null;
    /**
    * The price of one unit
    */
    'unitPrice'?: number | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "referenceId",
            "baseName": "reference_id",
            "type": "string",
            "format": ""
        },
        {
            "name": "sku",
            "baseName": "sku",
            "type": "string",
            "format": ""
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "barcode",
            "baseName": "barcode",
            "type": "string",
            "format": ""
        },
        {
            "name": "gtin",
            "baseName": "gtin",
            "type": "string",
            "format": ""
        },
        {
            "name": "upc",
            "baseName": "upc",
            "type": "string",
            "format": ""
        },
        {
            "name": "unitPrice",
            "baseName": "unit_price",
            "type": "number",
            "format": "double"
        }    ];

    static getAttributeTypeMap() {
        return ShipbobProductsApiModelsPublicCreateProductModel.attributeTypeMap;
    }

    public constructor() {
    }
}
