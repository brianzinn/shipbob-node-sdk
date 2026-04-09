# ShipBob Node SDK

The ShipBob API is in a state of flux as their 1.0 and 2.0 API versions are set to be deprecated and according to their website their end of support is July 31, 2026 (as of April).
> After the end-of-support date, legacy versions will no longer be accessible.

First of all there are no official SDKs for ShipBob. I'm just dropping this here, in case it will speed up somebody else getting started using their API.

Originally I wrote a library that had endpoints not available in OpenAPI including:
- `/2.0/receiving-extended`
- `/2.0/product`
- `/experimental/product` :skull:
- `/experimental/receiving` :skull:

It was so cumbersome to keep up-to-date and their API versions are set to expire after 1 year, so it only makes sense to use their OpenAPI spec to generate a client.

The nice thing about this lib is that it uses tree-shaking, but it's not as friendly to use as the original version.  You will need to have a "POST" send the `body` and a "GET" will use `query`.  `path` will be needed when a parameter is part of the url.  So, you'll need to refer to the API to be able to use this.

<div align="center">
 <a href="https://www.npmjs.com/package/shipbob-node-sdk">
  <img alt="Weekly downloads" src="https://badgen.net/npm/dw/shipbob-node-sdk?color=blue" />
 </a>
</div>

## install

```bash
npm i shipbob-node-sdk
```

```bash
yarn add shipbob-node-sdk
```

```typescript
// create your client like this (return object has extra functions/objects)
const client = await createAPI('<your-token-here>', 'https://sandbox-api.shipbob.com');
// client is passed automatically
const productSearch = await get202601Product();
```

Have a look in the `/test` folder. You might like more something like PostMan, but you can run and debug these "tests" in VS Code. You need a `.env` file like this:

```bash
# for the PAT (Personal Access Token) login (recommended)
SHIPBOB_API_TOKEN=<redacted>
# for the oAuth login
SHIPBOB_CLIENT_ID=<redacted>
SHIPBOB_CLIENT_SECRET=<redacted>
# for the Web UI scraper (web.shipbob.com) login
SHIPBOB_WEB_UI_EMAIL=email@company.com
SHIPBOB_WEB_UI_PASSWORD=<redacted>
```

# API implementation
Everything is implemented except for the `/simulate/*` endpoints, which are not in OpenAPI.  You can look at the `/test/shipbob-api.simulate.spec.ts` to see how to call them.

I'll probably look at a way to have the client creation pick up the library version using a factory.  To start it's only `2026-01` version.

## Webhooks

As a personal note. I regret implementing webhooks at all, since I needed to implement polling anyway. There are various gaps in the webhooks. Using their table is perhaps the best way to explain:

| Shipment Status | Status Detail Name | Comment                                                                                         |
| --------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| Processing      | Labeled            | I think this maps to "order.shipped" webhook, doesn't always have tracking (or invoice amounts) |
| Completed       | Delivered          | Does not always fire when delivered (seems to be carrier dependent)                             |
| Completed       | Delivery Exception | No Webhook (need to poll for RTS, etc.)                                                         |
| Exception       | \*                 | These do fire, but are not useful for delivery                                                  |

ie: No webhooks for delivery exceptions ie: `Completed` -> `DeliveryException` when carrier needs more details. The `shipment_exception` webhook only applies to before the shipment leaves their FC (ie: inventory related issue).

