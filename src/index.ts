/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { URL } from 'node:url'; // WHATWG
import {
  AddProductResponse,
  CancelOrderResponse,
  ChannelsResponse,
  ExperimentalPagedResult,
  FulfillmentCenter,
  GetInventory1_0Result,
  GetOrdersQueryStrings,
  GetProduct1_0Result,
  GetProduct2_0Response,
  GetProductExperimentalResponse,
  GetProductQueryStrings,
  GetProducts1_0QueryString,
  ListInventoryQueryStrings,
  Order,
  PlaceOrderRequest,
  SetExternalSyncResponse,
  ShippingMethod,
  SimulateShipmentRequest,
  SimulateShipmentResponse,
  SimulationResponse,
  VariantRequestProduct2_0,
  VariantRequestProductExperimental,
  WarehouseReceivingOrderBoxesResponse,
  WarehouseReceivingOrderRequest,
  WarehouseReceivingOrderResponse,
  Webhook,
} from './types';

export * from './types';

export type Nullable<T> = T | null;

export type Credentials = {
  token: string;
  channelId?: number;
};

// This should be extended: DataResponse<T, U...> where U... are known types for 400, 422, etc.
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
  headers: Record<string, string>;
  statusCode: number;
  rateLimit: {
    /**
     * There are 150 calls in a sliding window of 1 minute.
     *
     * Retrieved from x-remaining-calls header in response.
     * null when not found.
     */
    remainingCalls: Nullable<number>;
    /**
     * Seconds remaining in sliding window once rate limit has been exhausted.
     */
    retryAfter: Nullable<number>;
  };
};

// Products
const PATH_1_0_CHANNEL = '/1.0/channel';
const PATH_1_0_PRODUCT = '/1.0/product';
const PATH_2_0_PRODUCT = '/2.0/product';
const PATH_EXPERIMENTAL_PRODUCT = '/experimental/product';

// Orders
const PATH_1_0_ORDER = '/1.0/order';
const PATH_1_0_SHIPPINGMETHOD = '/1.0/shippingmethod';
/**
 * Warehouse Receiving Order
 */
const PATH_2_0_RECEIVING = '/2.0/receiving';
/**
 * Not part of API docs
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

export type CreateOptions = {
  /**
   * console.log HTTP traffic (http verb + endpoint)
   */
  logTraffic: boolean;
};

/**
 * Create API with PAT (personal access token) - defaults to sandbox endpoints and "SMA" channel.
 *
 * NOTE: We used token based auth, so did not need to implement the other auth mechanism(s).
 *
 * TODO: Consider adding global parameters like timeout (or per method).  Some endpoints are slower than others.
 *
 * @param personalAccessToken passing *undefined* or empty string has a guar clause that will throw
 * @param apiBaseUrl must pass "api.shipbob.com" otherwise sandbox will be used.
 * @param channelApplicationName will default to SMA account, otherwise provide your application_name here
 * @param options defaults to not logging traffic
 */
