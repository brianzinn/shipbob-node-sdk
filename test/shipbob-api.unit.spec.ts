import * as dotenv from 'dotenv';

import { createShipBobApi, WebhookTopic } from '../src';
import assert from 'assert';

/**
 * tests that create entities (WRO/Product/Order) are skipped.
 */
describe(' > ShipBob API tests', function shipBobAPITests() {
  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env'
    });
  });

  // it's async, because it gets the channels and looks for 'SMA' account.
  const getApi = async () => {
    return await createShipBobApi(process.env.SHIPBOB_API_TOKEN);
  }

  it.skip('shipbob API: create products', async function test() {
    const api = await getApi();

    const products = [{
      sku: '100',
      barcode: '100100',
      name: 'Product 100'
    }, {
      sku: '101',
      barcode: '101101',
      name: 'Product 101'
    }]

    console.time('total-duration');

    for (const product of products) {
      console.time('single-duration');

      try {
        const result = await api.addProduct({
          barcode: product.barcode,
          name: product.name,
          reference_id: product.sku,
          sku: product.sku
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

  it('shipbob API: get a product by reference Id', async function test() {
    const api = await getApi();
    const results = await api.getProducts({ ReferenceIds: '100' });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: place an order', async function test() {
    const api = await getApi();
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
        retailer_program_type: 'KITS',
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
    const api = await getApi();
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

  it('shipbob API: get webhooks', async function test() {
    const api = await getApi();
    const results = await api.getWebhooks();
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected a created status code');
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it.skip('shipbob API: register webhook', async function test() {
    const api = await getApi();
    // order_shipped, WebhookTopic.ShipmentCancelled
    for (const topic of [WebhookTopic.ShipmentDelivered, WebhookTopic.ShipmentException, WebhookTopic.ShipmentOnHold]) {
      const results = await api.createWebhookSubscription({
        topic,
        subscription_url:
          'https://<redacted>',
      });
      assert.ok(results.success, 'should succeed');
      assert.strictEqual(201, results.statusCode, 'expected a 200 status code that topic was created');
      console.log('created webhook for topic:', results.data.topic);
    }
  });

  it('shipbob API: get fulfillment centers', async function test() {
    const api = await getApi();
    const results = await api.getFulfillmentCenters();
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'expected a created status code');
    assert.deepEqual([], results.data, 'current list mismatch');
  });

  it('shipbob API: get inventory', async function test() {
    const api = await getApi();
    const results = await api.listInventory({
      Sort: '-onHand',
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: place a warehouse receiving order', async function test() {
    const api = await getApi();
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
    const api = await getApi();
    const results = await api.simulateShipment({
      shipment_id: 103744163,
      simulation: {
        action: 'DeliverOrder',
      },
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(201, results.statusCode, 'should have created the WRO');
    assert.strictEqual(1, results.data, 'should have found exactly 1 product');
  });

  it.skip('shipbob API: simulation - ship an order (by shipment)', async function test() {
    const api = await getApi();
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
    const api = await getApi();
    const results = await api.getSimulationStatus('3150fa20-4cbf-4e08-9de3-dac60c5bed41');
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(200, results.statusCode, 'should have retrieved the simulation');
    assert.strictEqual({}, results.data, 'should have found exactly 1 simulation');
  });

  it('shipbob API: get completed not synced', async function test() {
    const api = await getApi();
    const results = await api.getReceivingExtended({
      Statuses: 'Completed',
      ExternalSync: false,
    });
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have found exactly 1 not marked as synced');
  });

  it.skip('shipbob API: mark WRO as synced', async function test() {
    const api = await getApi();
    // get these Ids from "getReceivingExtended" with ExternalSync: false.
    const results = await api.experimentalReceivingSetExternalSync([443001], true);
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.results.length, 'should have set exactly 1 as synced');
  });

  it('shipbob API: get WRO boxes', async function test() {
    const api = await getApi();
    const results = await api.getWarehouseReceivingOrderBoxes(443001);
    assert.ok(results.success, 'should succeed');
    assert.strictEqual(1, results.data.length, 'should have exactly 1 box');
  });

  it('shipbob API: get WRO', async function test() {
    const api = await getApi();
    // get these Ids from "getReceivingExtended" with ExternalSync: false.
    const results = await api.getWarehouseReceivingOrder(443002);
    assert.ok(results.success, 'should succeed');
    assert.deepEqual({}, results.data, 'this will never match');
  });
});
