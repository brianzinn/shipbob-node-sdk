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

export class ShipbobReturnsPublicApiViewModelsLotInformationViewModel {
    'lotNumber'?: string | null;
    'expirationDate'?: Date;
    'quantityProcessed'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "lotNumber",
            "baseName": "lot_number",
            "type": "string",
            "format": ""
        },
        {
            "name": "expirationDate",
            "baseName": "expiration_date",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "quantityProcessed",
            "baseName": "quantity_processed",
            "type": "number",
            "format": "int32"
        }    ];

    static getAttributeTypeMap() {
        return ShipbobReturnsPublicApiViewModelsLotInformationViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
