/* eslint-disable @typescript-eslint/consistent-type-definitions */
import https from 'https';
import { IncomingMessage } from 'http';
import { ParsedUrlQueryInput } from 'querystring';
import url from 'url';

export type Nullable<T> = T | null;

export enum WebhookTopic {
  OrderShipped = 'order_shipped',
  ShipmentDelivered = 'shipment_delivered',
  ShipmentException = 'shipment_exception',
  ShipmentOnHold = 'shipment_onhold',
  ShipmentCancelled = 'shipment_cancelled',
}

export type Credentials = {
  token: string;
  channelId?: number;
};

export type DataResponse<T> = (
  | {
      /**
       * HTTP status code received was in 200's.
       */
      success: true;
      data: T;
    }
  | {
      /**
       * HTTP status code not in 200s (ie: 302 (auth redirect - check location header), 422 (validation), 524 (cloudflare))
       */
      success: false;
      /**
       * for 422 is Record<keyof T, string[]>?
       */
      data: object | string;
    }
) & {
  statusCode: number;
};

// ShipBob is potentially extending their 2.0 release 2025-04

const PATH_1_0_CHANNEL = '/1.0/channel';
const PATH_1_0_PRODUCT = '/1.0/product';
const PATH_1_0_ORDER = '/1.0/order';
/**
 * Warehouse Receiving Order
 */
const PATH_2_0_RECEIVING = '/2.0/receiving';
/**
 * Note part of API docs
 */
const PATH_2_0_RECEIVING_EXTENDED = '/2.0/receiving-extended';
/**
 * Warehouse Receiving Order
 */
const PATH_EXPERIMENTAL_RECEIVING = '/experimental/receiving';

const PATH_1_0_INVENTORY = '/1.0/inventory';
const PATH_1_0_FULFILLMENT_CENTER = '/1.0/fulfillmentCenter';
const PATH_1_0_WEBHOOK = '/1.0/webhook';
const PATH_2_0_SIMULATE = '/2.0/simulate';

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

