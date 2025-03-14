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

export class ShipBobOrdersPresentationViewModelsAddressViewModel {
    /**
    * First line of the address
    */
    'address1': string;
    /**
    * Second line of the address
    */
    'address2'?: string | null;
    /**
    * Name of the company receiving the shipment
    */
    'companyName'?: string | null;
    /**
    * The city
    */
    'city': string;
    /**
    * The state or province
    */
    'state'?: string | null;
    /**
    * The country (Must be ISO Alpha-2 for estimates)
    */
    'country': string;
    /**
    * The zip code or postal code
    */
    'zipCode'?: string | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "address1",
            "baseName": "address1",
            "type": "string",
            "format": ""
        },
        {
            "name": "address2",
            "baseName": "address2",
            "type": "string",
            "format": ""
        },
        {
            "name": "companyName",
            "baseName": "company_name",
            "type": "string",
            "format": ""
        },
        {
            "name": "city",
            "baseName": "city",
            "type": "string",
            "format": ""
        },
        {
            "name": "state",
            "baseName": "state",
            "type": "string",
            "format": ""
        },
        {
            "name": "country",
            "baseName": "country",
            "type": "string",
            "format": ""
        },
        {
            "name": "zipCode",
            "baseName": "zip_code",
            "type": "string",
            "format": "postal-code"
        }    ];

    static getAttributeTypeMap() {
        return ShipBobOrdersPresentationViewModelsAddressViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
