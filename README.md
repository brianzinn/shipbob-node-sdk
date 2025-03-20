# ShipBob Node SDK
First of all there are no official SDKs for ShipBob.  I'm just dropping this here, in case it will speed up somebody else getting started using their API.

This library uses the built-in node.js fetch, so you'll want a newer node version with undici support.

Not really sure anybody will ever need this as many common platforms probably have integrations.  There are a couple of other community SDKs.  They do not have `/2.0/*` or `/experimental/*` endpoints:
 - [shipbob-sdk-python](https://github.com/community-phone-company/shipbob-sdk-python)
 - [shipbob-go](https://github.com/stryd/shipbob-go) - generated from Open API

NOTE: I did not notice until all this code was written that ShipBob had published an Open API spec :facepunch:.  You may have better luck generating your own client.  Maybe those generated typings at least belong here.
```bash
$ yarn generate:client
```
The included script using OpenAPI can generate clients in various languages.

This SDK exposes some endpoints not available in the OpenAPI including:
- `/2.0/receiving-extended`
- `/2.0/product`
- `/experimental/product` :skull:
- `/experimental/receiving` :skull:

Have a look in the `/test` folder.  You might like more something like PostMan, but you can run and debug these "tests" in VS Code.  You need a `.env` file with a Personal Access Token:
```
SHIPBOB_API_TOKEN=<redacted>
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
- :x: Get one Shipment by Order Id and Shipment Id
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
- :question: Get one Shipment by Shipment Id (webhooks are enough?)
- :question: Update a Shipment (marked with tracking information uploaded to a third-party system where the order originated)
- :question: Cancel one Shipment by Shipment Id
- :x: Cancel multiple Shipments by Shipment Id
- :x: Get one Shipment's status timeline by Shipment Id
- :x: Get logs for one Shipment by Shipment Id
- :question: Get shipping methods (hard-code shipping methods?)

## Products 1.0
- :heavy_check_mark: Get multiple products: api.getProducts1_0(...)
- :heavy_check_mark: Add a single product to the store: api.createProduct1_0(...)
- :x: Modify a single product (using 2.0 for additional properties)
- :x: Add multiple products to the store

## Products 2.0
These are not documented on the site yet:
- :heavy_check_mark: Get multiple products: api.getProducts2_0(...)
- :heavy_check_mark: Add a single product to the store: api.createProduct2_0(...)
- :heavy_check_mark: Modify a single product: api.updateProducts2_0(...)
- :x: Add multiple products to the store

## Products Experimental
Kindly note as it's experimental subject to change/removal :skull:
- :heavy_check_mark: Get multiple products: api.getProductsExperimental(...)
- :heavy_check_mark: Add a single product to the store: api.createProductExperimental(...)
- :heavy_check_mark: Modify a single product: api.updateProductsExperimental(...)
- :x: Add multiple products to the store

## Inventory
- [ ] Get an inventory item
- :heavy_check_mark: List inventory items: api.listInventory(...)
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
- :heavy_check_mark: Get Fulfillment Centers: api.getFulfillmentCenters()
- :heavy_check_mark: Get Warehouse Receiving Order: api.getWarehouseReceivingOrder(...)
- :heavy_check_mark: Get Warehouse Receiving Order Boxes: api.getWarehouseReceivingOrderBoxes(...)
- :x: Get Multiple Warehouse Receiving Orders (using receiving-extended instead)
- :heavy_check_mark: Create Warehouse Receiving Order: api.createWarehouseReceivingOrder(...)
- :x: Get Warehouse Receiving Order Box Labels
- :x: Cancel Warehouse Receiving Order (could be done manually, if needed?)
- :x: 5 x DEPRECATED '/1.0/receiving
  - Get Warehouse Receiving Order
  - Get a Warehouse Receiving Order by Purchase Order Number
  - Create Warehouse Receiving Order
  - Get Warehouse Receiving Order Box Labels 
  - Cancel Warehouse Receiving Order

## Receiving-Extended (not in API docs)
- :heavy_check_mark: Get Receiving Extended: api.getReceivingExtended(...) (will include this in a recipe that uses SetExternalSync)

## Receiving Experimental
Kindly note as it's experimental subject to change/removal :skull:

I'll try to share a recipe for using this for marking completed WROs.
- :heavy_check_mark: Receiving Set External Sync: api.experimentalReceivingSetExternalSync(...)

## Webhooks
- :heavy_check_mark: Get Webhooks: api.getWebhooks()
- :heavy_check_mark: Create a new webhook subscription: api.registerWebhookSubscription(...)
- :heavy_check_mark: Delete an existing webhook subscription: api.unregisterWebhookSubscription(...)

## Locations
- :x: Get locations

# Building locally
For making changes to this library locally - use `yarn link` to test out the changes easily.  This is useful if you would like to contribute.

# Testing
You can fake out this library itself, or otherwise mocking the ShipBob API http calls are quite easy to simulate with `nock`.  Here's a way to test creating an order verifying idempotent operation.

```javascript
// NOTE: nock > 14 is needed to mock underlying fetch calls
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