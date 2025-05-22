/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { URL } from 'node:url'; // WHATWG
import {
  AddProductResponse,
  CancelOrderResponse,
  Channel,
  CreateOptions,
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
  OrderShipment,
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
export * from './oAuth';
// exporting will require puppeteer in client
// export * from './WebScraper';

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

// Shipments
const PATH_1_0_SHIPMENT = '/1.0/shipment';

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

// single-merchant application
const DEFAULT_CHANNEL_APPLICATION_NAME = 'SMA';

/**
 * Create API with PAT (personal access token) or oAuth (access token).
 *
 * TODO: Consider adding global parameters like timeout (or per method).  Some endpoints are slower than others.
 * TODO: Consider allowing channel selection to occur based on an available scope. ie: `fulfillments_write` instead of only application name.
 *
 * @param token Personal Access Token for `connectionType` "PAT".  Otherwise an OAuth token when `connectinoType` is 'OAuth
 * @param apiBaseUrl must pass "api.shipbob.com" otherwise sandbox will be used.
 * @param channelPredicateOrApplicationName will default to choosing "SMA" application_name, otherwise provide your own application_name here (ie: for oAuth use the name of your App)
 * @param options defaults to not logging traffic
 */
export const createShipBobApi = async (
  token: string | undefined,
  apiBaseUrl = 'sandbox-api.shipbob.com',
  channelPredicateOrApplicationName:
    | string
    | ((channels: Channel[]) => Channel | undefined) = DEFAULT_CHANNEL_APPLICATION_NAME,
  options: CreateOptions = {
    logTraffic: false,
    skipChannelLoad: false,
  }
) => {
  if (token === undefined || token === '') {
    throw new Error('Cannot create a ShipBob API without a PAT');
  }

  const credentials: Credentials = {
    token,
  };

  type ApiConfiguration = {
    sendChannelId: boolean;
  };

  const apiConfiguration: ApiConfiguration = {
    sendChannelId: options.sendChannelId !== false,
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
      // TODO: consider making this case-insensitive
      const contentType = res.headers.has(CONTENT_TYPE) ? res.headers.get(CONTENT_TYPE) : null;
      return (
        contentType &&
        (contentType.startsWith('application/json') || contentType.startsWith('application/problem+json'))
      );
    };
    if (res.ok) {
      const isJson = hasJsonContentHeader(res);
      if (!isJson) {
        // NOTE: DELETE webhook is a 204 with an empty response (ie: 'content-length' = '0')
        console.warn(' > content-type not found for JSON - returning text');
      }

      const data = isJson ? ((await res.json()) as T) : ((await res.text()) as T);
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
    const data = isJson ? await res.json() : await res.text();

    return {
      data,
      headers,
      statusCode: res.status,
      success: false,
      rateLimit,
    };
  };

  const getHeaders = (credentials: Credentials): HeadersInit => {
    const headers: HeadersInit = {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'shipbob-node-sdk',
    };

    if (credentials.channelId && apiConfiguration.sendChannelId !== false) {
      headers['shipbob_channel_id'] = credentials.channelId.toString();
    }

    if (options.extraHeaders) {
      for (const key of Object.keys(options.extraHeaders)) {
        // these will be logged if they are configured
        headers[key] = options.extraHeaders[key];
      }
    }

    if (options.logTraffic === true) {
      const headersToLog = Object.keys(headers).reduce<string[]>((prev, cur) => {
        prev.push(cur === 'Authorization' ? `${cur}:Bearer <redacted>` : `${cur}:${headers[cur]}`);

        return prev;
      }, []);
      console.log(` > Headers: ${JSON.stringify(headersToLog.join(','))}`);
    }

    return headers;
  };

  /**
   * Will GET using our PAT and SAM channel
   */
  const httpGet = async <T>(
    credentials: Credentials,
    path: string,
    query?: Record<string, string | number | boolean | number[]>
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

    const opts = {
      method: 'GET',
      headers: getHeaders(credentials),
    };

    if (options.logTraffic) {
      console.log(` > GET: ${url.href}`);
    }

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
    method: 'POST' | 'PATCH' | 'DELETE' = 'POST'
  ): Promise<DataResponse<T>> => {
    if (credentials.channelId === undefined) {
      throw new Error('Channel ID missing');
    }

    const url = new URL(`https://${apiBaseUrl}${path}`);

    const opts = {
      method,
      headers: getHeaders(credentials),
      body: data !== undefined ? JSON.stringify(data) : undefined,
    };

    if (options.logTraffic) {
      console.log(` > ${method} ${url.href}`);
    }

    const res = await fetch(url.href, opts);
    return getResult(res);
  };

  if (options.skipChannelLoad !== true) {
    const channelsResponse = await httpGet<Channel[]>(credentials, PATH_1_0_CHANNEL);

    if (!channelsResponse.success) {
      throw new Error(` > GET /1.0/channel -> ${channelsResponse.statusCode} '${channelsResponse.data as string}'`);
    }

    const selectedChannel =
      typeof channelPredicateOrApplicationName === 'string'
        ? channelsResponse.data.find((c) => c.application_name === channelPredicateOrApplicationName)
        : channelPredicateOrApplicationName(channelsResponse.data);

    if (selectedChannel === undefined) {
      throw new Error(
        `Did not find channel.  Available application names: {${channelsResponse.data.map((c) => c.application_name).join(',')}}`
      );
    }

    if (options.logTraffic) {
      console.log(
        ` > Found channel id: ${selectedChannel.id} with application name: '${selectedChannel.application_name}'`
      );
    }

    credentials.channelId = selectedChannel.id;
  } else {
    console.warn(' > channel load skipped.  All requests will be sent without a channel id.');
  }

  return {
    get sendingChannelIds(): boolean {
      return apiConfiguration.sendChannelId;
    },
    set sendChannelId(value: boolean) {
      apiConfiguration.sendChannelId = value;
    },

    /**
     * Useful to retrive cursor paths (ie: next) or header 'next-page'.  You should call like:
     *
     * `api.getPath<ExperimentalPagedResult<GetProductExperimentalResponse>>('/Product?cursor=H4sIAAA...')`
     *
     * NOTE: can be called without typings.  ie: `api.getPath('/Product?cursor=H4sIAAA...')`
     * @param path full path with leading slash
     * @returns response with expected typings you can provide.
     */
    getPath: async <T>(path: string) => {
      return await httpGet<T>(credentials, path);
    },
    getChannels: async () => {
      return await httpGet<Channel>(credentials, PATH_1_0_CHANNEL);
    },
    /**
     * Gets by *their* product id
     */
    getProductById: async (productId: number) => {
      const getProductResult = await httpGet<GetProduct1_0Result>(credentials, `${PATH_1_0_PRODUCT}/${productId}`);
      return getProductResult;
    },
    getProducts1_0: async (query?: GetProducts1_0QueryString) => {
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
    getProducts2_0: async (query?: GetProductQueryStrings) => {
      return await httpGet<GetProduct2_0Response[]>(credentials, PATH_2_0_PRODUCT, query);
    },
    /**
     * Note sure how this is different from /2.0/product.  Only notable difference is "barcodes" type from string to object.
     */
    getProductsExperimental: async (query?: Partial<GetProductQueryStrings>) => {
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
    getOrders: async (query?: Partial<GetOrdersQueryStrings>) => {
      return await httpGet<Order[]>(credentials, PATH_1_0_ORDER, query);
    },
    /**
     * Get one Shipment by Order Id and Shipment Id
     */
    getOneShipmentByOrderIdAndShipmentId: async (orderId: number, shipmentId: number) => {
      const path = `${PATH_1_0_ORDER}/${orderId}/shipment/${shipmentId}`;
      return await httpGet<OrderShipment>(credentials, path);
    },
    /**
     * Get one Shipment by Shipment Id
     */
    getOneShipment: async (shipmentId: number) => {
      const path = `${PATH_1_0_SHIPMENT}/${shipmentId}`;
      return await httpGet<OrderShipment>(credentials, path);
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
    registerWebhookSubscription: async (webhook: Omit<Webhook, 'id' | 'created_at'>) => {
      return await httpData<Webhook>(credentials, webhook, PATH_1_0_WEBHOOK, undefined);
    },
    /**
     * Can generate 500 response with data: "The wait operation timed out."  If so, check your channel id (or lack thereof) matches the subscription registration.
     *
     * NOTE: make sure the API is configured to send or not send the same as when you registered the webhook.
     *
     * @param id channelId from getWebhooks()
     * @returns
     */
    unregisterWebhookSubscription: async (id: number) => {
      return await httpData<Webhook>(credentials, undefined, `${PATH_1_0_WEBHOOK}/${id}`, 'DELETE');
    },
    getFulfillmentCenters: async () => {
      return await httpGet<FulfillmentCenter[]>(credentials, PATH_1_0_FULFILLMENT_CENTER);
    },
    createWarehouseReceivingOrder: async (request: WarehouseReceivingOrderRequest) => {
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
    listInventory: async (query?: Partial<ListInventoryQueryStrings>) => {
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
