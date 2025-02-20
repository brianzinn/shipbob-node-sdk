# ShipBob Node SDK
First of all there are no official SDKs for ShipBob.  I'm just dropping this here, in case it will speed up somebody else getting started using their API.

These is just a starting point for anybody looking to integrate ShipBob into a Node.js application.

It uses the built-in node.js fetch.

This is not an official or supported library.  If you extend or have any issues kindly open a PR.  Not really sure anybody will ever need this as most common platforms probably have built-in support.

NOTE: I did not notice until all this code was written that ShipBob had published an Open API spec :facepunch:.  You may have better luck generating your own client.
```bash
$ yarn generate:client
```
The included script using OpenAPI to generate clients in various languages.  It's generating TypeScript.  This SDK exposes some endpoints not available in the OpenAPI - the `2.0/receiving-extended` and `experimental/receiving` endpoints.

Have a look in the `/test` folder.  You might like more something like PostMan, but you can run and debug these "tests" in VS Code.  You need a `.env` file with a Personal Access Token:
```
SHIPBOB_API_TOKEN=<redacted>
```

# API implementation progress

## Legend
> [x] = I haven't needed this

> [✓] = implemented

> [ ] = intend to add

> [?] = might add support soon - under investigation

## Orders
- [x] Estimate Fulfillment Cost For Order
- [?] Get Order
- [?] Get Orders
- [✓] Create Order: api.placeOrder(...)
- [✓] Cancel single Order by Order ID: api.cancelSingleOrderByOrderId()
- [x] Get Order Store Json
- [x] Save the Store Order Json (The JSON that represent the order on the Third Party Source)
- [x] Get one Shipment by Order Id and Shipment Id
- [x] Cancel one Shipment by Order Id and Shipment Id
- [x] Get one Shipment's status timeline by Order Id and Shipment Id
- [?] Get all Shipments for Order
- [x] Get logs for one Shipment by Order Id and Shipment Id

## Shipments
- [?] Get one Shipment by Shipment Id (webhooks are enough?)
- [?] Update a Shipment (marked with tracking information uploaded to a third-party system where the order originated)
- [?] Cancel one Shipment by Shipment Id
- [x] Cancel multiple Shipments by Shipment Id
- [x] Get one Shipment's status timeline by Shipment Id
- [x] Get logs for one Shipment by Shipment Id
- [?] Get shipping methods (hard-code shipping methods?)

## Products 1.0
- [✓] Get multiple products: api.getProducts1_0(...)
- [✓] Add a single product to the store: api.createProduct1_0(...)
- [x] Modify a single product (using 2.0 for additional properties)
- [x] Add multiple products to the store

## Products 2.0
These are not documented on the site yet.
- [✓] Get multiple products: api.getProducts2_0(...)
- [✓] Add a single product to the store: api.createProduct2_0(...)
- [✓] Modify a single product: api.updateProducts2_0(..,)
- [x] Add multiple products to the store

## Inventory
- [ ] Get an inventory item
- [✓] List inventory items: api.listInventory(...)
- [x] Get a list of inventory items by product id (we don't know product_id)

## Channels
- [✓] Get user-authorized channel info: not in api, but used on init

## Returns
- [?] Get Return Order
- [?] Modify Return Order
- [?] Get Return Orders
- [?] Create Return Order
- [?] Cancel Return Order
- [?] Get One Return's status history

## Receiving
- [x] Get Fulfillment Centers
- [✓] Get Warehouse Receiving Order
- [✓] Get Warehouse Receiving Order Boxes
- [ ] Get Multiple Warehouse Receiving Orders (we probably need this to filter by statuses)
- [✓] Create Warehouse Receiving Order: api.createWarehouseReceivingOrder(...)
- [x] Get Warehouse Receiving Order Box Labels
- [x] Cancel Warehouse Receiving Order (could be done manually, if needed?)
- [x] 5 x DEPRECATED '/1.0/receiving
  - Get Warehouse Receiving Order
  - Get a Warehouse Receiving Order by Purchase Order Number
  - Create Warehouse Receiving Order
  - Get Warehouse Receiving Order Box Labels 
  - Cancel Warehouse Receiving Order

## Receiving-Extended (not in API docs)
- [✓] Get Receiving Extended: api.getReceivingExtended(...)

## Experimental/receiving (not in API docs.  can change/be removed)
- [✓] Receiving Set External Sync: api.experimentalReceivingSetExternalSync(...)

## Webhooks
- [✓] Get Webhooks: api.getWebhooks()
- [✓] Create a new webhook subscription: api.createWebhookSubscription(...)
- [ ] Delete an existing webhook subscription

## Locations
- [x] Get locations