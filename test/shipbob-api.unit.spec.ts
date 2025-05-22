import * as dotenv from 'dotenv';

import {
  Channel,
  createShipBobApi,
  ExperimentalPagedResult,
  GetProduct1_0Result,
  GetProductExperimentalResponse,
  PackagingMaterial,
  PackagingRequirement,
  ReturnAction,
  WebhookTopic,
} from '../src';
import { oAuthGetAccessToken, oAuthGetConnectUrl, oAuthRefreshAccessToken } from '../src/oAuth';
import assert from 'assert';
import { getAccessTokenUI } from '../src/WebScraper';

/**
 * tests that create entities (WRO/Product/Order) are skipped.
 */
describe(' > ShipBob API tests', function shipBobAPITests() {
  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env',
    });
  });

  // it's async, because it gets the channels and looks for 'SMA' account.
  const createApiFromPAT = async () => {
    const url = process.env.SHIPBOB_API_URL;
    return await createShipBobApi(process.env.SHIPBOB_API_TOKEN, url, undefined, {
      logTraffic: true,
    });
  };

  it('shipbob API: get products (experimental)', async function test() {
    const api = await createApiFromPAT();
    const skuList = ['123', '456'];
    const productSearch = await api.getProductsExperimental({ sku: `any:${skuList.join(',')}` });
    console.log('product search:', productSearch);
  });

  it('shipbob API: get products (experimental)', async function test() {
    const api = await createApiFromPAT();
    const productSearch = await api.getProductsExperimental();
    console.log('product search:', productSearch);

    assert.ok(productSearch.success);
    const { next } = productSearch.data;
    assert.ok(next !== null, 'should have more pages');
    const result = await api.getPath<ExperimentalPagedResult<GetProductExperimentalResponse>>(`/experimental${next}`);
    console.log('result', result);
  });

  it.skip('shipbob API: create products', async function test() {
    const api = await createApiFromPAT();

    const products = [
      {
        sku: '100',
        barcode: '100100',
        name: 'Product 100',
      },
      {
        sku: '101',
        barcode: '101101',
        name: 'Product 101',
      },
    ];

    console.time('total-duration');

    for (const product of products) {
      console.time('single-duration');

      try {
        // const result = await api.createProduct1_0({
        //   barcode: product.barcode,
        //   name: product.name,
        //   reference_id: product.sku,
        //   sku: product.sku,
        // });

        const result = await api.createProductExperimental({
          type_id: 1,
          name: product.name,
          variants: [
            {
              name: product.name,
              lot_information: {
                is_lot: true,
                minimum_shelf_life_days: null,
              },
              barcodes: [
                {
                  value: product.barcode,
                  sticker_url: null,
                },
                {
                  value: '12345678',
                  sticker_url: null,
                },
              ],
              packaging_material_type_id: PackagingMaterial.Box,
              packaging_requirement_id: PackagingRequirement['No Requirements'],
              return_preferences: {
                primary_action_id: ReturnAction.Quarantine,
                backup_action_id: null,
                // 'Looks like instructions must be null, if you select Quarantine as primary.',
                instructions: null,
                return_to_sender_primary_action_id: ReturnAction.Restock,
                return_to_sender_backup_action_id: ReturnAction.Quarantine,
              },
              sku: product.barcode,
            },
          ],
        });

        if (result.success) {
          console.log(` > Created: ${result.data.id}`);
          if (typeof result.data.id !== 'number') {
            throw new Error(`Response did not have an ID: ${JSON.stringify(result)}`);
          }
        } else {
          if (result.statusCode === 422) {
            // this will happen if you re-run this test.
            // 422 duplicate is OK here.  Should have a breakpoint here to decide if we want to continue.
            // message will be: {"ReferenceId":["Cannot insert duplicate reference id: 889608212462"]}'
            console.warn('expected error:', JSON.stringify(result.data));
          } else {
            console.error('Error found', result.statusCode, result.data);
          }
        }
      } catch (e) {
        console.error(e);
      }

      console.timeEnd('single-duration');
    }
    console.timeEnd('total-duration');
  });

  it('shipbob API: get a product 1.0 by reference Id', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getProducts1_0({ ReferenceIds: '100' });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data, 'should have found exactly 1 product');
  });

  it('shipbob API: get all 1.0 products', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getProducts1_0();
    assert.ok(results.success, 'should succeed');
    assert.ok('next-page' in results.headers);
    const next = results.headers['next-page'];
    const nextProducts = await api.getPath<GetProduct1_0Result[]>(next);
    assert.ok(nextProducts.success);
    assert.ok(nextProducts.data.length > 0);
    assert.strictEqual(nextProducts.data[0].id, 836990721, 'this will fail, but shows strong typing from "getPath"');
  });

  it('shipbob API: get a 2.0 products - ensure it is setup for lot', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getProducts2_0();
    assert.ok(results.success, 'should succeed');
  });

  it.skip('shipbob API: get a 2.0 products - ensure it is setup for lot', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getProducts2_0({ sku: '100' });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have found exactly 1 product');
    assert.strictEqual(1, results.data[0].variants.length, 'should have found exactly 1 variant');
    const variant = results.data[0].variants[0];
    const productId = results.data[0].id;

    console.log(`Found product: ${productId} with one variant: ${variant.id}`);

    // we want this to check for 'true' actually
    if (variant.lot_information?.is_lot !== undefined) {
      console.log(' > not setup for lot date based picking');
      const updateResult = await api.updateProduct2_0(productId, [
        {
          id: variant.id,
          lot_information: {
            is_lot: true,
            minimum_shelf_life_days: null,
          },
          packaging_material_type_id: PackagingMaterial.Box,
          packaging_requirement_id: PackagingRequirement['No Requirements'],
          return_preferences: {
            primary_action_id: ReturnAction.Quarantine,
            backup_action_id: null,
            instructions: null,
            return_to_sender_primary_action_id: ReturnAction.Quarantine,
            return_to_sender_backup_action_id: null,
          },
        },
      ]);
      console.log('update result:', updateResult);
      assert.ok(updateResult.success);
    }
  });

  it.skip('shipbob API: place an order', async function test() {
    const api = await createApiFromPAT();
    const results = await api.placeOrder({
      order_number: 'TEST2',
      products: [
        {
          reference_id: '100',
          quantity: 1,
        },
      ],
      recipient: {
        name: 'John Doe',
        address: {
          address1: '100 Nowhere Blvd',
          address2: 'Suite 100',
          city: 'Gotham City',
          state: 'NJ',
          country: 'US',
          zip_code: '07093',
        },
        email: null,
        // phone_number: '555-555-5555'
      },
      retailer_program_data: {
        purchase_order_number: 'TEST2',
        retailer_program_type: 'TEST',
      },
      reference_id: 'TEST2',
      shipping_method: 'Standard',
      shipping_terms: {
        carrier_type: 'Parcel',
        payment_term: 'Prepaid',
      },
      type: 'DropShip',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(201, results.statusCode, 'expected a created status code');
    assert.strictEqual(1, results.data, 'should have created an order');
  });

  it.skip('shipbob API: place an order and cancel/ship/deliver afterwards', async function test() {
    const api = await createApiFromPAT();
    const results = await api.placeOrder({
      shipping_method: 'Standard',
      recipient: {
        name: 'John Doe',
        address: {
          address1: '100 Nowhere Blvd',
          city: 'Gotham City',
          state: 'NJ',
          country: 'US',
          zip_code: '07093',
        },
        email: 'john@example.com',
        phone_number: '555-555-5555',
      },
      products: [
        {
          reference_id: '100',
          quantity: 1,
        },
      ],
      reference_id: '112',
      order_number: '112',
      type: 'DTC',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(201, results.statusCode, 'expected a created status code');

    assert.ok(results.data.shipments.length > 0, 'should have at least one shipment.');

    for (const shipment of results.data.shipments) {
      const rand = Math.random();
      /**
       * ~ 20% of orders are cancelled
       * ~ 40% of orders are marked as delivered (via simulation API - after 1 minute)
       * ~ 40% of orders are marked as shipped (via simulation API - after 1 minute)
       */
      if (rand < 0.2) {
        const orderId = results.data.id;
        const cancelResult = await api.cancelSingleOrderByOrderId(orderId);
        console.log(`Order id: ${orderId} has been cancelled`, cancelResult.success);
      } else {
        const action = rand > 0.8 ? 'DeliverOrder' : 'ShipOrder';
        const simulateResult = await api.simulateShipment({
          shipment_id: shipment.id,
          simulation: {
            action,
            delay: 1 /* delay for 1 minute */,
          },
        });
        if (simulateResult.success) {
          console.log(` > simulate sent: '${simulateResult.data.simulation_id}'`);
        }
      }
    }
  });

  it('shipbob API: get shipping methods', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getShippingMethods();
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected a created status code');
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it('shipbob API: get webhooks', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getWebhooks();
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected a created status code');
    results.data.forEach((wh) => console.log(` > ${wh.topic} @ '${wh.subscription_url}'`));
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it.skip('shipbob API: unregister ALL webhooks', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getWebhooks();
    assert.ok(results.success, 'should succeed');
    api.sendChannelId = false; // api defaults to `true`.
    for (const webhook of results.data) {
      console.log(` > unregistering '${webhook.topic}' @ ${webhook.subscription_url}`);
      const unregisterResult = await api.unregisterWebhookSubscription(webhook.id);
      console.log('unregister result:', unregisterResult.success);
    }
  });

  it.skip('shipbob API: register webhook(s)', async function test() {
    const api = await createApiFromPAT();

    // choose the topics you would like to register for.
    api.sendChannelId = false; // api defaults to `true`.
    for (const topic of [
      WebhookTopic.OrderShipped,
      WebhookTopic.ShipmentCancelled,
      WebhookTopic.ShipmentDelivered,
      WebhookTopic.ShipmentException,
      WebhookTopic.ShipmentOnHold,
    ]) {
      const results = await api.registerWebhookSubscription({
        topic,
        subscription_url: 'https://<redacted>',
      });
      assert.ok(results.success, 'should succeed');
      assert.strictEqual(201, results.statusCode, 'expected a 200 status code that topic was created');
      console.log('created webhook for topic:', results.data.topic);
    }
  });

  it('shipbob API: get orders', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getOrders({
      HasTracking: true,
      IsTrackingUploaded: false,
      StartDate: '03-25-2025',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected an OK status code');
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it('shipbob API: get one shipment by orderId and shipmentId', async function test() {
    const api = await createApiFromPAT();
    const response = await api.getOneShipmentByOrderIdAndShipmentId(240765630, 247159563);
    assert.ok(response.success, 'should succeed');
    assert.strictEqual(response.statusCode, 200, 'expected an OK status code');
    assert.strictEqual(response.data.status, 'Completed', 'should be marked as "Completed"');
  });

  it.skip('shipbob API: get one shipment by shipmentId', async function test() {
    const api = await createApiFromPAT();
    const response = await api.getOneShipment(247349089);
    assert.ok(response.success, 'should succeed');
    assert.strictEqual(response.statusCode, 200, 'expected an OK status code');
    assert.strictEqual(response.data.status, 'Completed', 'should be marked as "Completed"');
  });

  it('shipbob API: get fulfillment centers', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getFulfillmentCenters();
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected a created status code');
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it('shipbob API: get inventory', async function test() {
    const api = await createApiFromPAT();
    const results = await api.listInventory({
      Sort: '-onHand',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: place a warehouse receiving order', async function test() {
    const api = await createApiFromPAT();
    const results = await api.createWarehouseReceivingOrder({
      fulfillment_center: {
        // Moreno Valley (CA) is what staging seems to be using.  8 is ok, too
        // More details on their API docs
        id: 10,
      },
      purchase_order_number: 'PO-123',
      box_packaging_type: 'MultipleSkuPerBox',
      boxes: [
        {
          tracking_number: 'TRACK-1234',
          box_items: [
            {
              inventory_id: 8588331,
              quantity: 25,
            },
          ],
        },
      ],
      expected_arrival_date: '2025-02-19T15:00:00Z',
      package_type: 'Pallet',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(201, results.statusCode, 'should have created the WRO');
    assert.strictEqual(1, results.data, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: simulation - deliver an order (by shipment)', async function test() {
    const api = await createApiFromPAT();
    const results = await api.simulateShipment({
      shipment_id: 103744163,
      simulation: {
        action: 'DeliverOrder',
      },
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(201, results.statusCode, 'should have created the simulation');
    assert.strictEqual(1, results.data, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: simulation - ship an order (by shipment)', async function test() {
    const api = await createApiFromPAT();
    const results = await api.simulateShipment({
      shipment_id: 103759193,
      simulation: {
        action: 'ShipOrder',
        delay: 5 /* minutes */,
      },
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'should have created the simulation');
  });

  it('shipbob API: getsimulation', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getSimulationStatus('3150fa20-4cbf-4e08-9de3-dac60c5bed41');
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'should have retrieved the simulation');
    assert.strictEqual({}, results.data, 'should have found exactly 1 simulation');
  });

  it('shipbob API: get completed not synced', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getReceivingExtended({
      Statuses: 'Completed',
      ExternalSync: false,
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have found exactly 1 not marked as synced');
  });

  it.skip('shipbob API: mark WRO as synced', async function test() {
    const api = await createApiFromPAT();
    // get these Ids from "getReceivingExtended" with ExternalSync: false.
    const results = await api.experimentalReceivingSetExternalSync([443001], true);
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.results.length, 'should have set exactly 1 as synced');
  });

  it('shipbob API: get WRO boxes', async function test() {
    const api = await createApiFromPAT();
    const results = await api.getWarehouseReceivingOrderBoxes(443001);
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have exactly 1 box');
  });

  it('shipbob API: get WRO', async function test() {
    const api = await createApiFromPAT();
    // get these Ids from "getReceivingExtended" with ExternalSync: false.
    const results = await api.getWarehouseReceivingOrder(443002);
    assert.ok(results.success, 'should succeed');
    assert.deepEqual({}, results.data, 'this will never match');
  });

  it.skip('shipbob UI + API: web UI auth + API inv/products', async function test() {
    const url = process.env.SHIPBOB_API_URL;
    const email = process.env.SHIPBOB_WEB_UI_EMAIL;
    const password = process.env.SHIPBOB_WEB_UI_PASSWORD;

    if (email === undefined || password === undefined) {
      assert.fail('email or password are not set in .env');
    }

    // scrape web.shipbob.com website:
    const authResponse = await getAccessTokenUI(
      {
        email,
        password,
      },
      60
    );

    assert.ok(authResponse.success, 'expecting the authentication to succeed');

    const missingChannelScope = authResponse.scopes.indexOf('channel_read') === -1;
    console.log(` > missing channels_read scope: ${missingChannelScope}`);

    const webUIAPI = await createShipBobApi(authResponse.accessToken, url, '<unused>', {
      logTraffic: true,
      skipChannelLoad: missingChannelScope,
      extraHeaders: {
        origin: 'https://web.shipbob.com',
        referer: 'https://web.shipbob.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
        'accept-language': 'en-US',
      },
    });

    const inventoryListResponse = await webUIAPI.listInventory({ Ids: [20104984] });
    assert.ok(inventoryListResponse.success);
    assert.strictEqual(1, inventoryListResponse.data.length);
    assert.strictEqual(20104984, inventoryListResponse.data[0].id);

    const productsExperimentalResponse = await webUIAPI.getProductsExperimental();
    assert.ok(productsExperimentalResponse.success);

    const products1Response = await webUIAPI.getProducts1_0();
    assert.ok(products1Response.success);
  });

  const OAUTH_REDIRECT_URI = 'https://yourname.ngrok.io';

  /**
   * NOTE: Get the "code" from the redirect URI - you can use it in the next test.
   */
  it.skip('shipbob API: oAuth authentication retrieve URL', async function test() {
    const authUrl = oAuthGetConnectUrl({
      client_id: process.env.SHIPBOB_CLIENT_ID!,
      redirect_uri: OAUTH_REDIRECT_URI,
      scope: [
        'orders_read',
        'orders_write',
        'products_read',
        'products_write',
        'fulfillments_read',
        'inventory_read',
        'channels_read',
        'receiving_read',
        'receiving_write',
        'returns_read',
        'returns_write',
        'webhooks_read',
        'webhooks_write',
        'locations_read',
        'offline_access',
      ],
      integration_name: 'your app name',
    });
    assert.ok(authUrl !== '', 'should have a URL');
  });

  /**
   * Copy the `code` from the redirect here:
   */
  it.skip('shipbob API: connect OAuth "code" from callback (authorization)', async function test() {
    const clientId = process.env.SHIPBOB_CLIENT_ID;
    assert.ok(clientId !== undefined, '"SHIPBOB_CLIENT_ID" env is missing (the one for your ShipBob app)');
    const clientSecret = process.env.SHIPBOB_CLIENT_SECRET;
    assert.ok(
      clientSecret !== undefined,
      '"SHIPBOB_CLIENT_SECRET" env is missing (only available when you created the app)'
    );
    const codeFromRedirect = 'FCEF80C84B4C3CFB10C099B69B7261BC3A227C0E9798DEC9E1DAB4767CEF57C1-1';
    const getAccessTokenResponse = await oAuthGetAccessToken(
      OAUTH_REDIRECT_URI,
      clientId,
      clientSecret,
      codeFromRedirect
    );

    if (getAccessTokenResponse.success !== true) {
      assert.fail(`Failed to get access token: ${getAccessTokenResponse.text}`);
    }
    if ('error' in getAccessTokenResponse.payload) {
      assert.fail(`Error: ${getAccessTokenResponse.payload.error}`);
    }
    console.log('access token:', getAccessTokenResponse.payload.access_token);
    console.log('store this refresh token:', getAccessTokenResponse.payload.refresh_token);
  });

  // copy this from your first call to get an access token or otherwise the last request to refresh (with 'offline_access' scope)
  const REFRESH_TOKEN = '269A4AADFB041993AA785AEB9B2B26DEF9AFD31261B422269A73DFBF07F0C00C-1';
  // You set this up in ShipBob.  Make sure this is "application_name" and not "name" (or update the predicate)
  const OAUTH_APPLICATION_NAME = 'your App Name goes here';

  /**
   * ^^ Update REFRESH_TOKEN after running this
   */
  it.skip('shipbob API: connect OAuth to refresh (authorization)', async function test() {
    const clientId = process.env.SHIPBOB_CLIENT_ID;
    assert.ok(clientId !== undefined, '"SHIPBOB_CLIENT_ID" env is missing (the one for your ShipBob app)');
    const clientSecret = process.env.SHIPBOB_CLIENT_SECRET;
    assert.ok(
      clientSecret !== undefined,
      '"SHIPBOB_CLIENT_SECRET" env is missing (only available when you created the app)'
    );
    const refreshTokenResponse = await oAuthRefreshAccessToken(
      OAUTH_REDIRECT_URI,
      clientId,
      clientSecret,
      REFRESH_TOKEN
    );

    if (refreshTokenResponse.success) {
      if ('error' in refreshTokenResponse.payload) {
        console.error(refreshTokenResponse.payload.error);
        assert.fail('error');
      }

      console.log('replace REFRESH_TOKEN with:', refreshTokenResponse.payload.refresh_token);
      const newToken = refreshTokenResponse.payload.access_token;
      const url = process.env.SHIPBOB_API_URL;

      const logAndFindChannel = (channels: Channel[]) => {
        console.log(JSON.stringify(channels));
        const channel = channels.find((c) => c.application_name === OAUTH_APPLICATION_NAME);
        if (channel !== undefined) {
          console.log(` > channel found with scopes: {${channel.scopes.join(', ')}}.`);
        }
        return channel;
      };

      const oAuthAPI = await createShipBobApi(newToken, url, logAndFindChannel, {
        logTraffic: true,
      });
      const products = await oAuthAPI.getProducts2_0();
      assert.ok(products.success);
      console.log(JSON.stringify(products.headers));
      console.log(JSON.stringify(products.data));
      console.log(`found: ${products.data.length} products (with channel)`);
      oAuthAPI.sendChannelId = false;
      const productsWithoutChannel = await oAuthAPI.getProducts2_0();
      assert.ok(productsWithoutChannel.success);
      console.log(JSON.stringify(productsWithoutChannel.headers));
      console.log(JSON.stringify(productsWithoutChannel.data));
      console.log(`found: ${productsWithoutChannel.data.length} products (without channel)`);
    } else {
      console.error(refreshTokenResponse.text);
      assert.fail('boom shaka');
    }
  });

  /**
   * This test verifies that oAuth and PAT do not share a rate limit.
   *
   * > GET: https://api.shipbob.com/2.0/product
   * > Headers: "Authorization:Bearer <redacted>,Content-Type:application/json,Accept:application/json,User-Agent:shipbob-node-sdk,shipbob_channel_id:123"
   * > oAuth: 99: true 49
   * > GET: https://api.shipbob.com/2.0/product
   * > Headers: "Authorization:Bearer <redacted>,Content-Type:application/json,Accept:application/json,User-Agent:shipbob-node-sdk,shipbob_channel_id:456"
   * > PAT: 99: true 49
   *
   * NOTE: ^^ Update REFRESH_TOKEN after running this
   */
  it.skip('shipbob API: test OAuth vs. PAT do not share rate limit', async function test() {
    const clientId = process.env.SHIPBOB_CLIENT_ID;
    assert.ok(clientId !== undefined, '"SHIPBOB_CLIENT_ID" env is missing (the one for your ShipBob app)');
    const clientSecret = process.env.SHIPBOB_CLIENT_SECRET;
    assert.ok(
      clientSecret !== undefined,
      '"SHIPBOB_CLIENT_SECRET" env is missing (only available when you created the app)'
    );
    const refreshTokenResponse = await oAuthRefreshAccessToken(
      OAUTH_REDIRECT_URI,
      clientId,
      clientSecret,
      REFRESH_TOKEN
    );

    if (refreshTokenResponse.success) {
      if ('error' in refreshTokenResponse.payload) {
        console.error(refreshTokenResponse.payload.error);
        assert.fail('error');
      }

      console.log('replace REFRESH_TOKEN with:', refreshTokenResponse.payload.refresh_token);

      const apiFromPAT = await createApiFromPAT();

      const newToken = refreshTokenResponse.payload.access_token;
      const url = process.env.SHIPBOB_API_URL;

      const logAndFindChannel = (channels: Channel[]) => {
        console.log(JSON.stringify(channels));
        const channel = channels.find((c) => c.application_name === OAUTH_APPLICATION_NAME);
        if (channel !== undefined) {
          console.log(` > channel found with scopes: {${channel.scopes.join(', ')}}.`);
        }
        return channel;
      };

      const oAuthAPI = await createShipBobApi(newToken, url, logAndFindChannel, {
        logTraffic: true,
      });

      for (let i = 0; i < 100; i++) {
        const productsPAT = await apiFromPAT.getProducts2_0();
        console.log(`> oAuth: ${i}:`, productsPAT.success, productsPAT.rateLimit.remainingCalls);

        const productsOAuth = await oAuthAPI.getProducts2_0();
        console.log(`> PAT: ${i}:`, productsOAuth.success, productsOAuth.rateLimit.remainingCalls);
      }
    } else {
      console.error(refreshTokenResponse.text);
      assert.fail('boom shaka');
    }
  });
});
