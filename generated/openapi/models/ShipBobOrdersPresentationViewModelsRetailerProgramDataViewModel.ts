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

import { ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel } from '../models/ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel';
import { HttpFile } from '../http/http';

/**
* Contains properties that needs to be used for fulfilling B2B/Dropship orders.
*/
export class ShipBobOrdersPresentationViewModelsRetailerProgramDataViewModel {
    /**
    * First initial documentation sent from buyer to seller with item(s) and quantities.
    */
    'purchaseOrderNumber'?: string;
    /**
    * Identifies retailer-merchant combination
    */
    'retailerProgramType'?: string;
    /**
    * Store Number
    */
    'markForStore'?: string | null;
    /**
    * Identifies a merchant\'s store department
    */
    'department'?: string | null;
    /**
    * Expected delivery date
    */
    'deliveryDate'?: Date | null;
    /**
    * Ship From - Certain retailers want to display the ship from address as their return facility, not Shipbob’s warehouse address        ///   Mark For Address - Final destination address
    */
    'addresses'?: Array<ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel> | null;
    /**
    * Customer Ticket Number
    */
    'customerTicketNumber'?: string | null;
    /**
    * The date the retailer has requested the order to ship by.
    */
    'shipByDate'?: Date | null;
    /**
    * The date the retailer does not want the order shipped by.
    */
    'doNotShipBeforeDate'?: Date | null;

    static readonly discriminator: string | undefined = undefined;

    static readonly mapping: {[index: string]: string} | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "purchaseOrderNumber",
            "baseName": "purchase_order_number",
            "type": "string",
            "format": ""
        },
        {
            "name": "retailerProgramType",
            "baseName": "retailer_program_type",
            "type": "string",
            "format": ""
        },
        {
            "name": "markForStore",
            "baseName": "mark_for_store",
            "type": "string",
            "format": ""
        },
        {
            "name": "department",
            "baseName": "department",
            "type": "string",
            "format": ""
        },
        {
            "name": "deliveryDate",
            "baseName": "delivery_date",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "addresses",
            "baseName": "addresses",
            "type": "Array<ShipBobOrdersPresentationViewModelsRetailerProgramDataAddressViewModel>",
            "format": ""
        },
        {
            "name": "customerTicketNumber",
            "baseName": "customer_ticket_number",
            "type": "string",
            "format": ""
        },
        {
            "name": "shipByDate",
            "baseName": "shipByDate",
            "type": "Date",
            "format": "date-time"
        },
        {
            "name": "doNotShipBeforeDate",
            "baseName": "doNotShipBeforeDate",
            "type": "Date",
            "format": "date-time"
        }    ];

    static getAttributeTypeMap() {
        return ShipBobOrdersPresentationViewModelsRetailerProgramDataViewModel.attributeTypeMap;
    }

    public constructor() {
    }
}
