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

import { ShipBobOrdersPresentationModelsAddProductToOrderByProductIdModel } from '../models/ShipBobOrdersPresentationModelsAddProductToOrderByProductIdModel';
import { ShipBobOrdersPresentationModelsAddProductToOrderByReferenceIdModel } from '../models/ShipBobOrdersPresentationModelsAddProductToOrderByReferenceIdModel';
import { HttpFile } from '../http/http';

/**
 * @type ShipBobOrdersPresentationModelsCreateOrderModelProductsInner
 * Type
 * @export
 */
export type ShipBobOrdersPresentationModelsCreateOrderModelProductsInner = ShipBobOrdersPresentationModelsAddProductToOrderByProductIdModel | ShipBobOrdersPresentationModelsAddProductToOrderByReferenceIdModel;

/**
* @type ShipBobOrdersPresentationModelsCreateOrderModelProductsInnerClass
* @export
*/
export class ShipBobOrdersPresentationModelsCreateOrderModelProductsInnerClass {
    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;
}

