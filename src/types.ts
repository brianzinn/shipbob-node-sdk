/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { Nullable } from '.';

export type ChannelsResponse = {
  id: number;
  name: string;
  application_name: string;
  scopes: string[];
}[];

export type Address = {
  /**
   * First line of the address
   */
  address1: string;
  /**
   * Second line of the address
   */
  address2?: Nullable<string>;
  /**
   * Name of the company receiving the shipment
   */
  company_name?: Nullable<string>;
  /**
   * The city
   */
  city: Required<string>;
  /**
   * The state or province
   * Not required, but not all countries have state/province
   */
  state: Nullable<string>;
  /**
   * The country (Must be ISO Alpha-2 for estimates)
   */
  country: string;
  /**
   * The zip code or postal code
   */
  zip_code: string;
};

/**
 * Returns also everything else including onhand, etc.  Stuff that makes no sense at this point.
 */
export type AddProductResponse = {
  id: number;
  reference_id: string;
};

export type GetProducts1_0QueryString = Partial<{
  ReferenceIds: string;
  Page: number;
  Limit: number;
  IDs: string; // csv
  Search: string;
  ActiveStatus: 'Any' | 'Active' | 'Inactive';
  BundleStatus: 'Any' | 'Bundle' | 'NotBundle';
}>;

/**
 * This is missing practically all fields of actual result.
 */
export type GetProduct1_0Result = {
  id: number;
  reference_id: string;
};

export type ActionName = 'Dispose' | 'Restock' | 'Quarantine';
export type ProductType = 'Regular' | 'Bundle';

export type GetProduct2_0Variant = {
  /**
   * The expected barcode to be found on the item and checked during the pick process
   */
  barcode: string;
  barcode_sticker_url: Nullable<string>;
  channel_metadata: unknown[];
  reviews_pending: unknown[];
  associated_bundles: unknown[];
  bundle_definition: unknown[];
  created_on: string;
  customs: {
    /**
     * The customs code (6 digit)
     */
    hs_tariff_code: string;
    /**
     * 2 character country code
     */
    country_code_of_origin: string;
    /**
     * Value of object for customs (in USD)
     */
    value: Nullable<string>;
    currency: 'USD';
    /**
     * Description of product for customs purposes
     */
    description: string;
    is321_eligible: boolean;
  };
  dimension: {
    length: number;
    width: number;
    height: number;
    /**
     * "inch"
     */
    unit: string;
    is_locked: boolean;
    /**
     * ie: "UserEntry"
     */
    source: string;
  };
  fulfillment_settings: {
    /**
     * If the product requires a prop65 label in the box
     */
    requires_prop65: false;
    serial_scan: {
      /**
       * Indicates if a Serial Scan is required during the pack process.
       * Note: Serial scan requires either a prefix or a suffix to be defined
       */
      is_enabled: false;
      /**
       * The prefix expected on the serial number
       */
      prefix: string;
      /**
       * The suffix expected on the serial number
       */
      suffix: string;
      /**
       * The exact number of characters expected in the serial number
       */
      exact_character_length: Nullable<number>;
    };
    /**
     * If the product needs to classified as a hazmat product with the shipping carrier
     */
    dangerous_goods: false;
    /**
     * URL of the Safety Data Sheet for this product.
     * Note: should be populated by ShipBob system via the UI, should not reference a URL outside of the ShipBob domain
     */
    msds_url: string;
    /**
     * If the product should be picked as an entire case
     */
    is_case_pick: boolean;
    /**
     * Is Bound Printed Matter, must be set by the ShipBob internal team
     */
    is_bpm_parcel: boolean;
  };
  /**
   * Global Trade Item Number
   */
  gtin: string;
  /**
   * Variant Id (used to alter product lot, packaging, etc.)
   */
  id: number;
  inventory: {
    inventory_id: number;
    on_hand_qty: number;
  };
  is_digital: boolean;
  lot_information: {
    /**
     * If the product should use lot date based picking
     */
    is_lot: boolean;
    minimum_shelf_life_days: Nullable<number>;
  };
  /**
   * Name of the Variant (should match the Product name if a non-varying product)
   */
  name: string;
  /**
   * PDf has wrong field: The specific material to package the product in (box, poly mailer, bubble mailer, etc_
   */
  packaging_material_type: {
    id: number;
    /**
     * Not sure what else can be here
     */
    name: 'Box';
  };
  /**
   * PDF has wrong field. int The id of the packaging_requirement (No requirement, fragile, ship in own container, etc)
   */
  packaging_requirement: {
    id: number;
    name: 'NoRequirements' | 'Fragile'; // ??
  };
  return_preferences: {
    /**
     * Restock (1) Quarantine (2) Dispose (3)
     */
    primary_action: Nullable<{
      id: number;
      name: ActionName;
    }>;
    /**
     * Restock (1) Quarantine (2) Dispose (3)
     */
    backup_action: Nullable<{
      id: number;
      name: ActionName;
    }>;
    /**
     * Instructions for inspecting returns
     */
    instructions: Nullable<string>;
    return_to_sender_primary_action: Nullable<{
      id: number;
      name: ActionName;
    }>;
    return_to_sender_backup_action: Nullable<{
      id: number;
      name: ActionName;
    }>;
  };
  /**
   * The SKU of the product. This is a required field and must be unique.
   */
  sku: string;
  /**
   * PDF is incorrect - it describes in int.  Active (1) or Inactive (2)
   */
  status: 'Active' | 'Inactive';
  /**
   * Universal Product Code
   */
  upc: string;
  is_image_uploaded: false;
  updated_on: string;
  weight: {
    weight: number;
    /**
     * ie: "oz"
     */
    unit: string;
  };
  additional_hazmat_attributes: Nullable<unknown>;
  merge_children: [];
};