Partial rows of table from here: _(https://developer.shipbob.com/#shipment-statuses)_

The typings of webhooks - i'll try to update those. It's basically an order and the status is known.  For some bizarre reason receiving has no webhooks.

## Follow URIs

This is not part of the API, but instead allows you to follow URI's returned in the API (see tests for examples). They use some kind of HATEOAS, but it's inconsistent across API versions.

:heavy_check_mark: Ols API versions retrieve a path from a provided resource ie: header `next-page`: `api.getPath<T>(response.headers['next-page'])`

latest version is part of JSON response:
```typescript
import { createAPI } from 'shipbob-node-sdk';
import { get202601Product } from 'shipbob-node-sdk/dist/client/2026-01';
import { type Get202601ProductResponses, type Get202601ProductErrors} from 'shipbob-node-sdk/dist/client/2026-01/types.gen';

const client = await createAPI('<your-token-here>', 'https://sandbox-api.shipbob.com', undefined, {
  logTraffic: true,
});
const productSearch = await get202601Product();
assert.ok(productSearch.data, 'should have data');
const { next } = productSearch.data;
assert.ok(next !== null && next !== undefined, 'should have more pages');
// you can get these types by clicking ie: `get202601Product` function and look at typings parameters.
const pagedResult = await client.get<Get202601ProductResponses, Get202601ProductErrors>(next);
assert.ok(pagedResult.data, 'should have paged data');
```
# Building locally

For making changes to this library locally - use `yarn link` to test out the changes easily. This is useful if you would like to contribute.
If you don't want an NPM dependency, it's easy to generate this yourself from OpenAPI spec and then just copy the index.ts file to your project.

NOTE: I did not notice until I had written a custom implementation that ShipBob had published an Open API spec :facepunch:.

```bash
# this is how the clients are generated (see scripts in package.json)
$ yarn generate:2026-01
```
# Testing

You can fake out this library itself, or otherwise mocking the ShipBob API http calls are quite easy to simulate with `nock`. Here's a way to test creating an order verifying idempotent operation.

```javascript
// NOTE: nock > 14 with undici is needed to mock underlying "fetch" calls
const CHANNELS_RESPONSE: ChannelsResponse = [{
  id: 1,
  application_name: 'SMA',
  name: 'test',
  scopes: []
}];

const nockScope = nock('https://sandbox-api.shipbob.com')
  .defaultReplyHeaders({ 'content-type': 'application/json' })
  .get('/1.0/channel')
  .once()
  .reply(200, JSON.stringify(CHANNELS_RESPONSE))
  .post('/1.0/order')
  .once()
  .reply(422, JSON.stringify({
    "": [
      "Cannot insert order with existing ReferenceId"
    ]
  }))
  .get('/1.0/order?ReferenceIds=123')
  .once()
  .reply(200, JSON.stringify([{
    id: 1,
    order_number: '18743683',
  }]))
  ;
...
assert.ok(nockScope.isDone(), 'should have completed nock requests');
```

# Adding more events

To replace what could be considered "missing" webhooks, such as WRO completed (Receiving has no webhooks!).

You can follow the section `How to sync WROs` for a more robust solution. Read on if you are interested in how this works, but also why it won't work!

If you want something more event driven, you can use the emails they send out with an inbound email processor:
ie:

```javascript
// this is done using Mandrill/Mailchimp Inbound mail processor:
for (const event of events) {
  const { subject } = event.msg;
  switch (subject) {
    case 'Your WRO is now complete':
      // ie: Your WRO 756713 is now complete and all associated inventory is ready to ship! ...
      //     https://web.shipbob.com/app/Merchant/#/inventory/receiving/756713/summary ...
      const match = /Your WRO (?<wro>\d+) is now complete/i.exec(event.msg.text);
      if (match === null || match.groups === undefined || !('wro' in match.groups)) {
        throw new Error(`cannot find wro in email '${taskStorageId}'`);
      }
      const wro = match.groups.wro;
      console.log(` Got it!  Received WRO# '${wro}'`);
      break;
    case 'Your box/pallet is now complete!':
      console.log(`Ignoring subject: '${subject}'`);
      break;
    default:
      console.log(`Unsupported subject: '${subject}'.`);
      break;
  }
}
```

You can publish that as an event or push to a queue and it will act as a "webhook".

**NOTE:** I discovered after writing the above inbound mail handler that a WRO you create may be split. ie: we created 1 WRO and it was split into 6 more WROs by the ShipBob team, so it's not really possible to link back to your system when that occurs.  Also, they have indicated to me there's no link on these WROs or UROs  (Unidentified Receiving Orders) that they create. There's no hierarchical relationship with the split WROs they are creating. In other words, you will need to implement polling anyway, so adding this is probably not worthwhile.

# OAuth

There is no S2S (server-to-server) oAuth. User intervention is required. There are only helper methods to help with that. You could bypass that with a webscraper (see next section).

- `oAuthGetConnectUrl()` direct an end user to follow the generated URL. Use `offline_access` as part of scope to get a refresh token.
- `oAuthGetAccessToken()` call this with the `code` query string fragment `https://yourname.ngrok.io/#code=...&id_token=...` the redirect_uri (and your client Id and secret from ShipBob App)
- `oAuthRefreshAccessToken()` call this with the last `refresh_token` you received, otherwise the same as `oAuthGetAccessToken()` without `code`.

The method to get/refresh access token both return `access_token`, so you provide that to `createShipBobApi(...)` with your application name.

If you create products with your API, you will not be able to see them with an oAuth app. I went down a big rabbit hole here - something to do with different channels. Try not to waste as much time as I did here and avoid using oAuth unless you are building actually an app IMO.

# Access APIs available to web.shipbob.com

The Web UI has a much broader set of unsupported APIs (ordersapi.shipbob.com, shippingservice.shipbob.com, merchantpricingapi.shipbob.com, etc.). For example, you cannot "patch" a WRO on the public receiving API, but you can somehow with a web login, so it unlocks extra functionality and has a separate rate limit from the API.
You would need to create a ShipBob account and then use those credentials to login with a scraper (see /src/WebScraper.ts). The account can only be logged with one session at a time. Look at `AuthScopesWeb` type and you can probably work backwards the scopes needed for each API. If you go this route then the peer dependency on puppeteer is not optional.

