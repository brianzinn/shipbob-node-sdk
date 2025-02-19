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

import { ShipBobOrdersPresentationModelsEstimateProductInfoModel } from '../models/ShipBobOrdersPresentationModelsEstimateProductInfoModel';
import { ShipBobOrdersPresentationViewModelsEstimationAddressViewModel } from '../models/ShipBobOrdersPresentationViewModelsEstimationAddressViewModel';
import { HttpFile } from '../http/http';

export class ShipBobOrdersPresentationModelsEstimateFulfillmentRequestModel {
    /**
    * Array of strings specifying shipping methods for which to fetch estimates.    If this field is omitted we will return estimates for all shipping methods defined in ShipBob
    */
    'shippingMethods'?: Array<string> | null;
    'address': ShipBobOrdersPresentationViewModelsEstimationAddressViewModel;
    /**
    * Products to be included in the order. Each product must include one of reference_id or id
    */
    'products': Array<ShipBobOrdersPresentationModelsEstimateProductInfoModel>;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "shippingMethods",
            "baseName": "shipping_methods",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "address",
            "baseName": "address",
            "type": "ShipBobOrdersPresentationViewModelsEstimationAddressViewModel",
            "format": ""
        },
        {
            "name": "products",
            "baseName": "products",
            "type": "Array<ShipBobOrdersPresentationModelsEstimateProductInfoModel>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return ShipBobOrdersPresentationModelsEstimateFulfillmentRequestModel.attributeTypeMap;
    }

    public constructor() {
    }
}