/**
 * This is just some guessing based on found responses
 */
export type GetProduct2_0Response = {
  /**
   * Product Id
   */
  id: number;
  /**
   * Product Name
   */
  name: string;
  type: ProductType;
  category: Nullable<unknown>;
  sub_category: Nullable<unknown>;
  user_id: number;
  created_on: string;
  updated_on: string;
  /**
   * null | ?
   */
  taxonomy: null;
  variants: GetProduct2_0Variant[];
};

export type GetProductExperimentalVariant = Omit<GetProduct2_0Variant, 'barcode'> & {
  barcodes: {
    value: string;
    sticker_url: Nullable<string>;
  }[];
};

/**
 * Just the barcode -> barcodes on the variant seems like the only difference so far.
 */
export type GetProductExperimentalResponse = Omit<GetProduct2_0Response, 'variants'> & {
  variants: GetProductExperimentalVariant[];
};

export type OrderType = 'DTC' | 'DropShip' | 'B2B' | 'Transportation';

export type AnyProduct =
  | ({
      /**
       * Unique reference id of the product
       */
      reference_id: string;
      /**
       * Name of the product. Required if there is not an existing ShipBob product with a matching reference_id value.
       */
      name?: Nullable<string>;
      /**
       * Global Trade Item Number - unique and internationally recognized identifier assigned to item by company GS1 (0-50 chars)
       */
      gtin?: Nullable<string>;
      /**
       * Universal Product Code - Unique external identifier
       */
      upc?: Nullable<string>;
      /**
       * Price for one item
       */
      unit_price?: Nullable<number>;
      /**
       * Product SKU
       */
      sku?: Nullable<string>;
    } & {
      /**
       * Unique Id of the product.  Not sure who would track **their** product ids..
       */
      id: number;
    })
  | {
      /**
       * Numeric assignment per item. Used as a reference number for multiple purposes such as split orders, split containers, etc.
       */
      external_line_id?: number;

      /**
       * The quantity of this product ordered
       * (< 2147483647 LOL)
       */
      quantity: number;
      /**
       * Defined standard for measure for an item (each, inner pack, case, pallet). Values: EA, INP, CS and PL
       */
      quantity_unit_of_measure_code?: Nullable<string>;

      required_lot?: {
        lot_number: Nullable<string>;
        /**
         * string or null <date-time>
         * Manually specified lot date
         */
        lot_date: Nullable<string>;
      };
    };

export type CancelOrderResponse = {
  order_id: number;
  order: {
    id: number;
    reference_id: string;
    order_number: string;
    status: string;
  };
  /**
   * ie: "Success"
   */
  status: string;
  canceled_shipment_results: {
    /**
     * ie: "Cancel".  The docs are wrong.  This is actually a number like 6.
     */
    action: number;
    shipment_id: number;
    is_success: boolean;
    /**
     * ie: "Order cancelled"
     */
    reason: string;
  }[];
};

/**
 * ShipBob.Orders.StatusResolver.OrderStatus
 */
export type OrderStatusType =
  | 'Processing'
  | 'Exception'
  | 'PartiallyFulfilled'
  | 'Fulfilled'
  | 'Cancelled'
  | 'ImportReview';
/**
 * Shipbob.CoreModels.OrderStateResolver.OrderStatusEnum
 */
export type ShipmentStatusType =
  | 'None'
  | 'Processing'
  | 'Completed'
  | 'Exception'
  | 'OnHold'
  | 'Cancelled'
  | 'CleanSweeped'
  | 'LabeledCreated'
  | 'ImportReview';

