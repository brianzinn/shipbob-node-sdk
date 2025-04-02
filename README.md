# ShipBob Node SDK
First of all there are no official SDKs for ShipBob.  I'm just dropping this here, in case it will speed up somebody else getting started using their API.

This library uses the built-in node.js fetch, so you'll want a newer node version with undici support.

This SDK exposes some endpoints not available in the OpenAPI including:
- `/2.0/receiving-extended`
- `/2.0/product`
- `/experimental/product` :skull:
- `/experimental/receiving` :skull:

Have a look in the `/test` folder.  You might like more something like PostMan, but you can run and debug these "tests" in VS Code.  You need a `.env` file like this:
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

# API implementation progress

## Legend
:x: = I haven't needed this

:heavy_check_mark: = implemented

- [ ] = intend to add

:question: = might add support soon - under investigation

## Orders
- :x: Estimate Fulfillment Cost For Order
- :question: Get Order - don't see the point of this endpoint, unless you store their Ids
- :heavy_check_mark: Get Orders: api.getOrders(...)
- :heavy_check_mark: Create Order: api.placeOrder(...)
- :heavy_check_mark: Cancel single Order by Order ID: api.cancelSingleOrderByOrderId()
- :x: Get Order Store Json
- :x: Save the Store Order Json (The JSON that represent the order on the Third Party Source)
- :heavy_check_mark: Get one Shipment by Order Id and Shipment Id: `api.getOneShipmentByOrderIdAndShipmentId(...)`
- :x: Cancel one Shipment by Order Id and Shipment Id
- :x: Get one Shipment's status timeline by Order Id and Shipment Id
- :question: Get all Shipments for Order
- :x: Get logs for one Shipment by Order Id and Shipment Id
- :x: Get one Shipment by Shipment Id
- :x: Update a Shipment
- :x: Cancel one Shipment by Shipment Id
- :x: Cancel multiple Shipments by Shipment Id
- :x: Get one Shipment's status timeline by Shipment Id
- :x: Get logs for one Shipment by Shipment Id
- :heavy_check_mark: Get shipping methods: api.getShippingMethods()

## Shipments
Turns out the webhooks aren't reliable, so polling is needed to get shipment information.
1. `order_shipped` webhook can fire without tracking details
2. `shipment_delivered` webhook may not be sent. Additionally, exceptions (return to sender) have no webhook.

- :heavy_check_mark: Get one Shipment by Shipment Id: `api.getOneShipment()`
- :x: Update a Shipment (marked with tracking information uploaded to a third-party system where the order originated)
- :question: Cancel one Shipment by Shipment Id
- :x: Cancel multiple Shipments by Shipment Id
- :x: Get one Shipment's status timeline by Shipment Id
- :x: Get logs for one Shipment by Shipment Id
- :heavy_check_mark: Get shipping methods: `api.getShippingMethods()`

## Products 1.0
- :heavy_check_mark: Get multiple products: `api.getProducts1_0(...)`
- :heavy_check_mark: Add a single product to the store: `api.createProduct1_0(...)`
- :x: Modify a single product (using 2.0 for additional properties)
- :x: Add multiple products to the store

## Products 2.0
These are not documented on the site yet:
- :heavy_check_mark: Get multiple products: `api.getProducts2_0(...)`
- :heavy_check_mark: Add a single product to the store: `api.createProduct2_0(...)`
- :heavy_check_mark: Modify a single product: `api.updateProducts2_0(...)`
- :x: Add multiple products to the store

## Products Experimental
Kindly note as it's experimental subject to change/removal :skull:
- :heavy_check_mark: Get multiple products: `api.getProductsExperimental(...)`
- :heavy_check_mark: Add a single product to the store: `api.createProductExperimental(...)`
- :heavy_check_mark: Modify a single product: `api.updateProductsExperimental(...)`
- :x: Add multiple products to the store

