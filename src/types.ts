import { OrdersShipmentViewModel } from './client/2025-07';
import { get202601OrderByOrderId, get202601ShipmentByShipmentId, OrdersOrderViewModel } from './client/2026-01';

/**
 * They list in the comment these are allowed, but API spec is a string.
 */
export type ProductType = 'Regular' | 'Bundle';

/**
 * NOTE: their spec returns wrong type
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

/**
 * Webhooks registered on older APIs continue to use legacy topics.
 *
 * NOTE: Webhook topics were renamed in 2025-07, so believe this will depend on how you registered.
 *       The underscore ones are legacy and dot ones are newer.
 */
export type WebhookResponsesByTopicLegacy =
  | {
      topic: 'order_shipped';
      payload: OrdersOrderViewModel;
    }
  | {
      topic: 'shipment_delivered';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Completed';
      };
    }
  | {
      topic: 'shipment_exception';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Exception';
      };
    }
  | {
      topic: 'shipment_onhold';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'OnHold';
      };
    }
  | {
      topic: 'shipment_cancelled';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Cancelled';
      };
    };

/**
 * This can be used to lookup (narrow type) of webhook contents based on the supplied "shipbob-topic" header.
 *
 * @since '2025-07
 */
export type WebhookResponsesByTopic202507 =
  | {
      topic: 'order.shipped';
      payload: OrdersOrderViewModel;
    }
  | {
      topic: 'shipment.delivered';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Completed';
      };
    }
  | {
      topic: 'shipment.exception';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Exception';
      };
    }
  | {
      topic: 'shipment.onhold';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'OnHold';
      };
    }
  | {
      topic: 'shipment.cancelled';
      payload: Omit<OrdersShipmentViewModel, 'status'> & {
        status: 'Cancelled';
      };
    };

/**
 * OAuth types here
 */
export type CreateOptions = {
  /**
   * console.log HTTP traffic (http verb + endpoint)
   */
  logTraffic?: boolean;
  /**
   * Setup if the API sends the channel.  You can alter/check this on the API object after API builder creation.
   */
  sendChannelId?: boolean;
  /**
   * Set to `true` to skip checking channels on init and/or are missing "channels_read" scope.
   *
   * ie: If you scrape web.shipbob.com with a web login, it will not have access to `/channels/1.0`
   */
  skipChannelLoad?: boolean;
  /**
   * Send these along with each request
   *
   * ie: You can send extra headers like User-Agent.  This may be needed to bypass cloudflare.
   */
  extraHeaders?: Record<string, string>;
};

/**
 * NOTE: no `channels_read`, so you'll need to use "skipChannelLoad" when creating an API from this.
 */
export type AuthScopesWeb =
  | 'openid'
  | 'profile'
  | 'email'
  | 'read'
  | 'write'
  | 'offline_access'
  | 'inboundManagement_read'
  | 'fulfillments_read'
  | 'orders_read'
  | 'orders_write'
  | 'orderstateapi_read'
  | 'receiving_read'
  | 'receiving_write'
  | 'returns_read'
  | 'returns_write'
  | 'addressValidation'
  | 'labeling_read'
  | 'shipment_tracking_read'
  | 'labeling_write'
  | 'inventory_read'
  | 'inventory_write'
  | 'channels_read'
  | 'locations_read'
  | 'locations_write'
  | 'workOrders_read'
  | 'workOrders_write'
  | 'powerBIconfig_read'
  | 'products_read'
  | 'pricing_read'
  | 'fulfillment_customization_write'
  | 'fulfillment_customization_read'
  | 'cartbob_write'
  | 'cartbob_read'
  | 'onboarding_read'
  | 'onboarding_write'
  | 'inventoryallocation_read'
  | 'internal_integrations_read'
  | 'internal_integrations_write'
  | 'internal_fulfillments_write'
  | 'fba_read'
  | 'fba_write'
  | 'pricing_write'
  | 'token_management'
  | 'products_write'
  | 'b2bpacking_read'
  | 'b2bpacking_write'
  | 'membership_read'
  | 'membership_write'
  | 'useraccounts_read'
  | 'useraccounts_write'
  | 'shippingservice_read'
  | 'inventory_views_read'
  | 'inventory_views_write';

/**
 * These are the scopes granted by generated OAuth clients
 */
export type AuthScopesAPI =
  | 'orders_read'
  | 'orders_write'
  | 'products_read'
  | 'products_write'
  | 'fulfillments_read'
  | 'inventory_read'
  | 'channels_read'
  | 'receiving_read'
  | 'receiving_write'
  | 'returns_read'
  | 'returns_write'
  | 'webhooks_read'
  | 'webhooks_write'
  | 'locations_read'
  | 'offline_access';

export type AuthorizeParametersCommon<T extends AuthScopesWeb | AuthScopesAPI> = {
  /**
   * Client id provided by site registration.
   */
  client_id: string;
  /**
   * The callback URI ShipBob will call after the user responds to the request for consent. Must match one of the provided values from site registration
   *
   * Your application must implement a GET endpoint callback to understand the URI fragment parameters `error`, `state`, `code`, `scope`
   */
  redirect_uri: string;
  /**
   * One or more scopes granted by step 1, space-separated.
   *
   * NOTE: if you want to take advantage of refresh tokens (aka offline access mode) you must additionally request the “offline_access” scope.
   */
  scope: T[];
  /**
   * Application-provided string to help prevent replay attacks. Echoed back to the application in the callback for validation.
   */
  state?: string;
};
/**
 * NOTE: These parameters must be URL encoded, particularly redirect_uri
 */
export type AuthorizeParametersAPI = {
  /**
   * If you include this query parameter with value form_post then we will make a POST request to your callback URL, instead of including the data as a fragment.
   */
  response_mode?: 'form_post';
  /**
   * A random string you can send and we will send it back within the token, to prevent replay attacks, code substitutions, etc.
   */
  nonce?: string;
  /**
   * Name of the integration for this particular user. We recommend that you know the user’s store name on your platform. If not provided, the user will be prompted to provide their name or choose one from a drop-down of options.
   */
  integration_name?: string;
} & AuthorizeParametersCommon<AuthScopesAPI>;

export type AuthorizeParametersWeb = {
  response_type?: 'code';
  code_challenge: string;
  code_challenge_method: 'S256';
  shipbob_response_mode?: 'query';
} & AuthorizeParametersCommon<AuthScopesWeb>;

/**
 * Existing registration
 */
export type SimulationResponse = {
  /**
   * The unique identifier of the simulation run.
   */
  simulation_id: string;
  /**
   * Optional message about the submitted simulation.
   */
  message: string;
};

export type Simulation = {
  /**
   * The name of the action performed in the simulation (for example: ShipOrder, DeliverOrder).
   */
  action: 'ShipOrder' | 'DeliverOrder';
  /**
   * The scheduled time for the action to run, in ISO 8601 date-time format (UTC).
   */
  schedule_time: string;
  /**
   * The current execution state of the action.
   */
  status: string;
  /**
   * Additional details about the action status, such as progress information or an error message.
   */
  message: string;
  /**
   * The status for the next action in the sequence, if actions are chained.
   */
  next: null | Simulation;
};

/**
 * The simulation status
 */
export type SimulationStatusResponse = {
  /**
   * The unique identifier of the simulation run.
   */
  simulation_id: string;
  /**
   * The identifier of the entity the simulation is associated with (for example: shipment id).
   */
  entity_id: string;
  /**
   * The type of entity the simulation is associated with (for example: Order).
   */
  entity_type: string;
  /**
   * The current status of the simulation action(s), including any chained next actions.
   */
  simulation: Simulation;
};
