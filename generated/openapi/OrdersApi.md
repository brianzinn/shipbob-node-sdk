# .OrdersApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10orderEstimatePost**](OrdersApi.md#_10orderEstimatePost) | **POST** /1.0/order/estimate | Estimate Fulfillment Cost For Order
[**_10orderGet**](OrdersApi.md#_10orderGet) | **GET** /1.0/order | Get Orders
[**_10orderOrderIdCancelPost**](OrdersApi.md#_10orderOrderIdCancelPost) | **POST** /1.0/order/{orderId}/cancel | Cancel single Order by Order ID
[**_10orderOrderIdGet**](OrdersApi.md#_10orderOrderIdGet) | **GET** /1.0/order/{orderId} | Get Order
[**_10orderOrderIdShipmentGet**](OrdersApi.md#_10orderOrderIdShipmentGet) | **GET** /1.0/order/{orderId}/shipment | Get all Shipments for Order
[**_10orderOrderIdShipmentShipmentIdCancelPost**](OrdersApi.md#_10orderOrderIdShipmentShipmentIdCancelPost) | **POST** /1.0/order/{orderId}/shipment/{shipmentId}/cancel | Cancel one Shipment by Order Id and Shipment Id
[**_10orderOrderIdShipmentShipmentIdGet**](OrdersApi.md#_10orderOrderIdShipmentShipmentIdGet) | **GET** /1.0/order/{orderId}/shipment/{shipmentId} | Get one Shipment by Order Id and Shipment Id
[**_10orderOrderIdShipmentShipmentIdLogsGet**](OrdersApi.md#_10orderOrderIdShipmentShipmentIdLogsGet) | **GET** /1.0/order/{orderId}/shipment/{shipmentId}/logs | Get logs for one Shipment by Order Id and Shipment Id
[**_10orderOrderIdShipmentShipmentIdTimelineGet**](OrdersApi.md#_10orderOrderIdShipmentShipmentIdTimelineGet) | **GET** /1.0/order/{orderId}/shipment/{shipmentId}/timeline | Get one Shipment\&#39;s status timeline by Order Id and Shipment Id
[**_10orderOrderIdStoreOrderJsonGet**](OrdersApi.md#_10orderOrderIdStoreOrderJsonGet) | **GET** /1.0/order/{orderId}/storeOrderJson | Get Order Store Json
[**_10orderOrderIdStoreOrderJsonPost**](OrdersApi.md#_10orderOrderIdStoreOrderJsonPost) | **POST** /1.0/order/{orderId}/storeOrderJson | Save the Store Order Json
[**_10orderPost**](OrdersApi.md#_10orderPost) | **POST** /1.0/order | Create Order
[**_10shipmentCancelbulkPost**](OrdersApi.md#_10shipmentCancelbulkPost) | **POST** /1.0/shipment/cancelbulk | Cancel multiple Shipments by Shipment Id
[**_10shipmentShipmentIdCancelPost**](OrdersApi.md#_10shipmentShipmentIdCancelPost) | **POST** /1.0/shipment/{shipmentId}/cancel | Cancel one Shipment by Shipment Id
[**_10shipmentShipmentIdGet**](OrdersApi.md#_10shipmentShipmentIdGet) | **GET** /1.0/shipment/{shipmentId} | Get one Shipment by Shipment Id
[**_10shipmentShipmentIdLogsGet**](OrdersApi.md#_10shipmentShipmentIdLogsGet) | **GET** /1.0/shipment/{shipmentId}/logs | Get logs for one Shipment by Shipment Id
[**_10shipmentShipmentIdPut**](OrdersApi.md#_10shipmentShipmentIdPut) | **PUT** /1.0/shipment/{shipmentId} | Update a Shipment
[**_10shipmentShipmentIdTimelineGet**](OrdersApi.md#_10shipmentShipmentIdTimelineGet) | **GET** /1.0/shipment/{shipmentId}/timeline | Get one Shipment\&#39;s status timeline by Shipment Id
[**_10shippingmethodGet**](OrdersApi.md#_10shippingmethodGet) | **GET** /1.0/shippingmethod | Get shipping methods


# **_10orderEstimatePost**
> ShipBobOrdersPresentationViewModelsEstimateViewModel _10orderEstimatePost()

This endpoint will provide, where possible, an estimate of pricing and fulfillment center assignment of a potential standard (direct to consumer) order.   Keep in mind that there are ways for the merchant to change FC assignment or product configuration after order creation that could invalidate this estimate.   Estimates cannot be returned for items that are unknown, out of stock, or too large for fulfillment using standard box sizes.   Additional services such as high-pick fees, shipping insurance, auto-splitting or auto-adding items to orders, and signature required are not included in this estimate.

### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderEstimatePostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderEstimatePostRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
  
  xCorrelationId: "x_correlation_id_example",
    //  (optional)
  shipBobOrdersPresentationModelsEstimateFulfillmentRequestModel: {
    shippingMethods: [
      "shippingMethods_example",
    ],
    address: {
      address1: "100 Nowhere Blvd",
      address2: "Suite 100",
      companyName: "Wayne Enterprises",
      city: "Gotham City",
      state: "NJ",
      country: "US",
      zipCode: "07093",
    },
    products: [
      {
        id: 1,
        referenceId: "TShirtBlueM",
        quantity: 1,
      },
    ],
  },
};

const data = await apiInstance._10orderEstimatePost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobOrdersPresentationModelsEstimateFulfillmentRequestModel** | **ShipBobOrdersPresentationModelsEstimateFulfillmentRequestModel**|  |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined
 **xCorrelationId** | [**string**] |  | (optional) defaults to undefined


### Return type

**ShipBobOrdersPresentationViewModelsEstimateViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderGet**
> Array<ShipBobOrdersPresentationViewModelsOrderViewModel> _10orderGet()

All parameters are AND filters

### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderGetRequest = {
    // Page of orders to get (optional)
  page: 1,
    // Amount of orders per page to request (optional)
  limit: 1,
    // order ids to filter by, comma separated <br /><strong>Example:</strong> ?IDs=1,2 (optional)
  iDs: [
    1,
  ],
    // Reference ids to filter by, comma separated <br /><strong>Example:</strong> ?ReferenceIds=Ref1,Ref2 (optional)
  referenceIds: [
    "ReferenceIds_example",
  ],
    // Start date to filter orders inserted later than (optional)
  startDate: new Date('1970-01-01T00:00:00.00Z'),
    // End date to filter orders inserted earlier than (optional)
  endDate: new Date('1970-01-01T00:00:00.00Z'),
    // Order to sort results in (optional)
  sortOrder: "Newest",
    // Has any portion of this order been assigned a tracking number (optional)
  hasTracking: true,
    // Start date to filter orders updated later than (optional)
  lastUpdateStartDate: new Date('1970-01-01T00:00:00.00Z'),
    // End date to filter orders updated later than (optional)
  lastUpdateEndDate: new Date('1970-01-01T00:00:00.00Z'),
    // Filter orders that their tracking information was fully uploaded (optional)
  isTrackingUploaded: true,
    // Start date to filter orders with tracking updates later than the supplied date. Will only return orders that have tracking information (optional)
  lastTrackingUpdateStartDate: new Date('1970-01-01T00:00:00.00Z'),
    // End date to filter orders updated later than the supplied date. Will only return orders that have tracking information (optional)
  lastTrackingUpdateEndDate: new Date('1970-01-01T00:00:00.00Z'),
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | [**number**] | Page of orders to get | (optional) defaults to undefined
 **limit** | [**number**] | Amount of orders per page to request | (optional) defaults to undefined
 **iDs** | **Array&lt;number&gt;** | order ids to filter by, comma separated &lt;br /&gt;&lt;strong&gt;Example:&lt;/strong&gt; ?IDs&#x3D;1,2 | (optional) defaults to undefined
 **referenceIds** | **Array&lt;string&gt;** | Reference ids to filter by, comma separated &lt;br /&gt;&lt;strong&gt;Example:&lt;/strong&gt; ?ReferenceIds&#x3D;Ref1,Ref2 | (optional) defaults to undefined
 **startDate** | [**Date**] | Start date to filter orders inserted later than | (optional) defaults to undefined
 **endDate** | [**Date**] | End date to filter orders inserted earlier than | (optional) defaults to undefined
 **sortOrder** | **ShipbobOrdersCommonSortOrder** | Order to sort results in | (optional) defaults to undefined
 **hasTracking** | [**boolean**] | Has any portion of this order been assigned a tracking number | (optional) defaults to undefined
 **lastUpdateStartDate** | [**Date**] | Start date to filter orders updated later than | (optional) defaults to undefined
 **lastUpdateEndDate** | [**Date**] | End date to filter orders updated later than | (optional) defaults to undefined
 **isTrackingUploaded** | [**boolean**] | Filter orders that their tracking information was fully uploaded | (optional) defaults to undefined
 **lastTrackingUpdateStartDate** | [**Date**] | Start date to filter orders with tracking updates later than the supplied date. Will only return orders that have tracking information | (optional) defaults to undefined
 **lastTrackingUpdateEndDate** | [**Date**] | End date to filter orders updated later than the supplied date. Will only return orders that have tracking information | (optional) defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsOrderViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdCancelPost**
> ShipBobOrdersPresentationViewModelsCanceledOrderViewModel _10orderOrderIdCancelPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdCancelPostRequest = {
    // The order ID to cancel
  orderId: 1,
    // Channel ID for Operation
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order ID to cancel | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel ID for Operation | defaults to undefined


### Return type

**ShipBobOrdersPresentationViewModelsCanceledOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |
**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdGet**
> ShipBobOrdersPresentationViewModelsOrderViewModel _10orderOrderIdGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdGetRequest = {
    // 
  orderId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] |  | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**ShipBobOrdersPresentationViewModelsOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdShipmentGet**
> Array<Model10OrderOrderIdShipmentShipmentIdGet200Response> _10orderOrderIdShipmentGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdShipmentGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdShipmentGetRequest = {
    // The order id to get shipments for
  orderId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdShipmentGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order id to get shipments for | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<Model10OrderOrderIdShipmentShipmentIdGet200Response>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdShipmentShipmentIdCancelPost**
> Model10OrderOrderIdShipmentShipmentIdGet200Response _10orderOrderIdShipmentShipmentIdCancelPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdShipmentShipmentIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdShipmentShipmentIdCancelPostRequest = {
    // The shipment id to get
  shipmentId: 1,
  
  orderId: "orderId_example",
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdShipmentShipmentIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **orderId** | [**string**] |  | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Model10OrderOrderIdShipmentShipmentIdGet200Response**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |
**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdShipmentShipmentIdGet**
> Model10OrderOrderIdShipmentShipmentIdGet200Response _10orderOrderIdShipmentShipmentIdGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdShipmentShipmentIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdShipmentShipmentIdGetRequest = {
    // The order id to get the shipment for
  orderId: 1,
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdShipmentShipmentIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order id to get the shipment for | defaults to undefined
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Model10OrderOrderIdShipmentShipmentIdGet200Response**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdShipmentShipmentIdLogsGet**
> Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel> _10orderOrderIdShipmentShipmentIdLogsGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdShipmentShipmentIdLogsGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdShipmentShipmentIdLogsGetRequest = {
    // The order id to get the shipment for
  orderId: 1,
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdShipmentShipmentIdLogsGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order id to get the shipment for | defaults to undefined
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdShipmentShipmentIdTimelineGet**
> Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel> _10orderOrderIdShipmentShipmentIdTimelineGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdShipmentShipmentIdTimelineGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdShipmentShipmentIdTimelineGetRequest = {
    // The order id to get the shipment for
  orderId: 1,
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10orderOrderIdShipmentShipmentIdTimelineGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order id to get the shipment for | defaults to undefined
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdStoreOrderJsonGet**
> void | string _10orderOrderIdStoreOrderJsonGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdStoreOrderJsonGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdStoreOrderJsonGetRequest = {
    // The order ID to Get the JSON Stored
  orderId: 1,
};

const data = await apiInstance._10orderOrderIdStoreOrderJsonGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **orderId** | [**number**] | The order ID to Get the JSON Stored | defaults to undefined


### Return type

**void | string**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**204** | No Content |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderOrderIdStoreOrderJsonPost**
> string _10orderOrderIdStoreOrderJsonPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderOrderIdStoreOrderJsonPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderOrderIdStoreOrderJsonPostRequest = {
    // The order ID to Store
  orderId: 1,
    // The JSON that represent the order on the Third Party Source (optional)
  shipBobOrdersPresentationModelsAddStoreOrderJsonModel: {
    orderJson: "orderJson_example",
  },
};

const data = await apiInstance._10orderOrderIdStoreOrderJsonPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobOrdersPresentationModelsAddStoreOrderJsonModel** | **ShipBobOrdersPresentationModelsAddStoreOrderJsonModel**| The JSON that represent the order on the Third Party Source |
 **orderId** | [**number**] | The order ID to Store | defaults to undefined


### Return type

**string**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Created |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10orderPost**
> ShipBobOrdersPresentationViewModelsOrderViewModel _10orderPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10orderPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10orderPostRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
    //  (optional)
  shipBobOrdersPresentationModelsCreateOrderModel: {
    shippingMethod: "Free 2-day Shipping",
    recipient: {
      name: "John Doe",
      address: null,
      email: "john@example.com",
      phoneNumber: "555-555-5555",
    },
    products: [
      null,
    ],
    referenceId: "referenceId_example",
    orderNumber: "orderNumber_example",
    type: "DTC",
    tags: [
      {
        name: "Handling instructions",
        value: "Fragile",
      },
    ],
    purchaseDate: new Date('1970-01-01T00:00:00.00Z'),
    locationId: 1,
    shippingTerms: {
      carrierType: "Parcel",
      paymentTerm: "Collect",
    },
    retailerProgramData: {
      purchaseOrderNumber: "purchaseOrderNumber_example",
      retailerProgramType: "retailerProgramType_example",
      markForStore: "markForStore_example",
      department: "department_example",
      deliveryDate: new Date('1970-01-01T00:00:00.00Z'),
      addresses: [
        ,
      ],
      customerTicketNumber: "customerTicketNumber_example",
      shipByDate: new Date('1970-01-01T00:00:00.00Z'),
      doNotShipBeforeDate: new Date('1970-01-01T00:00:00.00Z'),
    },
    giftMessage: "giftMessage_example",
    financials: {
      totalPrice: 3.14,
    },
  },
};

const data = await apiInstance._10orderPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobOrdersPresentationModelsCreateOrderModel** | **ShipBobOrdersPresentationModelsCreateOrderModel**|  |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**ShipBobOrdersPresentationViewModelsOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Created |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentCancelbulkPost**
> ShipBobOrdersPresentationViewModelsCanceledShipmentsViewModel _10shipmentCancelbulkPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentCancelbulkPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentCancelbulkPostRequest = {
    // Channel ID for Operation
  shipbobChannelId: 1,
    // The shipment IDs to cancel (optional)
  shipBobOrdersPresentationModelsCancelShipmentsModel: {
    shipmentIds: [
      1,
    ],
  },
};

const data = await apiInstance._10shipmentCancelbulkPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobOrdersPresentationModelsCancelShipmentsModel** | **ShipBobOrdersPresentationModelsCancelShipmentsModel**| The shipment IDs to cancel |
 **shipbobChannelId** | [**number**] | Channel ID for Operation | defaults to undefined


### Return type

**ShipBobOrdersPresentationViewModelsCanceledShipmentsViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Client Error |  -  |
**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentShipmentIdCancelPost**
> Model10OrderOrderIdShipmentShipmentIdGet200Response _10shipmentShipmentIdCancelPost()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentShipmentIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentShipmentIdCancelPostRequest = {
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10shipmentShipmentIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Model10OrderOrderIdShipmentShipmentIdGet200Response**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |
**500** | Server Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentShipmentIdGet**
> Model10OrderOrderIdShipmentShipmentIdGet200Response _10shipmentShipmentIdGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentShipmentIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentShipmentIdGetRequest = {
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10shipmentShipmentIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Model10OrderOrderIdShipmentShipmentIdGet200Response**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentShipmentIdLogsGet**
> Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel> _10shipmentShipmentIdLogsGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentShipmentIdLogsGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentShipmentIdLogsGetRequest = {
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10shipmentShipmentIdLogsGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentShipmentIdPut**
> Array<Model10OrderOrderIdShipmentShipmentIdGet200Response> _10shipmentShipmentIdPut()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentShipmentIdPutRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentShipmentIdPutRequest = {
    // The Shipment id to be updated
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
    // Shipment Information to be updated (optional)
  shipBobOrdersPresentationModelsUpdateShipmentModel: {
    isTrackingUploaded: true,
  },
};

const data = await apiInstance._10shipmentShipmentIdPut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobOrdersPresentationModelsUpdateShipmentModel** | **ShipBobOrdersPresentationModelsUpdateShipmentModel**| Shipment Information to be updated |
 **shipmentId** | [**number**] | The Shipment id to be updated | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<Model10OrderOrderIdShipmentShipmentIdGet200Response>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shipmentShipmentIdTimelineGet**
> Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel> _10shipmentShipmentIdTimelineGet()


### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shipmentShipmentIdTimelineGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shipmentShipmentIdTimelineGetRequest = {
    // The shipment id to get
  shipmentId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10shipmentShipmentIdTimelineGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipmentId** | [**number**] | The shipment id to get | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsShipmentLogViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10shippingmethodGet**
> Array<ShipBobOrdersPresentationViewModelsShipMethodDetailViewModel> _10shippingmethodGet()

Get all merchants shipping methods

### Example


```typescript
import { createConfiguration, OrdersApi } from '';
import type { OrdersApi10shippingmethodGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new OrdersApi(configuration);

const request: OrdersApi10shippingmethodGetRequest = {
    // Page of orders to get (optional)
  page: 0,
    // Amount of records per page to request (optional)
  limit: 1,
};

const data = await apiInstance._10shippingmethodGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | [**number**] | Page of orders to get | (optional) defaults to undefined
 **limit** | [**number**] | Amount of records per page to request | (optional) defaults to undefined


### Return type

**Array<ShipBobOrdersPresentationViewModelsShipMethodDetailViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


