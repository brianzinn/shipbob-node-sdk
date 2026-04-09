import * as dotenv from 'dotenv';
import assert from 'assert';
import { createAPI, PackagingMaterial, PackagingRequirement, ReturnAction } from '../src';
import type { SimulationResponse } from '../src/types';
import {
  delete202601WebhookById,
  get202601FulfillmentCenter,
  get202601Inventory,
  get202601InventoryLevel,
  get202601InventoryLevelLocations,
  get202601Order,
  get202601OrderByOrderIdShipmentByShipmentId,
  get202601Product,
  get202601Receiving,
  get202601ReceivingById,
  get202601ReceivingByIdBoxes,
  get202601ShipmentByShipmentId,
  get202601ShippingMethod,
  get202601Webhook,
  Options,
  post202601Order,
  post202601OrderByOrderIdCancel,
  post202601Product,
  post202601Receiving,
  post202601ReceivingSetExternalSync,
  post202601Webhook,
} from '../src/client/2026-01/sdk.gen';

import {
  Get202601ProductErrors,
  Get202601ProductResponses,
  Post202601OrderData,
  WebhooksTopics,
} from '../src/client/2026-01/types.gen';

describe(' > ShipBob API 2026-01 tests', function shipBobAPI202601Tests() {
  type ApiCreateResponseType = Awaited<ReturnType<typeof createAPI>>;

  let client: ApiCreateResponseType;

  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env',
    });

    const baseUrl = process.env.SHIPBOB_API_URL ?? 'https://sandbox-api.shipbob.com';
    client = await createAPI(process.env.SHIPBOB_API_TOKEN!, baseUrl as 'https://sandbox-api.shipbob.com', undefined, {
      logTraffic: true,
    });
  });

  it('get inventory', async function test() {
    const { data, error } = await get202601Inventory({
      query: {
        InventoryIds: [21705372, 21705365].join(','),
        PageSize: '2',
      },
    });

    assert.ok(!error, `request failed: ${JSON.stringify(error)}`);
    assert.ok(data);
  });

  // SoryBy at least onHand gives error "Key mapping for -onHand is missing", so
  // that is probably the inventory-level API endpoint now.
  it('get inventory with sorting', async function test() {
    const response = await get202601Inventory({
      query: {
        // SortBy: '-onHand' // error
        PageSize: '2',
      },
    });
    assert.ok(response.data, 'should succeed');
    assert.strictEqual(2, response.data.items?.length, 'should have found exactly 2 products');
  });

  it('get inventory levels', async function test() {
    const { data, error } = await get202601InventoryLevel({
      query: {
        InventoryIds: [21705372, 21705365].join(','),
        PageSize: '2',
      },
    });

    assert.ok(!error, `request failed: ${JSON.stringify(error)}`);
    assert.ok(data);
  });

  it('get inventory levels by location', async function test() {
    const { data, error } = await get202601InventoryLevelLocations({
      query: {
        InventoryIds: [21705372, 21705365].join(','),
        PageSize: '2',
      },
    });

    assert.ok(!error, `request failed: ${JSON.stringify(error)}`);
    assert.ok(data);
  });

  it.skip('place a warehouse receiving order', async function test() {
    const result = await post202601Receiving({
      body: {
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
      },
    });
    assert.ok(result.data, 'should succeed');
    assert.strictEqual(201, result.response.status, 'should have created the WRO');
    assert.strictEqual(1, result.data.id, 'should error out with WRO id');
  });

  it.skip('mark WRO as synced', async function test() {
    // get these Ids from "getReceivingExtended" with ExternalSync: false.
    const response = await post202601ReceivingSetExternalSync({
      body: {
        ids: [918363],
        is_external_sync: true,
      },
    });
    // NOTE: this is wrong.  it's response.data.results, which is an array.
    assert.ok(response.data, 'should succeed');
    assert.strictEqual(1, response.data.id, 'should have set exactly 1 as synced');
  });

  it('get WROs completed and not synced (was /receiving-extended)', async function test() {
    /**
     * this was /2.0/receiving-extended
     */
    const response = await get202601Receiving({
      query: {
        Statuses: 'Completed',
        ExternalSync: false,
      },
    });
    assert.ok(response.data, 'should succeed');
    assert.deepEqual({}, response.data, 'this will never match');
  });

  it('get WRO boxes', async function test() {
    const response = await get202601ReceivingByIdBoxes({
      path: {
        id: '925128',
      },
    });
    assert.ok(response.data, 'should succeed');
    assert.strictEqual(1, response.data.length, 'should have exactly 1 box');
  });

  it('get WRO', async function test() {
    const response = await get202601ReceivingById({
      path: {
        id: '925128',
      },
    });
    assert.ok(response.data, 'should succeed');
    assert.strictEqual(925128, response.data.id, 'should have found and matched ID');
  });

  it('get WROs', async function test() {
    const response = await get202601Receiving({
      query: {
        Page: '1',
      },
    });
    assert.ok(response.data, 'should succeed');
    assert.deepEqual({}, response.data, 'this will never match');
  });

  it('get webhooks', async function test() {
    const results = await get202601Webhook();
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(200, results.response.status, 'expected a created status code');
    assert.ok(results.data.items, 'should have webhook items');
    results.data.items.forEach((wh) => console.log(` > ${wh.topics} @ '${wh.url}'`));
    assert.strictEqual(
      5,
      results.data.items.length,
      'current list mismatch (all shipment webhooks should be registered)'
    );
  });

  // NOTE: webhook topics were renamed at some point.  Likley when 'returns' were added.
  // They migrated them at some point without letting us know, since retrieving has new topic strings.
  // ie: shipment_delivered -> shipment.delivered
  it.skip('unregister ALL webhooks', async function test() {
    const results = await get202601Webhook();
    assert.ok(results.data, 'should succeed');
    client.options.sendChannelId = false; // api defaults to `true`.
    for (const webhook of results.data.items!) {
      console.log(` > unregistering '${webhook.topics}' @ ${webhook.url}`);
      assert.ok(webhook.id, 'webhook should have an Id');
      const unregisterResult = await delete202601WebhookById({
        path: {
          id: webhook.id.toString(),
        },
      });
      assert.strictEqual(200, unregisterResult.response.status, 'should have 200 OK (no data is returned)');
    }
  });

  it.skip('register webhook(s)', async function test() {
    // choose the topics you would like to register for.
    client.options.sendChannelId = false; // api defaults to `true`.

    const topics: WebhooksTopics[] = [
      'order.shipped',
      'order.shipment.cancelled',
      'order.shipment.delivered',
      'order.shipment.exception',
      'order.shipment.on_hold',
    ];

    for (const topic of topics) {
      const result = await post202601Webhook({
        body: {
          topics: [topic],
          url: 'https://<redacted>',
        },
      });
      assert.ok(result.data, 'should succeed');
      assert.strictEqual(201, result.response.status, 'expected a 200 status code that topic was created');
      console.log('created webhook for topic with id:', result.data.id);
    }
  });

  it('get fulfillment centers', async function test() {
    const results = await get202601FulfillmentCenter();
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(200, results.response.status, 'expected a created status code');
    assert.deepEqual(6, results.data.length, 'current list mismatch');
  });

  it('get one shipment by shipmentId', async function test() {
    const result = await get202601ShipmentByShipmentId({
      path: {
        shipmentId: '247349089',
      },
    });
    assert.ok(result.data, 'should succeed');
    assert.strictEqual(result.response.status, 200, 'expected an OK status code');
    assert.strictEqual(result.data.status, 'Cancelled', 'should be marked as "Completed"');
  });

  it('get one shipment by orderId and shipmentId', async function test() {
    // const response = await api.getOneShipmentByOrderIdAndShipmentId(240765630, 247159563);
    const result = await get202601OrderByOrderIdShipmentByShipmentId({
      path: {
        orderId: '240765630',
        shipmentId: '247159563',
      },
    });
    assert.ok(result.data, 'should succeed');
    assert.strictEqual(result.response.status, 200, 'expected an OK status code');
    assert.strictEqual(result.data.status, 'Completed', 'should be marked as "Completed"');
  });

  // An unexpected database error occurred. Please try again later
  it('search orders', async function test() {
    const result = await get202601Order({
      query: {
        HasTracking: true,
        IsTrackingUploaded: false,
        StartDate: '2025-03-25T14:15:22Z',
      },
    });
    assert.ok(result.data, 'should succeed');
    assert.strictEqual(200, result.response.status, 'expected an OK status code');
    assert.deepEqual(50, result.data.length, 'current list mismatch');
  });

  it('get shipping methods', async function test() {
    const results = await get202601ShippingMethod();
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(200, results.response.status, 'expected a created status code');
    assert.strictEqual(7, results.data.length, 'current list mismatch');
  });

  /**
   * This is for running on their sandbox.  You can simulate some orders are shipped/delivered.
   * In their sandbox there are no webhooks, but I recall they can manually trigger webhooks.
   */
  it.skip('shipbob API: place an order and cancel/ship/deliver afterwards', async function test() {
    // const order: Omit<Options<Post202601OrderData, false>, 'headers'> = {
    const order: Options<Post202601OrderData, false> = {
      headers: {
        shipbob_channel_id: '---',
      },
      body: {
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
            name: 'test', // not required in 1.0
            reference_id: '100', // weird this works - it should be SKU?
            quantity: 1,
          },
        ],
        reference_id: '112',
        order_number: '112',
        type: 'DTC',
      },
    };
    const results = await post202601Order(order);
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(201, results.response.status, 'expected a created status code');
    assert.ok(results.data.shipments, 'should have shipments (array)');
    assert.ok(results.data.shipments.length > 0, 'should have at least one shipment.');

    for (const shipment of results.data.shipments) {
      const rand = Math.random();
      /**
       * ~ 20% of orders are cancelled
       * ~ 40% of orders are marked as delivered (via simulation API - after 1 minute)
       * ~ 40% of orders are marked as shipped (via simulation API - after 1 minute)
       */
      if (rand < 0.2) {
        const orderId = results.data.id!;
        const cancelResult = await post202601OrderByOrderIdCancel({
          path: {
            orderId: orderId.toString(),
          },
        });
        console.log(`Order id: ${orderId} has been cancelled`, cancelResult.data);
      } else {
        // NOTE: simulate is not part of their open API spec, so we use the client.post directly.
        const action = rand > 0.8 ? 'DeliverOrder' : 'ShipOrder';
        console.log(` > should '${action}' shipment: ${shipment.id}`);
        const simulateResult = await client.post<{ 200: SimulationResponse }>('/simulate/shipment', {
          shipment_id: shipment.id,
          simulation: {
            action,
            delay: 1 /* delay for 1 minute */,
          },
        });
        if (simulateResult.data) {
          console.log(` > simulate sent: '${simulateResult.data.simulation_id}'`);
        }
      }
    }
  });

  it.skip('shipbob API: place an order', async function test() {
    const results = await post202601Order({
      headers: {
        shipbob_channel_id: 'test',
      },
      body: {
        order_number: 'TEST2',
        products: [
          {
            name: 'suddenly we need this',
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
      },
    });
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(201, results.response.status, 'expected a created status code');
    assert.strictEqual(1, results.data, 'should have created an order');
  });

  it('get products', async function test() {
    const skuList = ['730822604864', '730822604796'];

    const { data, error } = await get202601Product({
      query: {
        SKU: `any:${skuList.join(',')}`,
      },
    });

    assert.ok(!error, `request failed: ${JSON.stringify(error)}`);
    assert.ok(data);

    const items = data.items ?? [];
    const missing = skuList.filter((sku) => {
      return !items.some((item) => item.variants?.some((v) => v.sku === sku));
    });
    console.log('missing on shipbob:', missing.join(','));
  });

  it('get products (paging)', async function test() {
    const productSearch = await get202601Product();
    console.log('product search:', productSearch);

    assert.ok(productSearch.data, 'should have data');
    const { next } = productSearch.data;
    assert.ok(next !== null && next !== undefined, 'should have more pages');
    // you can get these types by clicking ie: `get202601Product` function and look at typings parameters.
    const pagedResult = await client.get<Get202601ProductResponses, Get202601ProductErrors>(next);
    assert.ok(pagedResult.data, 'should have paged data');
    const items = pagedResult.data.items;
    assert.ok(items, 'should have found items');
    assert.strictEqual(items.length, 50, 'should have 50 more products');
    assert.ok(items[0].id, 'product should have an ID');
    assert.ok(items[0].variants, 'should have variants');
    const firstVariant = items[0].variants[0];
    assert.ok(firstVariant, 'should have found a variant');
    assert.ok(firstVariant.sku, 'variant should have a SKU'); // i think this is the reference_id from 1.0
  });

  it('get inventory for a SKU - logic for per FC inventory', async function test() {
    const skuList = ['730822604864', '730822604796', '824442849719'];
    const productSearch = await get202601Product({
      query: { SKU: `any:${skuList.join(',')}` },
    });

    const products: {
      sku: string;
      inventoryId: number;
      exceptionQuantity: number;
      fulfillmentCenters: {
        id: number;
        availableQuantity: number;
      }[];
    }[] = [];

    let items = productSearch.data?.items!;
    assert.ok(items, 'should have items');
    for (const item of items) {
      assert.ok(item.variants, 'must have variants');
      const firstVariant = item.variants[0];
      const inventory = firstVariant.inventory;
      assert.ok(firstVariant.sku, 'should have a SKU');
      assert.ok(inventory, 'variant should have inventory');
      assert.ok(inventory.inventory_id, 'variant should have an inventory Id');
      products.push({
        sku: firstVariant.sku,
        inventoryId: inventory.inventory_id,
        exceptionQuantity: 0,
        fulfillmentCenters: [],
      });
    }

    const inventoryIds = products.map((p) => p.inventoryId);

    const inventoryLevelResponse = await get202601InventoryLevel({
      query: { InventoryIds: inventoryIds.join(',') },
    });

    const inventoryLevelItems = inventoryLevelResponse.data?.items;

    assert.ok(inventoryLevelItems, 'should have inventory level items');

    for (const inventoryLevel of inventoryLevelItems) {
      const product = products.find((p) => p.inventoryId === inventoryLevel.inventory_id);
      assert.ok(product, 'should always find a product (not vice-versa');
      assert.ok(
        inventoryLevel.total_exception_quantity !== undefined,
        'should have an exception quantity (zero is falsey)'
      );
      product.exceptionQuantity = inventoryLevel.total_exception_quantity;
    }

    const inventoryLevelLocationsResponse = await get202601InventoryLevelLocations({
      query: { InventoryIds: inventoryIds.join(',') },
    });

    const inventoryLevelLocationsItems = inventoryLevelLocationsResponse.data?.items;
    assert.ok(inventoryLevelLocationsItems, 'should have location items');

    // NOTE: some products have no inventory levels
    for (const inventoryLevelLocation of inventoryLevelLocationsItems) {
      const product = products.find((p) => p.inventoryId === inventoryLevelLocation.inventory_id);
      assert.ok(product, 'should find a product always');
      assert.ok(inventoryLevelLocation.locations, 'should have locations');

      for (const fc of inventoryLevelLocation.locations) {
        assert.ok(fc.location_id, 'should have a location id');
        assert.ok(fc.fulfillable_quantity !== undefined, 'should have a fulfillable quantity (zero is falsey)');
        product.fulfillmentCenters.push({
          availableQuantity: fc.fulfillable_quantity,
          id: fc.location_id,
        });
      }
    }

    assert.deepEqual(
      products,
      [
        {
          sku: '730822604864',
          inventoryId: 21705372,
          exceptionQuantity: 0,
          fulfillmentCenters: [],
        },
        {
          sku: '730822604796',
          inventoryId: 21705365,
          exceptionQuantity: 0,
          fulfillmentCenters: [
            {
              availableQuantity: 0,
              id: 1,
            },
          ],
        },
        {
          sku: '824442849719',
          inventoryId: 21705190,
          exceptionQuantity: 0,
          fulfillmentCenters: [
            {
              availableQuantity: 0,
              id: 2,
            },
            {
              availableQuantity: 23,
              id: 1,
            },
          ],
        },
      ],
      'should match exactly'
    );
  });

  it.skip('create products', async function test() {
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

        const result = await post202601Product({
          body: {
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
          },
        });

        if (result.data) {
          console.log(` > Created: ${result.data.id}`);
          if (typeof result.data.id !== 'number') {
            throw new Error(`Response did not have an ID: ${JSON.stringify(result)}`);
          }
        } else {
          if (result.response.status === 422) {
            // this will happen if you re-run this test.
            // 422 duplicate is OK here.  Should have a breakpoint here to decide if we want to continue.
            // message will be: {"ReferenceId":["Cannot insert duplicate reference id: 889608212462"]}'
            console.warn('expected error:', JSON.stringify(result.data));
          } else {
            console.error('Error found', result.response.status, result.data);
          }
        }
      } catch (e) {
        console.error(e);
      }

      console.timeEnd('single-duration');
    }
    console.timeEnd('total-duration');
  });

  it.skip('get and update a product - ensure it is setup for lot', async function test() {
    const sku = '824442849719';
    const results = await get202601Product({ query: { SKU: sku } });
    assert.ok(results.data, 'should succeed');
    const items = results.data.items;
    assert.ok(items, 'should have items');
    assert.strictEqual(1, items.length, 'should have found exactly 1 product');
    const variants = items[0].variants;
    assert.ok(variants, 'should have variants');
    assert.strictEqual(1, variants.length, 'should have found exactly 1 variant');
    const variant = variants[0];
    const productId = variant.id;

    console.log(`Found product: ${productId} with one variant: ${variant.id}`);

    const isLot = variant.lot_information?.is_lot;

    // we want this to check for 'true' actually
    if (isLot === undefined || isLot === true) {
      console.log(' > not setup for lot date based picking');
      const updateResult = await post202601Product({
        body: {
          variants: [
            {
              sku,
              // id: variant.id,
              lot_information: {
                is_lot: false, // we switched off this
                // minimum_shelf_life_days: null,
              },
              fulfillment_settings: {
                serial_scan: {
                  is_enabled: true,
                  prefix: '01',
                },
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
          ],
        },
      });

      console.log('update result:', updateResult);
      assert.ok(updateResult.data);
    }
  });
});
