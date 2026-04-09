import assert from 'assert';

import * as dotenv from 'dotenv';

import { oAuthGetAccessToken, oAuthGetConnectUrl, oAuthRefreshAccessToken } from '../src/oAuth';
import { createAPI } from '../src';
import { ChannelsChannelViewModel } from '../src/client/2026-01/types.gen';
import { get202601Product } from '../src/client/2026-01/sdk.gen';

describe(' > ShipBob API tests', function shipBobAPITests() {
  beforeEach(async function beforeEach() {
    dotenv.config({
      path: './test/.env',
    });
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
      const url = process.env.SHIPBOB_API_URL as 'https://api.shipbob.com';

      const logAndFindChannel = (channels: ChannelsChannelViewModel[]) => {
        console.log(JSON.stringify(channels));
        const channel = channels.find((c) => c.application_name === OAUTH_APPLICATION_NAME);
        if (channel !== undefined) {
          console.log(` > channel found with scopes: {${channel.scopes?.join(', ')}}.`);
        }
        return channel;
      };

      const options = await createAPI(newToken, url, logAndFindChannel, {
        logTraffic: true,
      });
      const products = await get202601Product();
      assert.ok(!products.error, `request failed: ${JSON.stringify(products.error)}`);
      assert.ok(products.data);
      console.log(JSON.stringify(products.data));
      console.log(`found: ${products.data.items?.length} products (with channel)`);
      options.sendChannelId = false;
      const productsWithoutChannel = await get202601Product();
      assert.ok(!productsWithoutChannel.error, `request failed: ${JSON.stringify(productsWithoutChannel.error)}`);
      console.log(JSON.stringify(productsWithoutChannel.data.items));
      console.log(`found: ${productsWithoutChannel.data.items?.length} products (without channel)`);
    } else {
      console.error(refreshTokenResponse.text);
      assert.fail('boom shaka');
    }
  });

  /**
   * This test verifies that oAuth and PAT do not share a rate limit.
   * NOTE: It is not usable, sincen we switched to open API generated clients.
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

      // const newToken = refreshTokenResponse.payload.access_token;
      // const url = process.env.SHIPBOB_API_URL;

      // const logAndFindChannel = (channels: ChannelsChannelViewModel[]) => {
      //   console.log(JSON.stringify(channels));
      //   const channel = channels.find((c) => c.application_name === OAUTH_APPLICATION_NAME);
      //   if (channel !== undefined) {
      //     console.log(` > channel found with scopes: {${channel.scopes?.join(', ')}}.`);
      //   }
      //   return channel;
      // };

      // const oAuthAPI = await createShipBobApi(newToken, url, logAndFindChannel, {
      //   logTraffic: true,
      // });
      // const createApiFromPAT = async () => {
      //   const url = process.env.SHIPBOB_API_URL as 'https://api.shipbob.com';
      //   return await createAPI(process.env.SHIPBOB_API_TOKEN!, url, undefined, {
      //     logTraffic: true,
      //   });
      // };
      // const apiFromPAT = await createApiFromPAT();

      // for (let i = 0; i < 100; i++) {
      //   const productsPAT = await apiFromPAT.getProducts2_0();
      //   console.log(`> oAuth: ${i}:`, productsPAT.success, productsPAT.rateLimit.remainingCalls);

      //   const productsOAuth = await oAuthAPI.getProducts2_0();
      //   console.log(`> PAT: ${i}:`, productsOAuth.success, productsOAuth.rateLimit.remainingCalls);
      // }
    } else {
      console.error(refreshTokenResponse.text);
      assert.fail('boom shaka');
    }
  });
});
