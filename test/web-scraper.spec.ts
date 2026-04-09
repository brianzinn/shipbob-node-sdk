import assert from 'assert';

import * as dotenv from 'dotenv';
import { createAPI } from '../src';
import { get202601InventoryLevelLocations } from '../src/client/2026-01/sdk.gen';
import { getAccessTokenUI } from '../src/WebScraper';

/**
 * API tests (readonly - write tests are skipped).
 */
describe.skip(' > ShipBob web scraper tests', function shipBobAPITests() {
  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env',
    });
  });

  it('shipbob UI + API: web UI auth + API inv/products', async function test() {
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

    const missingChannelScope = authResponse.scopes.indexOf('channels_read') === -1;
    console.log(` > missing channels_read scope: ${missingChannelScope}`);

    // Available application names: {ShipBob,SMA}
    await createAPI(authResponse.accessToken, 'https://api.shipbob.com', 'SMA', {
      logTraffic: true,
      skipChannelLoad: missingChannelScope,
      extraHeaders: {
        origin: 'https://web.shipbob.com',
        referer: 'https://web.shipbob.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0',
        'accept-language': 'en-US',
      },
    });

    console.log(' ** retrieving inventory via web scraper access token');
    const { data, error } = await get202601InventoryLevelLocations({
      query: {
        InventoryIds: [21705372, 21705365].join(','),
        PageSize: '2',
      },
    });

    assert.ok(!error, `request failed: ${JSON.stringify(error)}`);
    assert.ok(data);
  });
});