export type OrderShipment = {
  /**
   * The datetime of Shipment delivered to customer.
   *
   * set is order_delivered webhook.  ie: "2025-02-19T03:11:00+00:00"
   */
  delivery_date: Nullable<string>;
  /**
   * Unique id of the shipment
   */
  id: number;
  /**
   * Id of the order this shipment belongs to
   */
  order_id: number;
  /**
   * Client-defined external unique id of the order this shipment belongs to
   */
  reference_id: string;
  /**
   * Information about the recipient of a shipment
   */
  recipient: {
    name: string;
    address: Address;
    email: string;
    phone_number: string;
  };
  /**
   * OrderStateResolver.OrderStatusEnum
   */
  status: ShipmentStatusType;
  status_details: {
    /**
     * ie: "OutOfStock"
     */
    name: string;
    /**
     * ie: "No Stock On Hand For Sku"
     */
    description: string;
    id: number;
    inventory_id: number;
    exception_fulfillment_center_id: number;
    /**
     * Not sure what will be here - have only seen null
     */
    extra_information: null;
  }[];

  /**
   * Tracking information for a shipment (null on creation)
   */
  tracking: Nullable<
    {
      /**
       * Carrier of the shipment
       */
      carrier: Nullable<string>;
      /**
       * Tracking number of the shipment
       */
      tracking_number: Nullable<string>;
      /**
       * The carrier's service which was used for this shipment
       */
      carrier_service: Nullable<string>;
      /**
       * URL to the website where a shipment can be tracked
       */
      tracking_url: Nullable<string>;
      // bol
      // shipping_date
      // pro_number
      // scac
    }[]
  >;
  // below are from order shipped
  invoice_amount?: number;
  invoice_currency_code?: string;
  insurance_value?: Nullable<number>;
  /**
   * ie: "Ground"
   */
  ship_option?: string;
  /**
   * ie: "2024-04-09T06:59:59+00:00"
   */
  estimated_fulfillment_date?: string;
  /**
   * Is this when it was actually delivered?
   * "2024-04-08T11:17:07.122+00:00"
   */
  actual_fulfillment_date?: string;
  /**
   * ie: "FulfilledOnTime", "Unavailable"
   */
  estimated_fulfillment_date_status?: string;
  is_tracking_uploaded?: boolean;
};

export type Order = {
  /**
   * Unique id of the order
   */
  id: number;
  /**
   * Date this order was created
   *
   * ISO date.  ie: "2019-08-24T14:15:22Z"
   */
  created_date: string;
  /**
   * Date this order was purchase by the end user
   *
   * ISO date.  ie: "2019-08-24T14:15:22Z"
   */
  purchase_date: Nullable<string>;
  /**
   * Client-defined external unique id of the order
   */
  reference_id: string;
  /**
   * User friendly orderId or store order number that will be shown on the Orders Page. If not provided, referenceId will be used
   */
  order_number: string;
  /**
   * ie "Processing" when created. We should be able to get order status updates via webhook
   *
   * ShipBob.Orders.StatusResolver.OrderStatus
   * "Processing" "Exception" "PartiallyFulfilled" "Fulfilled" "Cancelled" "ImportReview"
   */
  status: OrderStatusType;
  /**
   * Shipbob.Orders.Common.OrderType
   */
  type: OrderType;
  /**
   * Created by channel metadata
   */
  channel: {
    id: number;
    /**
     * ie: "ShipBobs-Shopify-Store"
     */
    name: string;
  };
  /**
   * Client-defined shipping method
   *
   * ie: "Free 2-day Shipping"
   */
  shipping_method: string;
  /**
   * Information about the recipient of an order
   */
  recipient: {
    name: string;
    address: Address;
    email: string;
    phone_number: string;
  };
  /**
   * List of products included in the order
   *
   * ShipBob.Orders.Presentation.ViewModels.ProductInfoViewModel
   */
  products: {
    /**
     * Unique id of the product
     */
    id: number;
    /**
     * Unique reference id of the product
     */
    reference_id: string;
    /**
     * The quantity of this product ordered
     */
    quantity: number;
    /**
     * Defined standard for measure for an item (each, inner pack, case, pallet). Values: EA, INP, CS and PL
     */
    quantity_unit_of_measure_code: Nullable<string>;
    /**
     * Stock keeping unit for the product
     */
    sku: string;
    /**
     * Global Trade Item Number - unique and internationally recognized identifier assigned to item by company GS1
     */
    gtin: string;
    /**
     * Universal Product Code - Unique external identifier
     */
    upc: string;
    /**
     * Price for one item
     */
    unit_price: number;
    /**
     * Numeric assignment per item. Used as a reference number for multiple purposes such as split orders, split containers, etc.
     */
    external_line_id: number;
  }[];
  /**
   * Client-defined order tags
   */
  tags: Record<string, string>;
  /**
   * Shipments affiliated with the order
   * TODO: redo this as it's a union of 2 types.
   * - ShipBob.Orders.Presentation.ViewModels.ShipmentViewModel
   * - ShipBob.Orders.Presentation.ViewModels.InternalShipmentViewModel
   * probably good idea to use what is generated from the OpenAPI and reference here - the generated has lots of TS errors.
   */
  shipments: OrderShipment[];
  gift_message: string;
  shipping_terms: {
    /**
     * ie: "Parcel"
     */
    carrier_type: CarrierShipType;
    payment_term: PaymentShipTerm;
  };
  // unused
  // "retailer_program_data":
  // statusDetails...
  // unused
  // "financials":
};