export type GetProductResult = {
  id: number;
  reference_id: string;
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

export type PlaceOrderResponse = {
  id: number;
  /**
   * ISO date.  ie: "2019-08-24T14:15:22Z"
   */
  created_date: string;
  /**
   * ISO date.  ie: "2019-08-24T14:15:22Z"
   */
  purchase_date: string;
  reference_id: string;
  order_number: string;
  /**
   * probably always "Processing" - we should be able to get order status updates via webhook
   */
  status: 'Processing';
  type: OrderType;
  channel: {
    id: number;
    /**
     * ie: "ShipBobs-Shopify-Store"
     */
    name: string;
  };
  /**
   * ie: "Free 2-day Shipping"
   */
  shipping_method: string;
  recipient: {
    name: string;
    address: Address;
    email: string;
    phone_number: string;
  };
  products: {
    id: number;
    reference_id: string;
    quantity: number;
    quantity_unit_of_measure_code: string;
    sku: string;
    gtin: string;
    upc: string;
    unit_price: number;
    external_line_id: number;
  }[];
  tags: string[];
  shipments: {
    id: number;
    order_id: number;
    reference_id: string;
    recipient: {
      name: string;
      address: Address;
      email: string;
      phone_number: string;
    };
  }[];
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
       * Lot number of the items in the box
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

/**
 * Works for GET and POST/PATCH responses.  Some types area JSON.
 */
function resolvePromise<T>(
  response: IncomingMessage,
  messageBody: string,
  resolve: (value: DataResponse<T> | PromiseLike<DataResponse<T>>) => void,
  reject: (reason?: Error) => void
) {
  if (response.statusCode !== undefined && (response.statusCode < 200 || response.statusCode > 299)) {
    /**
     * Maybe we should be looking at the header Content-Type for parsing
     */
    switch (response.statusCode) {
      case 400:
      case 422:
        resolve({
          success: false,
          statusCode: response.statusCode,
          data: JSON.parse(messageBody) as object,
        });
        break;
      default:
        // this could be a 524 from CloudFlare, for example.
        resolve({
          success: false,
          statusCode: response.statusCode,
          data: messageBody,
        });
        break;
    }
  } else {
    try {
      resolve({
        success: true,
        statusCode: response.statusCode!,
        data: JSON.parse(messageBody) as T,
      });
    } catch (e) {
      console.error('unable to parse JSON');
      reject(e as Error);
    }
  }
}

/**
 * Create API with PAT (personal access token) - defaults to sandbox endpoints and "SMA" channel.
 *
 * NOTE: We used token based auth, so did not need to implement the other auth mechanism(s).
 *
 * TODO: Consider adding global parameters like timeout (or per method).  Some endpoints are slower than others.
 *
 * @param personalAccessToken passing *undefined* or empty string has a guar clause that will throw
 * @param apiBaseUrl 
 * @param channelApplicationName 
 * @returns 
 */
export const createShipBobApi = async (
  personalAccessToken: string | undefined,
  apiBaseUrl = 'sandbox-api.shipbob.com',
  channelApplicationName = 'SMA' /*, authBaseUrl = 'authstage.shipbob.com'*/
) => {
  if(personalAccessToken === undefined || personalAccessToken === '') {
    throw new Error('Cannot create a ShipBob API without a PAT');
  }
  
  const credentials: Credentials = {
    token: personalAccessToken,
  };

  /**
   * Will GET using our PAT and SAM channel
   */
  const httpGet = async <T>(
    credentials: Credentials,
    path: string,
    query?: Record<string, string> | ParsedUrlQueryInput,
    timeoutMilliseconds = 5000,
    port?: number
  ): Promise<DataResponse<T>> => {
    const requestUrl = url.parse(
      url.format({
        protocol: 'https',
        hostname: apiBaseUrl,
        pathname: path,
        query,
      })
    );

    console.log(` > GET: ${requestUrl.hostname}${requestUrl.path}`);

    const options = {
      hostname: requestUrl.hostname,
      port: port ?? 443,
      path: requestUrl.path,
      method: 'GET',
      timeout: timeoutMilliseconds,
      headers: {
        Authorization: `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'KITS SDK interface',
      },
    };

    return new Promise<DataResponse<T>>((resolve, reject) => {
      const req = https.request(options, (response: IncomingMessage) => {
        const body: string[] = [];
        response.on('data', (chunk) => {
          body.push(chunk as string);
        });

        response.on('end', () => {
          const messageBody = body.join('');
          resolvePromise<T>(response, messageBody, resolve, reject);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.end();
    });
  };

  /**
   * Will post to Shipbob a request as JSON.  Can be used for any type of request
   */
  const httpData = async <T>(
    credentials: Credentials,
    data: object | undefined,
    path: string,
    timeoutMilliseconds = 5000,
    port?: number
  ): Promise<DataResponse<T>> => {
    if (credentials.channelId === undefined) {
      throw new Error('Channel ID missing');
    }

    // NOTE: we're not sending content-length.  Their API is OK with that.
    const options = {
      hostname: apiBaseUrl,
      port: port ?? 443,
      path,
      method: 'POST',
      timeout: timeoutMilliseconds,
      headers: {
        Authorization: `Bearer ${credentials.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'KITS SDK interface',
        shipbob_channel_id: credentials.channelId,
      },
    };

    return new Promise<DataResponse<T>>((resolve, reject) => {
      const req = https.request(options, (response: IncomingMessage) => {
        const body: string[] = [];
        response.on('data', (chunk) => {
          body.push(chunk as string);
        });

        response.on('end', () => {
          const messageBody = body.join('');
          resolvePromise<T>(response, messageBody, resolve, reject);
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        const postBody = JSON.stringify(data);
        req.write(postBody);
      }

      req.end();
    });
  };

  const channelsResponse = await httpGet<ChannelsResponse>(credentials, PATH_1_0_CHANNEL);

  if (!channelsResponse.success) {
    throw new Error(`${channelsResponse.statusCode} '${channelsResponse.data as string}'`);
  }
  const smaChannel = channelsResponse.data.find((c) => c.application_name === channelApplicationName);
  if (smaChannel === undefined) {
    throw new Error(`Did not find SMA channel {${channelsResponse.data.map((c) => c.application_name).join(',')}}`);
  }

  credentials.channelId = smaChannel.id;

  return {
    getProductById: async (productId: number) => {
      // productId would need to be URL encoded - not for us, it's just numeric digits
      // NOTE: /1.0/product/888290263059
      // ERROR: {"productId":["The value '888290263059' is not valid."]}
      const getProductResult = await httpGet<GetProductResult>(credentials, `${PATH_1_0_PRODUCT}/${productId}`);
      console.log(
        'get product:',
        getProductResult.success,
        getProductResult.success === false ? getProductResult.statusCode : 'found'
      );
      return getProductResult;
    },
    getProducts: async (
      query: Partial<{
        ReferenceIds: string;
        Page: number;
        Limit: number;
        IDs: string; // csv
        Search: string;
        ActiveStatus: 'Any' | 'Active' | 'Inactive';
        BundleStatus: 'Any' | 'Bundle' | 'NotBundle';
      }>
    ) => {
      const getProductResult = await httpGet<GetProductResult[]>(credentials, PATH_1_0_PRODUCT, query);
      console.log(
        'get product:',
        getProductResult.success,
        getProductResult.success === false ? getProductResult.statusCode : 'found'
      );
      return getProductResult;
    },
    addProduct: async (product: {
      reference_id: string,
      sku: string,
      name: string,
      barcode: string
    }) => {
      const addProductResponse = await httpData<AddProductResponse>(
        credentials,
        product,
        PATH_1_0_PRODUCT
      );
      console.log(' > Added product:', addProductResponse.success ? addProductResponse.data.reference_id : 'failed');
      return addProductResponse;
    },
    placeOrder: async (order: PlaceOrderRequest) => {
      const placeOrderResponse = await httpData<PlaceOrderResponse>(credentials, order, PATH_1_0_ORDER);
      console.log('place order:', placeOrderResponse);
      return placeOrderResponse;
    },
    /**
     * Cancel single Order by Order Id
     *
     * @param orderId The order Id to cancel
     */
    cancelSingleOrderByOrderId: async (orderId: number) => {
      const placeOrderResponse = await httpData<CancelOrderResponse>(
        credentials,
        undefined,
        `${PATH_1_0_ORDER}/${orderId}/cancel`
      );
      console.log('place order:', placeOrderResponse);
      return placeOrderResponse;
    },
    getWebhooks: async () => {
      const webhooks = await httpGet<Webhook[][]>(credentials, PATH_1_0_WEBHOOK);
      console.log('webhooks:', webhooks);
      return webhooks;
    },
    createWebhookSubscription: async (webhook: Omit<Webhook, 'id' | 'created_at'>) => {
      const createdWebhook = await httpData<Webhook>(credentials, webhook, PATH_1_0_WEBHOOK);
      return createdWebhook;
    },
    getFulfillmentCenters: async () => {
      const fulfillmentCenters = await httpGet<FulfillmentCenter[]>(credentials, PATH_1_0_FULFILLMENT_CENTER);
      console.log('fulfillment centers:', fulfillmentCenters);
      return fulfillmentCenters;
    },
    createWarehouseReceivingOrder: async (request: WarehouseReceivingOrderRequest) => {
      const createdWRO = await httpData<WarehouseReceivingOrderResponse>(credentials, request, PATH_2_0_RECEIVING);
      return createdWRO;
    },
    getWarehouseReceivingOrder: async (orderId: number) => {
      const wro = await httpGet<WarehouseReceivingOrderResponse>(credentials, `${PATH_2_0_RECEIVING}/${orderId}`);
      return wro;
    },
    getWarehouseReceivingOrderBoxes: async (orderId: number) => {
      const wroBoxes = await httpGet<WarehouseReceivingOrderBoxesResponse>(
        credentials,
        `${PATH_2_0_RECEIVING}/${orderId}/boxes`
      );
      return wroBoxes;
    },
    getReceivingExtended: async (
      query: Partial<{
        Statuses: string;
        ExternalSync: boolean;
      }>
    ) => {
      const getReceivingExtendedResult = await httpGet<GetProductResult[]>(
        credentials,
        PATH_2_0_RECEIVING_EXTENDED,
        query
      );
      console.log(
        'get receiving extended:',
        getReceivingExtendedResult.success,
        getReceivingExtendedResult.success === false ? getReceivingExtendedResult.statusCode : 'found'
      );
      return getReceivingExtendedResult;
    },
    /**
     * This must be for setting/clearing if it has been synced externally.
     *
     * Use case is interop via searching for "completed" that are not yet synced.
     *
     * NOTE: this is tagged experimental, so might change or be dropped
     */
    experimentalReceivingSetExternalSync: async (ids: number[], isExternalSync: boolean) => {
      console.log(`Setting: ${ids.join(',')} to external sync: ${isExternalSync}`);
      const response = await httpData<SetExternalSyncResponse>(
        credentials,
        {
          ids,
          is_external_sync: isExternalSync,
        },
        `${PATH_EXPERIMENTAL_RECEIVING}/:set-external-sync`
      );
      if (response.success) {
        for (const result of response.data.results) {
          console.log(` > ${result.id} ${result.action}. Success: ${result.is_success} Reason:'${result.reason}'`);
        }
        console.log('');
      }
      return response;
    },
    listInventory: async (
      query: Partial<{
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
      }>
    ) => {
      const getInventoryResult = await httpGet<GetProductResult[]>(credentials, PATH_1_0_INVENTORY, query);
      console.log(
        'get inventory:',
        getInventoryResult.success,
        getInventoryResult.success === false ? getInventoryResult.statusCode : 'found'
      );
      return getInventoryResult;
    },
    /**
     * Only for sandbox: https://developer.shipbob.com/sandbox-simulations/
     *
     * NOTE: generates a 200 instead of a 201 like everywhere else
     */
    simulateShipment: async (request: SimulateShipmentRequest) => {
      const result = await httpData<SimulateShipmentResponse>(credentials, request, `${PATH_2_0_SIMULATE}/shipment`);
      if (result.success) {
        console.log('simulate shipment sent', result.data.simulation_id, result.data.message);
      } else {
        console.log('simulate shipment failed:', result.data);
      }
      return result;
    },
    /**
     *
     * Only for sandbox: https://developer.shipbob.com/sandbox-simulations/
     *
     * @param simulationId UUID from "/2.0/simulate/shipment" call
     */
    getSimulationStatus: async (simulationId: string) => {
      const result = await httpGet<SimulationResponse>(credentials, `${PATH_2_0_SIMULATE}/status/${simulationId}`);
      return result;
    },
  };
};
