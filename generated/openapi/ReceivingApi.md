# .ReceivingApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10fulfillmentCenterGet**](ReceivingApi.md#_10fulfillmentCenterGet) | **GET** /1.0/fulfillmentCenter | Get Fulfillment Centers
[**_10receivingGet**](ReceivingApi.md#_10receivingGet) | **GET** /1.0/receiving | Get a Warehouse Receiving Order by Purchase Order Number (DEPRECATED)
[**_10receivingIdCancelPost**](ReceivingApi.md#_10receivingIdCancelPost) | **POST** /1.0/receiving/{id}/cancel | Cancel Warehouse Receiving Order (DEPRECATED)
[**_10receivingIdGet**](ReceivingApi.md#_10receivingIdGet) | **GET** /1.0/receiving/{id} | Get Warehouse Receiving Order (DEPRECATED)
[**_10receivingIdLabelsGet**](ReceivingApi.md#_10receivingIdLabelsGet) | **GET** /1.0/receiving/{id}/labels | Get Warehouse Receiving Order Box Labels (DEPRECATED)
[**_10receivingPost**](ReceivingApi.md#_10receivingPost) | **POST** /1.0/receiving | Create Warehouse Receiving Order (DEPRECATED)
[**_20receivingGet**](ReceivingApi.md#_20receivingGet) | **GET** /2.0/receiving | Get Multiple Warehouse Receiving Orders
[**_20receivingIdBoxesGet**](ReceivingApi.md#_20receivingIdBoxesGet) | **GET** /2.0/receiving/{id}/boxes | Get Warehouse Receiving Order Boxes
[**_20receivingIdCancelPost**](ReceivingApi.md#_20receivingIdCancelPost) | **POST** /2.0/receiving/{id}/cancel | Cancel Warehouse Receiving Order
[**_20receivingIdGet**](ReceivingApi.md#_20receivingIdGet) | **GET** /2.0/receiving/{id} | Get Warehouse Receiving Order
[**_20receivingIdLabelsGet**](ReceivingApi.md#_20receivingIdLabelsGet) | **GET** /2.0/receiving/{id}/labels | Get Warehouse Receiving Order Box Labels
[**_20receivingPost**](ReceivingApi.md#_20receivingPost) | **POST** /2.0/receiving | Create Warehouse Receiving Order


# **_10fulfillmentCenterGet**
> Array<ShipbobReceivingPublicApiModelsFulfillmentCenterViewModel> _10fulfillmentCenterGet()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request = {};

const data = await apiInstance._10fulfillmentCenterGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<ShipbobReceivingPublicApiModelsFulfillmentCenterViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10receivingGet**
> ShipbobReceivingPublicApiModelsReceivingOrderViewModel _10receivingGet()

This endpoint is deprecated. Please use /2.0/receiving?purchaseorderNumber={value}

### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi10receivingGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi10receivingGetRequest = {
    // Purchase order number of the receiving order (optional)
  purchaseOrderNumber: "purchaseOrderNumber_example",
};

const data = await apiInstance._10receivingGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **purchaseOrderNumber** | [**string**] | Purchase order number of the receiving order | (optional) defaults to undefined


### Return type

**ShipbobReceivingPublicApiModelsReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10receivingIdCancelPost**
> void _10receivingIdCancelPost()

This endpoint is deprecated. Please use /2.0/receiving/{id}/cancel

### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi10receivingIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi10receivingIdCancelPostRequest = {
    // Id of the receiving order to cancel
  id: 1,
};

const data = await apiInstance._10receivingIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order to cancel | defaults to undefined


### Return type

**void**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10receivingIdGet**
> ShipbobReceivingPublicApiModelsReceivingOrderViewModel _10receivingIdGet()

This endpoint is deprecated. Please use /2.0/receiving/{id}

### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi10receivingIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi10receivingIdGetRequest = {
    // Id of the receiving order
  id: 1,
};

const data = await apiInstance._10receivingIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order | defaults to undefined


### Return type

**ShipbobReceivingPublicApiModelsReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10receivingIdLabelsGet**
> string _10receivingIdLabelsGet()

This endpoint is deprecated. Please use /2.0/receiving/{id}/labels

### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi10receivingIdLabelsGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi10receivingIdLabelsGetRequest = {
    // Id of the receiving order
  id: 1,
};

const data = await apiInstance._10receivingIdLabelsGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order | defaults to undefined


### Return type

**string**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/pdf, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10receivingPost**
> ShipbobReceivingPublicApiModelsReceivingOrderViewModel _10receivingPost()

This endpoint is deprecated. Please use /2.0/receiving

### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi10receivingPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi10receivingPostRequest = {
    // The receiving order to create (optional)
  shipbobReceivingPublicApiModelsCreateReceivingOrderModel: {
    fulfillmentCenter: {
      id: 1,
    },
    packageType: "Package",
    boxPackagingType: "EverythingInOneBox",
    boxes: [
      {
        trackingNumber: "860C8CDC8F0B4FC7AB69AC86C20539EC",
        boxItems: [
          {
            quantity: 1,
            inventoryId: 1,
            lotNumber: "2222",
            lotDate: new Date('1970-01-01T00:00:00.00Z'),
          },
        ],
      },
    ],
    expectedArrivalDate: new Date('1970-01-01T00:00:00.00Z'),
    purchaseOrderNumber: "purchaseOrderNumber_example",
  },
};

const data = await apiInstance._10receivingPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobReceivingPublicApiModelsCreateReceivingOrderModel** | **ShipbobReceivingPublicApiModelsCreateReceivingOrderModel**| The receiving order to create |


### Return type

**ShipbobReceivingPublicApiModelsReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Success |  -  |
**400** | Bad Request |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingGet**
> Array<ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel> _20receivingGet()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingGetRequest = {
    // Page of WROs to get (optional)
  page: 1,
    // Number of WROs per page to request (optional)
  limit: 1,
    // Comma separated list of WRO IDs to filter by (optional)
  iDs: [
    1,
  ],
    // Comma separated list of WRO statuses to filter by (optional)
  statuses: [
    "Awaiting",
  ],
    // Earliest date that a WRO was created (optional)
  insertStartDate: new Date('1970-01-01T00:00:00.00Z'),
    // Latest date that a WRO was created (optional)
  insertEndDate: new Date('1970-01-01T00:00:00.00Z'),
    // Comma separated list of WRO fulfillment center IDs to filter by (optional)
  fulfillmentCenterIds: [
    1,
  ],
    // Comma separated list of WRO PO numbers to filter by (optional)
  purchaseOrderNumbers: [
    "PurchaseOrderNumbers_example",
  ],
    // Flag to return external_sync_timestamp WROs (optional)
  externalSync: true,
};

const data = await apiInstance._20receivingGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | [**number**] | Page of WROs to get | (optional) defaults to undefined
 **limit** | [**number**] | Number of WROs per page to request | (optional) defaults to undefined
 **iDs** | **Array&lt;number&gt;** | Comma separated list of WRO IDs to filter by | (optional) defaults to undefined
 **statuses** | **Array&lt;ShipbobReceivingPublicCommonModelsReceivingStatus&gt;** | Comma separated list of WRO statuses to filter by | (optional) defaults to undefined
 **insertStartDate** | [**Date**] | Earliest date that a WRO was created | (optional) defaults to undefined
 **insertEndDate** | [**Date**] | Latest date that a WRO was created | (optional) defaults to undefined
 **fulfillmentCenterIds** | **Array&lt;number&gt;** | Comma separated list of WRO fulfillment center IDs to filter by | (optional) defaults to undefined
 **purchaseOrderNumbers** | **Array&lt;string&gt;** | Comma separated list of WRO PO numbers to filter by | (optional) defaults to undefined
 **externalSync** | [**boolean**] | Flag to return external_sync_timestamp WROs | (optional) defaults to undefined


### Return type

**Array<ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  * Page-Number - Number of the current page <br>  * Total-Pages - Total number of pages of results <br>  * Total-Count - Total number of results <br>  * Page-Size - Number of results per page <br>  * Next-Page - The href of the next page of results, if there is a next page <br>  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingIdBoxesGet**
> Array<ShipbobReceivingPublicApiModelsBoxViewModel> _20receivingIdBoxesGet()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingIdBoxesGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingIdBoxesGetRequest = {
    // Id of the receiving order
  id: 1,
};

const data = await apiInstance._20receivingIdBoxesGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order | defaults to undefined


### Return type

**Array<ShipbobReceivingPublicApiModelsBoxViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingIdCancelPost**
> ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel _20receivingIdCancelPost()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingIdCancelPostRequest = {
    // Id of the receiving order to cancel
  id: 1,
};

const data = await apiInstance._20receivingIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order to cancel | defaults to undefined


### Return type

**ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingIdGet**
> ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel _20receivingIdGet()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingIdGetRequest = {
    // Id of the receiving order
  id: 1,
};

const data = await apiInstance._20receivingIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order | defaults to undefined


### Return type

**ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingIdLabelsGet**
> string _20receivingIdLabelsGet()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingIdLabelsGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingIdLabelsGetRequest = {
    // Id of the receiving order
  id: 1,
};

const data = await apiInstance._20receivingIdLabelsGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the receiving order | defaults to undefined


### Return type

**string**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/pdf, application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  -  |
**400** | Bad Request |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_20receivingPost**
> ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel _20receivingPost()


### Example


```typescript
import { createConfiguration, ReceivingApi } from '';
import type { ReceivingApi20receivingPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReceivingApi(configuration);

const request: ReceivingApi20receivingPostRequest = {
    // The receiving order to create (optional)
  shipbobReceivingPublicApiModelsCreateReceivingOrderModel: {
    fulfillmentCenter: {
      id: 1,
    },
    packageType: "Package",
    boxPackagingType: "EverythingInOneBox",
    boxes: [
      {
        trackingNumber: "860C8CDC8F0B4FC7AB69AC86C20539EC",
        boxItems: [
          {
            quantity: 1,
            inventoryId: 1,
            lotNumber: "2222",
            lotDate: new Date('1970-01-01T00:00:00.00Z'),
          },
        ],
      },
    ],
    expectedArrivalDate: new Date('1970-01-01T00:00:00.00Z'),
    purchaseOrderNumber: "purchaseOrderNumber_example",
  },
};

const data = await apiInstance._20receivingPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobReceivingPublicApiModelsCreateReceivingOrderModel** | **ShipbobReceivingPublicApiModelsCreateReceivingOrderModel**| The receiving order to create |


### Return type

**ShipbobReceivingPublicApiModelsV2WarehouseReceivingOrderViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Success |  -  |
**400** | Bad Request |  -  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