export type PaymentShipTerm = 'Collect' | 'ThirdParty' | 'Prepaid' | 'MerchantResponsible';
export type CarrierShipType = 'Parcel' | 'Freight';

export type PlaceOrderRequest = {
  /**
   * User friendly orderId or store order number that will be shown on the Orders Page. If not provided, referenceId will be used (<= 400 characters)
   */
  order_number: Nullable<string>;

  recipient: {
    name: string;
    address: Address;
    /**
     * Email address of the recipient
     */
    email?: Nullable<string>;
    /**
     * Phone number of the recipient (<= 50 characters)
     */
    phone_number?: Nullable<string>;
  };
  /**
   * Products included in the order. Products identified by reference_id must also include the product name if there is no matching ShipBob product.
   */
  products: AnyProduct[];
  /**
   * Unique and immutable order identifier from your upstream system.
   *
   * Discussions with Simon. This is a forever unique identifier. ie: cannot be an IC order number like 18888888 - we could not reship.
   *
   * NOTE: reusing generates 422 error: "Cannot insert order with existing ReferenceId"
   */
  reference_id: string;
  /**
   * Contains properties that needs to be used for fulfilling B2B/Dropship orders.
   */
  retailer_program_data?: {
    /**
     * First initial documentation sent from buyer to seller with item(s) and quantities.
     */
    purchase_order_number: string;
    /**
     * Identifies retailer-merchant combination
     */
    retailer_program_type: string;
    /**
     * Store Number
     */
    mark_for_store?: Nullable<string>;
    /**
     * Identifies a merchant's store department
     */
    department?: Nullable<string>;
    /**
     * Expected delivery date
     */
    delivery_date?: Nullable<string>;
    /**
     * Customer Ticket Number
     */
    customer_ticket_number?: Nullable<string>;
    /**
     * The date the retailer has requested the order to ship by.
     */
    shipByDate?: Nullable<string>;
    /**
     * The date the retailer does not want the order shipped by.
     */
    doNotShipBeforeDate?: Nullable<string>;
  };
  /**
   * Client-defined shipping method matching what the user has listed as the shipping method on the Ship Option Mapping setup page in the ShipBob Merchant Portal.
   * If they don’t match, we will create a new one and default it to Standard
   * (non-empty)
   * ie: "Standard"
   */
  shipping_method: string;

  /**
   * Contains shipping properties that need to be used for fulfilling an order.
   */
  shipping_terms?: {
    /**
     * CarrierShipType:  Enum: "Parcel" "Freight"
     */
    carrier_type: CarrierShipType;
    /**
     * PaymentShipTerm
     */
    payment_term: PaymentShipTerm;
  };
  /**
   * Enum: "DTC" "DropShip" "B2B" "Transportation"
   */
  type: OrderType;
};

export type ShippingMethod = {
  /**
   * Unique id for shipping method
   */
  id: number;
  /**
   * Indicates if the shipping method is active
   */
  active: boolean;
  /**
   * Indicates the shipping method is a ShipBob default shipping method.
   */
  default: boolean;
  /**
   * Name of the ship method as selected by the merchant and saved in ShipBob’s database (i.e. “ground”).
   *
   * Corresponds to the shipping_method field in the Orders API.
   */
  name: string;
  /**
   * ShipBob.Orders.Presentation.ViewModels.ServiceLevelDetailViewModel)
   */
  service_level: {
    /**
     * Unique id for the service level
     */
    id: number;
    /**
     * The name or title of the service level
     */
    name: string;
  };
};

export type Webhook = {
  id: number;
  /**
   * ISO date format: "2025-02-14T22:21:33.4911731"
   */
  created_at: string;
  /**
   * The subscription topic for the webhook
   */
  topic: WebhookTopic;
  /**
   * This is what we provided to them.
   */
  subscription_url: string;
};

export type FulfillmentCenter = {
  id: number;
  /**
   * ie: "Cicero (IL)"
   */
  name: string;
  /**
   * ie: "Central Standard Time"
   */
  timezone: string;
  address1: string;
  address2: string;
  city: string;
  /**
   * ie: "IL"
   */
  state: string;
  /**
   * ie: "USA"
   */
  country: string;
  zip_code: string;
  phone_number: string;
  email: string;
};

export type PackageType = 'Package' | 'Pallet' | 'FloorLoadedContainer';
export type BoxPackagingType = 'EverythingInOneBox' | 'OneSkuPerBox' | 'MultipleSkuPerBox';

/**
 * The receiving order to create
 */