export const createShipBobApi = async (
  personalAccessToken: string | undefined,
  apiBaseUrl = 'sandbox-api.shipbob.com',
  channelApplicationName = 'SMA',
  options: CreateOptions = {
    logTraffic: false,
  }
) => {
  if (personalAccessToken === undefined || personalAccessToken === '') {
    throw new Error('Cannot create a ShipBob API without a PAT');
  }

  const credentials: Credentials = {
    token: personalAccessToken,
  };

  const REMAINING_CALLS = 'x-remaining-calls'; // in sliding window
  const RETRY_AFTER_SECONDS = 'x-retry-after'; // seconds to wait for rate-limiting
  const CONTENT_TYPE = 'content-type';

  const IGNORED_HEADERS = [
    'cf-cache-status',
    'cf-ray',
    'connection',
    'content-encoding',
    'content-length',
    // 'content-type', // useful for failed responses
    'date',
    'request-context',
    'server',
    'strict-transport-security',
    'transfer-encoding',
    'vary',
    'x-powered-by',
    REMAINING_CALLS, // part of rateLimit: {}
    RETRY_AFTER_SECONDS, // part of rateLimit: {}
  ];

  const getResult = async <T>(res: Response): Promise<DataResponse<T>> => {
    const remainingCalls = res.headers.has(REMAINING_CALLS) ? parseInt(res.headers.get(REMAINING_CALLS)!) : null;

    const retryAfter = res.headers.has(RETRY_AFTER_SECONDS) ? parseInt(res.headers.get(RETRY_AFTER_SECONDS)!) : null;

    const headers = Array.from(res.headers).reduce<Record<string, string>>((prev, [key, val]) => {
      if (IGNORED_HEADERS.indexOf(key) === -1) {
        prev[key] = val;
      }
      return prev;
    }, {});

    const rateLimit = {
      remainingCalls,
      retryAfter,
    };

    const hasJsonContentHeader = (res: Response) => {
      const contentType = res.headers.has(CONTENT_TYPE) ? res.headers.get(CONTENT_TYPE) : null;
      return (
        contentType &&
        (contentType.startsWith('application/json') || contentType.startsWith('application/problem+json'))
      )
    }
    if (res.ok) {
      const isJson = hasJsonContentHeader(res);
      if (!isJson) {
        // NOTE: DELETE webhook is a 204 with an empty response (ie: 'content-length' = '0')
        console.warn(' > content-type not found for JSON - returning text');
      }

      const data = isJson
        ? (await res.json()) as T
        : (await res.text()) as T
      return {
        data,
        headers,
        statusCode: res.status,
        success: true,
        rateLimit,
      };
    }

    // also http status codes 400, 422 tend to be JSON
    // application/json; charset=utf-8
    const isJson = hasJsonContentHeader(res);
    const data = isJson
      ? await res.json()
      : await res.text();

    return {
      data,
      headers,
      statusCode: res.status,
      success: false,
      rateLimit,
    };
  };

  const getHeaders = (credentials: Credentials, sendChannelId: boolean): HeadersInit => {
    const headers: HeadersInit = {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'shipbob-node-sdk',
    };

    if (credentials.channelId && sendChannelId !== false) {
      headers['shipbob_channel_id'] = credentials.channelId.toString();
    }
    return headers;
  };

  /**
   * Will GET using our PAT and SAM channel
   */
  const httpGet = async <T>(
    credentials: Credentials,
    path: string,
    query?: Record<string, string | number | boolean | number[]>,
    sendChannelId = true
  ): Promise<DataResponse<T>> => {
    const url = new URL(`https://${apiBaseUrl}${path}`);
    if (query) {
      for (const param of Object.keys(query)) {
        // the number[] is probably wrong
        const val = typeof query[param] === 'string' ? query[param] : query[param].toString();
        url.searchParams.set(param, val);
      }

      if (options.logTraffic) {
        console.log(` > before: ${url.href}`);
      }
      // The API is using unescaped reserved characters.  Since we aren't passing "," or ":" ever then this is safe (for one person).
      // If a caller is searching for ie: products with those characters in the name then this may fail.
      // ie: https://.../experimental/product?sku=any%3A123%2C456 => https://.../experimental/product?sku=any:123,456
      // NOTE: both replacements are needed for above to work
      url.search = url.search.replace(/%2C/g, ',').replace(/%3A/g, ':'); //;
    }

    if (options.logTraffic) {
      console.log(` > GET: ${url.href}`);
    }

    const opts = {
      method: 'GET',
      headers: getHeaders(credentials, sendChannelId),
    };

    const res = await fetch(url.href, opts);
    return getResult(res);
  };

  /**
   * Will default POST to Shipbob a request as JSON.  Can be used for any type of request
   */
  const httpData = async <T>(
    credentials: Credentials,
    data: object | undefined,
    path: string,
    method: 'POST' | 'PATCH' | 'DELETE' = 'POST',
    sendChannelId = true
  ): Promise<DataResponse<T>> => {
    if (credentials.channelId === undefined) {
      throw new Error('Channel ID missing');
    }

    const url = new URL(`https://${apiBaseUrl}${path}`);

    if (options.logTraffic) {
      console.log(` > ${method} ${url.href}`);
    }

    const opts = {
      method,
      headers: getHeaders(credentials, sendChannelId),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    };

    const res = await fetch(url.href, opts);
    return getResult(res);
  };

  const channelsResponse = await httpGet<ChannelsResponse>(credentials, PATH_1_0_CHANNEL);

  if (!channelsResponse.success) {
    throw new Error(` > GET /1.0/channel -> ${channelsResponse.statusCode} '${channelsResponse.data as string}'`);
  }
  const smaChannel = channelsResponse.data.find((c) => c.application_name === channelApplicationName);
  if (smaChannel === undefined) {
    throw new Error(`Did not find SMA channel {${channelsResponse.data.map((c) => c.application_name).join(',')}}`);
  }

  credentials.channelId = smaChannel.id;

  return {
    /**
     * Gets by *their* product id
     */
    getProductById: async (productId: number) => {
      const getProductResult = await httpGet<GetProduct1_0Result>(credentials, `${PATH_1_0_PRODUCT}/${productId}`);
      return getProductResult;
    },
    getProducts1_0: async (query: GetProducts1_0QueryString) => {
      return await httpGet<GetProduct1_0Result[]>(credentials, PATH_1_0_PRODUCT, query);
    },
    /**
     * NOTE: you need to use the headers (part of this client response) to page the results.
     * page-number='1'
     * page-size='50'
     * total-count='1'
     * total-pages='1'
     *
     * NOTE: we can probably pass more than "variants" prop.  We could on the /1.0/product endpoint
     * NOTE: This PATCH functionality will be available in the next version available in ShipBob next large release January 2025, it may require extra scope.
     */
    updateProduct2_0: async (productId: number, variants: VariantRequestProduct2_0[]) => {
      return await httpData<AddProductResponse>(
        credentials,
        {
          variants,
        },
        `${PATH_2_0_PRODUCT}/${productId}`,
        'PATCH'
      );
    },
    /**
     * Unsure how this is different from /2.0/product except for "barcode" -> "barcodes"
     */
    updateProductExperimental: async (productId: number, variants: VariantRequestProductExperimental[]) => {
      return await httpData<AddProductResponse>(
        credentials,
        {
          variants,
        },
        `${PATH_EXPERIMENTAL_PRODUCT}/${productId}`,
        'PATCH'
      );
    },
    /**
     * Not supported here, but:
     * Some search filters allow for operators (equals, not equals, starts with, ends with, contains, etc) to get more exact values. When filtering with an operator, the query string will look like the below:
     * Example: /product?{filter}={operator}:{value}
     * Example: /product?sku=any:shirt-a,shirt-b,shirt-c Find products that match any of these SKUs
     * Example: /product?onHandQuantity=gt:0 Find products where OnHandQty greater than 0
     */
    getProducts2_0: async (query: GetProductQueryStrings) => {
      return await httpGet<GetProduct2_0Response[]>(credentials, PATH_2_0_PRODUCT, query);
    },
    /**
     * Note sure how this is different from /2.0/product.  Only notable difference is "barcodes" type from string to object.
     */
    getProductsExperimental: async (query: Partial<GetProductQueryStrings>) => {
      return await httpGet<ExperimentalPagedResult<GetProductExperimentalResponse>>(
        credentials,
        PATH_EXPERIMENTAL_PRODUCT,
        query
      );
    },
    createProduct1_0: async (product: { reference_id: string; sku: string; name: string; barcode: string }) => {
      return await httpData<AddProductResponse>(credentials, product, PATH_1_0_PRODUCT);
    },
    /**
     * The request part for variant is not accurate.  This is just for testing - there are no official docs.
     */
    createProduct2_0: async (product: { type_id: number; name: string; variants: VariantRequestProduct2_0[] }) => {
      return await httpData<AddProductResponse>(credentials, product, PATH_2_0_PRODUCT);
    },
    /**
     * Unsure how this is different from '2.0/product' except for "barcode" -> "barcodes"
     */
    createProductExperimental: async (product: {
      type_id: number;
      name: string;
      variants: VariantRequestProductExperimental[];
    }) => {
      return await httpData<AddProductResponse>(credentials, product, PATH_EXPERIMENTAL_PRODUCT);
    },
    /**
     * Look in the returned headers to get paging information.
     */
    getOrders: async (query: Partial<GetOrdersQueryStrings>) => {
      return await httpGet<Order[]>(credentials, PATH_1_0_ORDER, query);
    },
    /**
     * NOTE: After you place an order it is not immediately available on the "getOrders" endpoint.
     * You are best off using the returned result.  ShipBob suggests 5 seconds as permitted delay time.
     */
    placeOrder: async (order: PlaceOrderRequest) => {
      return await httpData<Order>(credentials, order, PATH_1_0_ORDER);
    },
    /**
     * Cancel single Order by Order Id
     *
     * @param orderId The order Id to cancel
     */
    cancelSingleOrderByOrderId: async (orderId: number) => {
      return await httpData<CancelOrderResponse>(credentials, undefined, `${PATH_1_0_ORDER}/${orderId}/cancel`);
    },
    getShippingMethods: async () => {
      return await httpGet<ShippingMethod[]>(credentials, PATH_1_0_SHIPPINGMETHOD);
    },
    /**
     * The responses don't indicate if they were registered with a channel or not.
     */
    getWebhooks: async () => {
      return await httpGet<Webhook[]>(credentials, PATH_1_0_WEBHOOK);
    },
    /**
     *
     * @param webhook just needs topic and subscription url.
     * @param sendChannelId defaults `true`.  Not providing channel id will (I think) subscribe to all channels.  You need to match when unsubscribing.
     * @returns
     */
    registerWebhookSubscription: async (webhook: Omit<Webhook, 'id' | 'created_at'>, sendChannelId = true) => {
      return await httpData<Webhook>(credentials, webhook, PATH_1_0_WEBHOOK, undefined, sendChannelId);
    },
    /**
     * Can generate 500 response with data: "The wait operation timed out."  If so, check your channel id (or lack thereof) matches the subscription registration.
     *
     * @param id channelId from getWebhooks()
     * @param sendChannelId defaults `true`.  You need to match this with when you subscribed.  There's no way to see this anywhere.
     * @returns
     */
    unregisterWebhookSubscription: async (id: number, sendChannelId = true) => {
      return await httpData<Webhook>(credentials, undefined, `${PATH_1_0_WEBHOOK}/${id}`, 'DELETE', sendChannelId);
    },
    getFulfillmentCenters: async () => {
      return await httpGet<FulfillmentCenter[]>(credentials, PATH_1_0_FULFILLMENT_CENTER);
    },
    createWarehouseReceivingOrder: async (request: WarehouseReceivingOrderRequest) => {
      // due to failures downstream in their WRO processing.  They will need to create multiple WROs that cannot be merged:
      if (request.purchase_order_number) {
        if (!/^[A-Za-z0-9 ]+$/.test(request.purchase_order_number)) {
          const validPurchaseOrderNumber = request.purchase_order_number.replace(/[^A-Za-z0-9 ]/gi, ' ');
          console.log(` Replacing disallowed PO number: '${request.purchase_order_number}' -> '${validPurchaseOrderNumber}'`)
          request.purchase_order_number = validPurchaseOrderNumber;
        }
      }

      return await httpData<WarehouseReceivingOrderResponse>(credentials, request, PATH_2_0_RECEIVING);
    },
    getWarehouseReceivingOrder: async (orderId: number) => {
      return await httpGet<WarehouseReceivingOrderResponse>(credentials, `${PATH_2_0_RECEIVING}/${orderId}`);
    },
    getWarehouseReceivingOrderBoxes: async (orderId: number) => {
      return await httpGet<WarehouseReceivingOrderBoxesResponse>(credentials, `${PATH_2_0_RECEIVING}/${orderId}/boxes`);
    },
    /**
     * NOTE: should verify that response matches 1.0 product endpoint
     */
    getReceivingExtended: async (
      query: Partial<{
        Statuses: string;
        ExternalSync: boolean;
      }>
    ) => {
      return await httpGet<GetProduct1_0Result[]>(credentials, PATH_2_0_RECEIVING_EXTENDED, query);
    },
    /**
     * This must be for setting/clearing if it has been synced externally.
     *
     * Use case is interop via searching for "completed" that are not yet synced.
     *
     * NOTE: this is tagged experimental, so might change or be dropped
     */
    experimentalReceivingSetExternalSync: async (ids: number[], isExternalSync: boolean) => {
      return await httpData<SetExternalSyncResponse>(
        credentials,
        {
          ids,
          is_external_sync: isExternalSync,
        },
        `${PATH_EXPERIMENTAL_RECEIVING}/:set-external-sync`
      );
    },
    /**
     * NOTE: should verify the response type matches the product 1.0 endpoint
     */
    listInventory: async (query: Partial<ListInventoryQueryStrings>) => {
      return await httpGet<GetInventory1_0Result[]>(credentials, PATH_1_0_INVENTORY, query);
    },
    /**
     * Only for sandbox: https://developer.shipbob.com/sandbox-simulations/
     */
    simulateShipment: async (request: SimulateShipmentRequest) => {
      return await httpData<SimulateShipmentResponse>(credentials, request, `${PATH_2_0_SIMULATE}/shipment`);
    },
    /**
     *
     * Only for sandbox: https://developer.shipbob.com/sandbox-simulations/
     *
     * @param simulationId UUID from "/2.0/simulate/shipment" call
     */
    getSimulationStatus: async (simulationId: string) => {
      return await httpGet<SimulationResponse>(credentials, `${PATH_2_0_SIMULATE}/status/${simulationId}`);
    },
  };
};
