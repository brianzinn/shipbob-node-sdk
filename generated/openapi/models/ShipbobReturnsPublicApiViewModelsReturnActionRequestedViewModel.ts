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

import { ShipbobReturnsPublicCommonReturnAction } from '../models/ShipbobReturnsPublicCommonReturnAction';
import { ShipbobReturnsPublicCommonReturnActionSource } from '../models/ShipbobReturnsPublicCommonReturnActionSource';
import { HttpFile } from '../http/http';

export class ShipbobReturnsPublicApiViewModelsReturnActionRequestedViewModel {
    'action'?: ShipbobReturnsPublicCommonReturnAction;
    'actionType'?: ShipbobReturnsPublicCommonReturnActionSource;
    /**
    * Specific instructions to be taken for the inventory when processing the return
    */
    'instructions'?: string | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "action",
            "baseName": "action",
            "type": "ShipbobReturnsPublicCommonReturnAction",
            "format": ""
        },
        {
            "name": "actionType",
            "baseName": "action_type",
            "type": "ShipbobReturnsPublicCommonReturnActionSource",
            "format": ""
        },
        {
            "name": "instructions",
            "baseName": "instructions",
            "type": "string",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ShipbobReturnsPublicApiViewModelsReturnActionRequestedViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}