export type WarehouseReceivingOrderRequest = {
  /**
   * Model containing information that assigns a receiving order to a fulfillment center.
   * If the fulfillment center provided is in a receiving hub region, then the response will be the receiving hub location.
   */
  fulfillment_center: {
    /**
     * ID of the fulfillment center to assign this receiving order to
     */
    id: number;
  };
  package_type: PackageType;
  box_packaging_type: BoxPackagingType;
  /**
   * Box shipments to be added to this receiving order
   */
  boxes: {
    /**
     * Tracking number for the box shipment.
     *
     * The API docs say "string or null", but if you pass null will get a 400: Boxes[...] 'The TrackingNumber field is required.'
     */
    tracking_number: string;
    /**
     * Items contained in this box
     */
    box_items: {
      /**
       * Quantity of the items in the box
       *
       * NOTE: integer <int32> [ 1 .. 2147483647 ].  LOL.  2 billion
       */
      quantity: number;

      /**
       * Unique inventory id of the items in the box
       */
      inventory_id: number;
      /**
       * Lot number of the items in the box.  Must be supplied for products that have lot set, otherwise will be:
       * 422 status code "Wrong Lot Information Provided For Inventory IDs: 8619859,8619860, etc."
       */
      lot_number?: Nullable<string>;
      /**
       * Lot expiration date for the items in the box
       */
      lot_date?: Nullable<string>;
    }[];
  }[];
  /**
   * Expected arrival date of all the box shipments in this receiving order
   * ie: ISO date "2019-08-24T14:15:22Z"
   *
   * NOTE: Must be in the future or it will generate a 422 error.
   */
  expected_arrival_date: string;
  /**
   * Purchase order number for this receiving order,
   *
   * NOTE: Supporting idempotency this must be unique across WROs
   *       Otherwise 422: "Request could not be completed, PO reference already exists and must be a unique value"
   */
  purchase_order_number?: Nullable<string>;
};

// Shipbob.Receiving.Public.Common.Models.ReceivingStatus
export type ReceivingStatus =
  | 'Awaiting'
  | 'Processing'
  | 'Completed'
  | 'Cancelled'
  | 'Incomplete'
  | 'Arrived'
  | 'PartiallyArrived'
  | 'PartiallyArrivedAtHub'
  | 'ArrivedAtHub'
  | 'ProcessingAtHub'
  | 'InternalTransfer';

export type WarehouseReceivingOrderResponse = {
  id: number;
  /**
   * Not sure what these could be. "Awaiting" is a staging status.
   */
  status: ReceivingStatus;
  /**
   * What was sent in the request
   */
  package_type: PackageType;
  /**
   * What was sent in the request
   */
  box_packaging_type: BoxPackagingType;
  /**
   * What was sent in the request (ISO date)
   */
  expected_arrival_date: string;
  /**
   * ISO date: "2025-02-18T19:25:13.034265+00:00"
   */
  insert_date: string;
  /**
   * ISO date
   */
  last_updated_date: string;
  /**
   * ie: "/2.0/receiving/442945/labels"
   */
  box_labels_uri: string;
  fulfillment_center: FulfillmentCenter;
  purchase_order_number: Nullable<string>;
  inventory_quantities: {
    inventory_id: number;
    sku: string;
    expected_quantity: number;
    received_quantity: number;
    stowed_quantity: number;
  }[];
  /**
   * The timestamp in UTC when a 3rd party integrator has set in ShipBob system
   *
   * We set this in their receiving-extended API endpoints.  Use case is for acknowledging completed orders.
   * Their API has example: "2019-08-24T14:15:22Z"
   */
  external_sync_timestamp: Nullable<string>;
};

/**
 * The simulation will work on our SandBox Environment.
 */
export type Simulation = {
  /**
   * Identifies what action to perform on shipment.
   */
  action: 'ShipOrder' | 'DeliverOrder';
  /**
   * Delay time for action in minutes to be triggered after.
   *
   * NOTE: anything over 2880 will be clamped
   */
  delay?: Nullable<number>;
  /**
   * Next simulation action to be performed after it.
   */
  next?: Nullable<SimulateShipmentRequest>;
};

export type SimulateShipmentRequest = {
  /**
   * Shipment Id for simulation.
   */
  shipment_id: number;
  /**
   * Simulation actions object.
   */
  simulation: Simulation;
};

export type SimulateShipmentResponse = {
  /**
   * Simulation id for register simulation request.
   * UUID ie: 439a9dec-9bff-4339-9564-89975d3a8f5c
   */
  simulation_id: string;
  /**
   * ie: "Simulation registered successfully"
   */
  message: string;
};

export type SimulationDetails = {
  /**
   * Identifies the action that was performed.
   */
  action: 'ShipOrder' | 'DeliverOrder';
  /**
   * Status of the simulation action.
   */
  status: 'Success' | 'Failed' | 'Pending' | 'Skipped';
  /**
   * Additional message for the action.
   *
   * ie:
   * - "This simulated action has been completed successfully."
   * - "This simulation action is not executed yet."
   */
  message: string;
  /**
   * Scheduled time if the action had a delay.
   * ie: ISO date '2025-02-19T00:09:53.77' or NULL
   */
  schedule_time: Nullable<string>;
  /**
   * Nested object with details of subsequent simulation actions. This value would be null if there is no subsequent action.
   */
  next: Nullable<SimulationDetails>;
};

