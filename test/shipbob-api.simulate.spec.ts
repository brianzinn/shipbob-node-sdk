import assert from 'assert';

import * as dotenv from 'dotenv';

import { createAPI, type SimulationStatusResponse, type SimulationResponse } from '../src';

describe.skip(' > ShipBob API tests /simulate (not part of open API spec)', function shipBobAPITests() {
  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env',
    });

    client = await createAPI(process.env.SHIPBOB_API_TOKEN!, 'https://sandbox-api.shipbob.com', undefined, {
      logTraffic: true,
    });
  });

  type ApiCreateResponseType = Awaited<ReturnType<typeof createAPI>>;
  let client: ApiCreateResponseType;

  it('shipbob API: simulation - deliver an order (by shipment)', async function test() {
    const results = await client.post<{ 200: SimulationResponse }>('/simulate/shipment', {
      shipment_id: 103744163,
      simulation: {
        action: 'DeliverOrder',
        delay: 1,
      },
    });

    assert.ok(results.data, 'should succeed');
    assert.ok(results.data.simulation_id, 'should have a simulation id');
    assert.strictEqual(200, results.response.status, 'should have created the simulation');
  });

  it('shipbob API: simulation - ship an order (by shipment)', async function test() {
    const results = await client.post<{ 200: SimulationResponse }>('/simulate/shipment', {
      shipment_id: 103759193,
      simulation: {
        action: 'ShipOrder',
        delay: 5 /* minutes */,
      },
    });
    assert.ok(results.data, 'should succeed');
    assert.ok(results.data.simulation_id, 'should have a simulation id');
    assert.strictEqual(200, results.response.status, 'should have created the simulation');
  });

  it('shipbob API: get simulation status', async function test() {
    const results = await client.get<{ 200: SimulationStatusResponse }>(
      '/simulate/status/da0ee66a-30c9-47bd-a15a-1bf8722e7c93'
    );
    assert.ok(results.data, 'should succeed');
    assert.strictEqual(results.data.entity_type, 'Order', 'should have a simulation entity matching');
    assert.strictEqual(200, results.response.status, 'should have retrieved the simulation');
  });
});
