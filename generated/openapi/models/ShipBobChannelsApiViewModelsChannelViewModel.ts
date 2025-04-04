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

export class ShipBobChannelsApiViewModelsChannelViewModel {
    /**
    * Unique id of the channel
    */
    'id'?: number;
    /**
    * Name of the channel
    */
    'name'?: string | null;
    /**
    * Name of the application that owns the channel
    */
    'applicationName'?: string | null;
    /**
    * Array of permissions granted for the channel
    */
    'scopes'?: Array<string> | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "id",
            "baseName": "id",
            "type": "number",
            "format": "int32"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string",
            "format": ""
        },
        {
            "name": "applicationName",
            "baseName": "application_name",
            "type": "string",
            "format": ""
        },
        {
            "name": "scopes",
            "baseName": "scopes",
            "type": "Array<string>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ShipBobChannelsApiViewModelsChannelViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