export type SimulationResponse = {
  /**
   * Simulation id for register simulation request.
   */
  simulation_id: string;
  /**
   * ID of the entity for which the simulation was registered.
   */
  entity_id: string;
  /**
   * Type of entity for which the simulation was registered.
   *
   * ie: "Order"
   */
  entity_type: string;
  /**
   * Object with details of simulation actions
   * type:  SimulationDetails (not described in docs)
   */
  simulation: SimulationDetails;
};

/**
 * For each WRO that was supplied, if ExternalSync was updated
 */
export type SetExternalSyncResponse = {
  results: {
    id: number;
    action: 'ExternalSync';
    is_success: boolean;
    /**
     * Probably a reason if it didn't succeed.  Empty when it does succeed.
     * ie: ""
     */
    reason: string;
  }[];
};

export type BoxStatus =
  | 'Awaiting'
  | 'Arrived'
  | 'Completed'
  | 'Counting'
  | 'Stowing'
  | 'Cancelled'
  | 'InternalTransfer';

/**
 * Get Warehouse Receiving Order Boxes response
 */
export type WarehouseReceivingOrderBoxesResponse = {
  box_id: number;
  /**
   * The number of the box in the receiving order
   */
  box_number: number;

  box_status: BoxStatus;
  /**
   * Date the box arrived
   */
  arrived_date: Nullable<string>;
  /**
   * Date the box was received
   */
  received_date: Nullable<string>;
  /**
   * Date counting of the box's inventory items started
   */
  counting_started_date: Nullable<string>;
  /**
   * Tracking number of the box shipment
   */
  tracking_number: Nullable<string>;
  /**
   * type: BoxItemViewModel
   */
  box_items: {
    /**
     * Quantity of the item included
     */
    quantity: number;
    /**
     * Quantity of the item that was received after processing the receiving order
     */
    received_quantity: number;
    /**
     * Quantity of the item that has been stowed
     */
    stowed_quantity: number;
    /**
     * Unique identifier of the inventory item
     */
    inventory_id: number;
    /**
     * Lot number the item belongs to
     */
    lot_number: Nullable<string>;
    /**
     * Expiration date of the item's lot
     */
    lot_date: Nullable<string>;
  }[];
}[];

export enum PackagingRequirement {
  // wrong spelling in PDF
  'No Requirements' = 1,
  Fragile = 2,
  'Is Foldable' = 3,
  'Is Media (Media mail)' = 4,
  'Is Book' = 5,
  'Is Poster' = 6,
  'Is Apparel' = 7,
  'Is Packaging Material (for custom boxes, marketing inserts, etc)' = 8,
  'Ship In Own Container' = 9,
}

export enum PackagingMaterial {
  'Box' = 1,
  'Bubble Mailer' = 2,
  'Poly Mailer' = 3,
  // no 4 in PDF
  'Poster Tube' = 5,
  'Custom Box' = 6,
  'Bookfold' = 7,
  'Ship In Own Container' = 8,
  'Custom Bubble Mailer' = 9,
  'Custom Poly Mailer' = 10,
}

/**
 * Restock (1)
 * Quarantine (2)
 * Dispose (3)
 */
export enum ReturnAction {
  /**
   * Restock (1)
   */
  Restock = 1,
  /**
   * Quarantine (2)
   */
  Quarantine = 2,
  /**
   * Dispose (3)
   */
  Dispose = 3,
}

export type VariantRequestProductExperimental = Omit<VariantRequestProduct2_0, 'barcode'> & {
  barcodes: {
    value: string;
    sticker_url: Nullable<string>;
  }[];
};

export type VariantRequestProduct2_0 = {
  /**
   * Required for updates
   */
  id?: number;
  name?: string;
  sku?: string;
  /**
   * will serialize as a number
   */
  packaging_requirement_id?: PackagingRequirement;
  /**
   * will serialize as a number
   */
  packaging_material_type_id?: PackagingMaterial;
  barcode?: string;
  upc?: string;
  gtin?: string;
  customs?: {
    /**
     * 2 character country code
     */
    country_code_of_origin: 'US';
    /**
     * The customs code (6 digit)
     * ie: “6103.22”
     */
    hs_tariff_code: string;
    /**
     * Value of object for customs (in USD)
     * ie: “15”
     */
    value: string;
    /**
     * Description of product for customs purposes
     */
    description: string;
  };
  /**
   * Not sure if these can be partially supplied.
   */
  return_preferences?: {
    primary_action_id: Nullable<ReturnAction>;
    backup_action_id: null;
    /**
     * Cannot be set when "primary_action_id" has certain values (ie: Quarantine)
     * error: variants.return_preferences.instructions cannot be set for the selected primary action
     */
    instructions: Nullable<string>;
    return_to_sender_primary_action_id: Nullable<ReturnAction>;
    return_to_sender_backup_action_id: Nullable<ReturnAction>;
  };
  lot_information: {
    /**
     * If the product should use lot date based picking
     */
    is_lot: boolean;
    minimum_shelf_life_days: Nullable<number>;
  };
};