There is no documentation for these extra APIs - you can look through network tracing in the browser. See unit tests for full example:

```typescript
// scrape web.shipbob.com website:
import { getAccessTokenUI } from 'shipbob-node-sdk';

const authResponse = await getAccessTokenUI({
  email,
  password,
});

const missingChannelScope = authResponse.scopes.indexOf('channel_read') === -1;

const webUIAPI = await createShipBobApi(authResponse.accessToken, url, '<unused>', {
  skipChannelLoad: missingChannelScope,
});

const inventoryListResponse = await webUIAPI.listInventory({ Ids: [20104984] });
```

# Polling Orders for tracking

This is a suggested way to track orders from ShipBob. This may be better than using the webhook, sometimes the `order_shipped` webhook fires with no tracking information.

1. Poll GET `/2026-01/order?HasTracking=true&IsTrackingUploaded=false&startDate=03-25-2025`

```typescript
// right now for me I get error "An unexpected database error occurred. Please try again later", but it worked on 1.0 API
const result = await get202601Order({
  query: {
    HasTracking: true,
    IsTrackingUploaded: false,
    StartDate: '2025-03-25T14:15:22Z',
  },
});
```

2. Iterate through each order (and each shipment)
3. Sync the tracking back to your platform
4. Mark the order as shipped using this endpoint (https://developer.shipbob.com/api-docs/#tag/Orders/paths/~11.0~1shipment~1%7BshipmentId%7D/put). Or, you can mark it as shipped using the bulk mark as shipped endpoint (https://developer.shipbob.com/api-docs/#tag/Orders/paths/~11.0~1shipment~1:bulkUpdateTrackingUpload/post).

# How to sync WROs

Syncing WROs (Warehouse Receiving Orders) back to your system has 2 options.

## Option #1 - Simple (wait until the WRO status is Completed)

- Poll our GET WRO endpoint for WROs in Completed status:
  GET https://sandbox-api.shipbob.com/2026-01/receiving?Statuses=Completed&ExternalSync=false

```typescript
/**
 * this was /2.0/receiving-extended
 */
const response = await get202601Receiving({
  query: {
    Statuses: 'Completed',
    ExternalSync: false,
  },
});
```

- Iterate through each inventory id in the inventory_quantities array and sync the stowed_quantity back to your system
- Mark the WRO as synced (see below for the endpoint to use and sample request)
- Poll the GET WRO endpoint again and 442946 will no longer show up as you already synced this and ExternalSync is now set to true

Mark the WRO as synced (this is optional and a alternative option to continuously polling completed WROs that you may or may not know you have already synced)

```typescript
// use Ids from "getReceivingExtended" with ExternalSync: false.
const response = await post202601ReceivingSetExternalSync({
  body: {
    ids: [918363],
    is_external_sync: true,
  },
});
```

## Option #2 - Advanced (partial receiving)

- Poll GET WRO endpoint for WROs with statuses "processing" and "completed": https://sandbox-api.shipbob.com/2026-01/receiving?Statuses=Processing,Completed&ExternalSync=false.
```typescript
const response = await get202601Receiving({
  query: {
    Statuses: 'Processing',
    ExternalSync: false,
  },
});
```

**Note:** When initially testing you can remove the statuses from the query params, and you will see the default status of "AwaitingArrival" whenever a WRO is created. There is no sandbox simulation to move these forward.

- For each WRO, make a request to the Get Warehouse Receiving Order Boxes endpoint: https://sandbox-api.shipbob.com/2026-01/receiving/442997/boxes
- Iterate through each box
- Iterate through each item in the box_items array
- Sync the stowed_quantity for each item back to your system

# Synchronizing inventory levels

There are no webhooks or easy way to sync. Plus once you place an order there is a delay (~1 minute) before the inventory levels are impacted.

So, if you have one FC, you can use total_sellable_quantity for each inventory item.

For multiple FCs - their recommendation is to use for each FC the fulfillable_quantity and subtract the total_exception_quantity (since it could be assigned to either FC).

You can't do this anymore in `2026-01` - it will require 2 separate API calls inventory-levels and inventory-levels-location.  I'll try to update this - just trying to publish 202601.

```json
{
  "id": 1234,
  "name": "...",
  "total_fulfillable_quantity": 1688,
  "total_onhand_quantity": 1688,
  "total_committed_quantity": 0,
  "total_sellable_quantity": 1688,
  "total_exception_quantity": 0,
  "fulfillable_quantity_by_fulfillment_center": [
    {
      "id": 211,
      "name": "Fairburn (GA)",
      "fulfillable_quantity": 1688,
      "onhand_quantity": 1688,
      "committed_quantity": 0,
      "awaiting_quantity": 0,
      "internal_transfer_quantity": 0
    }
  ]
}
```