## Inventory
- [ ] Get an inventory item
- :heavy_check_mark: List inventory items: `api.listInventory(...)`
- :x: Get a list of inventory items by product id (we don't know product_id)

## Channels
- :heavy_check_mark: Get user-authorized channel info: not in api, but used on init

## Returns
- :question: Get Return Order
- :question: Modify Return Order
- :question: Get Return Orders
- :question: Create Return Order
- :question: Cancel Return Order
- :question: Get One Return's status history

## Receiving
- :heavy_check_mark: Get Fulfillment Centers: `api.getFulfillmentCenters()`
- :heavy_check_mark: Get Warehouse Receiving Order: `api.getWarehouseReceivingOrder(...)`
- :heavy_check_mark: Get Warehouse Receiving Order Boxes: `api.getWarehouseReceivingOrderBoxes(...)`
- :x: Get Multiple Warehouse Receiving Orders (using receiving-extended instead)
- :heavy_check_mark: Create Warehouse Receiving Order: `api.createWarehouseReceivingOrder(...)`
- :x: Get Warehouse Receiving Order Box Labels
- :x: Cancel Warehouse Receiving Order (could be done manually, if needed?)
- :x: 5 x DEPRECATED '/1.0/receiving
  - Get Warehouse Receiving Order
  - Get a Warehouse Receiving Order by Purchase Order Number
  - Create Warehouse Receiving Order
  - Get Warehouse Receiving Order Box Labels 
  - Cancel Warehouse Receiving Order

## Receiving-Extended (not in API docs)
- :heavy_check_mark: Get Receiving Extended: `api.getReceivingExtended(...)` (will include this in a recipe that uses SetExternalSync)

## Receiving Experimental
Kindly note as it's experimental subject to change/removal :skull:

I'll try to share a recipe for using this for marking completed WROs.
- :heavy_check_mark: Receiving Set External Sync: `api.experimentalReceivingSetExternalSync(...)`

## Webhooks
- :heavy_check_mark: Get Webhooks: api.getWebhooks()
- :heavy_check_mark: Create a new webhook subscription: `api.registerWebhookSubscription(...)`
- :heavy_check_mark: Delete an existing webhook subscription: `api.unregisterWebhookSubscription(...)`

## Locations
- :x: Get locations

## follow URIs
This is not part of the API, but instead allows you to follow URI's returned in the API (see tests for examples)
- :heavy_check_mark: Retrive a path from a provided resource ie: header `next-page`: `api.getPath<T>(response.headers['next-page'])`

# Building locally
For making changes to this library locally - use `yarn link` to test out the changes easily.  This is useful if you would like to contribute.

# Other options
Not really sure anybody will ever need this as many common platforms probably have integrations.  There are a couple of other community SDKs.  They do not have `/2.0/*` or `/experimental/*` endpoints:
 - [shipbob-sdk-python](https://github.com/community-phone-company/shipbob-sdk-python)
 - [shipbob-go](https://github.com/stryd/shipbob-go) - generated from Open API

NOTE: I did not notice until all this code was written that ShipBob had published an Open API spec :facepunch:.  You may have better luck generating your own client.  Maybe those generated typings at least belong here.
```bash
$ yarn generate:client
```
The included script using OpenAPI can generate clients in various languages.

# Testing
You can fake out this library itself, or otherwise mocking the ShipBob API http calls are quite easy to simulate with `nock`.  Here's a way to test creating an order verifying idempotent operation.

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

You can create a monitor using polling with api.experimentalReceivingSetExternalSync(...).

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
      const match = /Your WRO (?<wro>\d+) is now complete/i.exec(
        event.msg.text
      );
      if (
        match === null ||
        match.groups === undefined ||
        !('wro' in match.groups)
      ) {
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

# OAuth
There is no S2S (server-to-server) oAuth.  User intervention is required.  There are only helper methods to help with that.  You could bypass that with a webscraper (see next section).
- `oAuthGetConnectUrl()` direct an end user to follow the generated URL.  Use 'offline_access' as part of scope to get a refresh token.
- `oAuthGetAccessToken()` call this with the `code` query string fragment `https://yourname.ngrok.io/#code=...&id_token=...` the redirect_uri (and your client Id and secret from ShipBob App)
- `oAuthRefreshAccessToken()` call this with the last `refresh_token` you received, otherwise the same as `oAuthGetAccessToken()` without `code`.

The method to get/refresh access token both return `access_token`, so you provide that to `createShipBobApi(...)` with your application name.

If you create products with your API, you will not be able to see them with an oAuth app.  I went down a big rabbit hole here - something to do with different channels.  Try not to waste as much time as I did here and avoid using oAuth unless you are building actually an app.

# Access APIs available to web.shipbob.com
The Web UI has a much broader set of unsupported APIs (ordersapi.shipbob.com, shippingservice.shipbob.com, merchantpricingapi.shipbob.com, etc.). For example, you cannot "patch" a WRO on the public receiving API, but you can somehow with a web login, so it unlocks extra functionality and has a separate rate limit from the API.
You would need to create a ShipBob account and then use those credentials to login with a scraper (see /src/WebScraper.ts).  The account can only be logged with one session at a time.  Look through AuthScopesWeb.ts you can probably work backwards the scopes needed for each API.

There is no documentation for these extra APIs - you can look through network tracing in the browser.  See unit tests for full example:
```typescript
// scrape web.shipbob.com website:
const authResponse = await getAccessTokenUI({
  email,
  password
});

const missingChannelScope = authResponse.scopes.indexOf("channel_read") === -1;

const webUIAPI = await createShipBobApi(authResponse.accessToken, url, '<unused>', {
  skipChannelLoad: missingChannelScope,
});

const inventoryListResponse = await webUIAPI.listInventory({ Ids: [20104984] });
```

# Polling Orders for tracking
This is a suggested way to track orders from ShipBob.  This may be better than using the webhook, sometimes the `order_shipped` webhook fires with no tracking information.
1. Poll GET `/1.0/order?HasTracking=true&IsTrackingUploaded=false&startDate=03-25-2025`
```typescript
const results = await api.getOrders({
  HasTracking: true,
  IsTrackingUploaded: false,
  StartDate: '03-25-2025'
});
```
2. Iterate through each order (and each shipment)
3. Sync the tracking back to your platform
4. Mark the order as shipped using this endpoint (https://developer.shipbob.com/api-docs/#tag/Orders/paths/~11.0~1shipment~1%7BshipmentId%7D/put). Or, you can mark it as shipped using the bulk mark as shipped endpoint (https://developer.shipbob.com/api-docs/#tag/Orders/paths/~11.0~1shipment~1:bulkUpdateTrackingUpload/post).

**NOTE:** `PUT`/`POST` to `/1.0/shipment` not implemented in this library yet.

# How to sync WROs (Warehouse Receiving Orders) back to your system
There are 2 options to do this:

## Option #1 - Simple (wait until the WRO status is Completed)

- Poll our GET WRO endpoint for WROs in Completed status:
GET  https://sandbox-api.shipbob.com/2.0/receiving-extended?Statuses=Completed&ExternalSync=false
```typescript
// with this library
const results = await api.getReceivingExtended({
      Statuses: 'Completed',
      ExternalSync: false,
    });
```
- Iterate through each inventory id in the inventory_quantities array and sync the stowed_quantity back to your system
- Mark the WRO as synced (see below for the endpoint to use and sample request)
- Poll the GET WRO endpoint again and 442946 will no longer show up as you already synced this and ExternalSync is now set to true


Mark the WRO as synced (this is optional and a alternative option to continuously polling completed WROs that you may or may not know you have already synced)

POST https://sandbox-api.shipbob.com/experimental/receiving/:set-external-sync
```json
{
    "ids": [442946],
    "is_external_sync": true
}
```
```typescript
// with this library
// use Ids from "getReceivingExtended" with ExternalSync: false.
const results = await api.experimentalReceivingSetExternalSync([443001], true);
```

## Option #2 - Advanced (partial receiving)

- Poll our GET WRO endpoint for WROs with statuses "processing" and "completed": https://sandbox-api.shipbob.com/2.0/receiving-extended?Statuses=Processing,Completed&ExternalSync=false.

**Note:** When initially testing you can remove the statuses from the query params, and you will see the default status of "AwaitingArrival" whenever a WRO is created. There is no sandbox simulation to move these forward.

- For each WRO, make a request to the Get Warehouse Receiving Order Boxes endpoint: https://sandbox-api.shipbob.com/2.0/receiving/442997/boxes
- Iterate through each box
- Iterate through each item in the box_items array
- Sync the stowed_quantity for each item back to your system