export type GetProductQueryStrings = Partial<{
  Page: number;
  Limit: number;
  /**
   * Regular product (1) or Bundle (2)
   */
  productTypeId: 1 | 2;
  /**
   * Active (1) or Inactive (2)
   */
  variantStatus: 1 | 2;
  /**
   * True -> at least one variant is digital
   * False -> at least one variant is not-digital
   */
  hasDigitalVariants: boolean;
  /**
   * Search by one or more Product Ids (comma separated) to return multiple products
   */
  Ids: string;
  /**
   * Search by one or more Variant Ids (comma separated) to return multiple products
   */
  VariantIds: string;
  /**
   * Search by product barcode
   */
  barcode: string;
  /**
   * Search by an exact sku
   */
  sku: string;
  /**
   * Search for products that vary or non-varying products
   */
  hasVariants: boolean;
  /**
   * Search by one or more InventoryIds (comma separated) to return multiple barcodes
   */
  InventoryId: string;
  /**
   * Search by Variant Name.
   * NOTE: Query parameters should be URL encoded such as "Green%20Shirt"
   */
  Name: string;
  /**
   * Search by matching Taxonomy (category) of the product (comma separated)
   */
  TaxonomyIds: string;
}>;

export type GetOrdersQueryStrings = {
  Page: number;
  Limit: number;
  /**
   * order ids to filter by, comma separated
   */
  Ids: string;
  /**
   * Reference ids to filter by, comma separated
   */
  ReferenceIds: string;
  /**
   * Start date to filter orders inserted later than
   */
  StartDate: string;
  /**
   * End date to filter orders inserted earlier than
   */
  EndDate: string;
  /**
   * Order to sort results in
   */
  SortOrder: 'Newest' | 'Oldest';
  /**
   * Has any portion of this order been assigned a tracking number
   */
  HasTracking: boolean;
  /**
   * Start date to filter orders updated later than
   */
  LastUpdateStartDate: string;
  /**
   * End date to filter orders updated later than
   */
  LastUpdateEndDate: string;
  /**
   * Filter orders that their tracking information was fully uploaded
   */
  IsTrackingUploaded: boolean;
  /**
   * Start date to filter orders with tracking updates later than the supplied date. Will only return orders that have tracking information
   */
  LastTrackingUpdateStartDate: string;
  /**
   * End date to filter orders updated later than the supplied date. Will only return orders that have tracking information
   */
  LastTrackingUpdateEndDate: string;
};

export type ExperimentalPagedResult<T> = {
  /**
   * Will be null when there are no items
   */
  first: Nullable<string>;
  next: Nullable<string>;
  items: T[];
  prev: Nullable<string>;
  /**
   * Will be null when there are no items.
   */
  last: Nullable<string>;
};

export type ListInventoryQueryStrings = {
  /**
   * Page of inventory items to get
   */
  Page: number;
  /**
   * Amount of inventory items per page to request
   */
  Limit: number;
  IsActive: boolean;
  IsDigital: boolean;
  IDs: number[];
  /**
   * Sort will default to ascending order for each field. To sort in descending order please pass a "-" in front of the field name. For example, Sort=-onHand,name will sort by onHand descending
   *
   * NOTE: if you sort a non-valid field will be a 422.  ie: on_hand is not an available sort property
   *
   * NOTE: their API is a mix of pascalCase and snake_case.
   */
  Sort: string;
  /**
   * Search is available for 2 fields, Inventory ID and Name -
   *
   * Expected behavior for search by Inventory ID is exact match
   * Expected behavior for search by Inventory Name is partial match, i.e. does not have to be start of word, but must be consecutive characters. This is not case sensitive.
   */
  Search: string;
  /**
   * LocationType is valid for hub, spoke, or lts. LocationType will default to all locations.
   */
  LocationType: string;
};

export type GetInventory1_0Result = {
  id: number;
  name: string;
  is_digital: boolean;
  is_case_pick: boolean;
  is_lot: boolean;
  dimensions: {
    weight: number;
    length: number;
    width: number;
    depth: number;
  };
  /**
   * Total fulfillable quantity of this inventory item
   */
  total_fulfillable_quantity: number;
  /**
   * Total onhand quantity of this inventory item
   */
  total_onhand_quantity: number;
  /**
   * Total committed quantity of this inventory item
   */
  total_committed_quantity: number;
  /**
   * Total quantity that can be sold without overselling the inventory item. This is calculated by subtracting the total exception quantity from the fulfillable quantity.
   */
  total_sellable_quantity: number;
  /**
   * Total quantity in unreceived receiving orders for this inventory item
   */
  total_awaiting_quantity: number;
  /**
   * The total quantity of all items that are contained within orders that are in exception/out of stock status. Out of stock orders have not been processed and therefore do not have lot or fulfillment centers assigned.
   */
  total_exception_quantity: number;
  /**
   * The total quantity of all items that are in the process of internal transit between ShipBob fulfillment centers. These items are not pickable or fulfillable until they have been received and moved to the "On Hand" quantity of the destination FC. Internal transit quantities for each FC represent the incoming transfer stock for that specific location.
   */
  total_internal_transfer_quantity: number;
  /**
   * The amount of the item you need to send to ShipBob to fulfill all exception orders containing the item. This is the exception_quantity less the fulfillable_quantity of the item.
   */
  total_backordered_quantity: number;
  /**
   * Whether the inventory is active or not
   */
  is_active: boolean;
  /**
   * Fulfillable quantity of this inventory item broken down by fulfillment center location
   */
  fulfillable_quantity_by_fulfillment_center: {
    id: number;
    name: string;
    fulfillable_quantity: number;
    onhand_quantity: number;
    committed_quantity: number;
    awaiting_quantity: number;
    internal_transfer_quantity: number;
  }[];
  /**
   * Fulfillable quantity of this inventory item broken down by lot
   */
  fulfillable_quantity_by_lot: {
    lot_number: string;
    /**
     * ie: "2019-08-24T14:15:22Z"
     */
    expiration_date: string;
    fulfillable_quantity: number;
    onhand_quantity: number;
    committed_quantity: number;
    awaiting_quantity: number;
    internal_transfer_quantity: number;
    fulfillable_quantity_by_fulfillment_center: {
      id: number;
      name: string;
      fulfillable_quantity: number;
      onhand_quantity: number;
      committed_quantity: number;
      awaiting_quantity: number;
      internal_transfer_quantity: number;
    }[];
  }[];
  /**
   * ie: "None" "Fragile" "Foldable" "Stackable" "Book" "CustomPackaging" "CustomDunnage" "MarketingInsert" or "Poster"
   */
  packaging_attribute:
    | 'None'
    | 'Fragile'
    | 'Foldable'
    | 'Stackable'
    | 'Book'
    | 'CustomPackaging'
    | 'CustomDunnage'
    | 'MarketingInsert'
    | 'Poster';
};

/**
 * The Topic and SubsciptionId are passed in the HTTP header of the webhook notification, with the names:
 * - shipbob-topic
 * - shipbob-subscription-id
 */
export enum WebhookTopic {
  /**
   * Sends the full order payload when the label is purchased, printed, and placed on box for carrier pickup.
   * While the tracking # will be available, there may be a delay while carriers scan in the package.
   * If the order is split into multiple shipments, this will fire for each shipment that is part of the order.
   */
  OrderShipped = 'order_shipped',
  /**
   * Sends the full shipment payload when a shipment is delivered by the carrier to the customer.
   * If the order is split into multiple shipments, this will fire for each shipment.
   */
  ShipmentDelivered = 'shipment_delivered',
  /**
   * Sends the full shipment payload when a shipment moves to exception status.
   * Shipments are moved into exception because ShipBob is unable to fulfill the shipment.
   * Shipments are moved into exception status largely because one or more items in the shipment is out of stock.
   */
  ShipmentException = 'shipment_exception',
  /**
   * Sends the full shipment payload when a shipment moves to On-Hold status.
   * Shipments are moved into On-Hold status by ShipBob when we are missing key information like Address or Packaging preferences.
   * Shipments can also be moved to On-Hold in the Merchant Dashboard. On-Hold Shipments will not be fulfilled.
   */
  ShipmentOnHold = 'shipment_onhold',
  /**
   * Sends the full shipment payload when a shipment moves to cancelled status.
   * This webhook subcription will NOT notify you of cancelled split, copied, manual, and excel imported orders.
   * This functionality will be available on this webhook at a later point.
   */
  ShipmentCancelled = 'shipment_cancelled',
}

/**
 * This can be used to lookup a webhook content based on the supplier "shipbob-topic" header.
 */
export type WebhookResponsesByTopic =
  | {
      topic: 'order_shipped';
      payload: Order;
    }
  | {
      topic: 'shipment_delivered';
      payload: Omit<OrderShipment, 'status'> & {
        status: 'Completed';
      };
    }
  | {
      topic: 'shipment_exception';
      payload: Omit<OrderShipment, 'status'> & {
        status: 'Exception';
      };
    }
  | {
      topic: 'shipment_onhold';
      payload: Omit<OrderShipment, 'status'> & {
        status: 'OnHold';
      };
    }
  | {
      topic: 'shipment_cancelled';
      payload: Omit<OrderShipment, 'status'> & {
        status: 'Cancelled';
      };
    };
