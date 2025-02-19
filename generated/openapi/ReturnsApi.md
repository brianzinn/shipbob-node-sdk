# .ReturnsApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10returnGet**](ReturnsApi.md#_10returnGet) | **GET** /1.0/return | Get Return Orders
[**_10returnIdCancelPost**](ReturnsApi.md#_10returnIdCancelPost) | **POST** /1.0/return/{id}/cancel | Cancel Return Order
[**_10returnIdGet**](ReturnsApi.md#_10returnIdGet) | **GET** /1.0/return/{id} | Get Return Order
[**_10returnIdPut**](ReturnsApi.md#_10returnIdPut) | **PUT** /1.0/return/{id} | Modify Return Order
[**_10returnIdStatushistoryGet**](ReturnsApi.md#_10returnIdStatushistoryGet) | **GET** /1.0/return/{id}/statushistory | Get One Return\&#39;s status history
[**_10returnPost**](ReturnsApi.md#_10returnPost) | **POST** /1.0/return | Create Return Order


# **_10returnGet**
> Array<ShipbobReturnsPublicApiViewModelsReturnOrderViewModel> _10returnGet()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnGetRequest = {
    // Page of return orders to get (optional)
  page: 1,
    // Amount of return orders per page to request (optional)
  limit: 1,
    // Order to sort results by (optional)
  sortOrder: "Newest",
    // Start date to filter orders inserted later than (optional)
  startDate: new Date('1970-01-01T00:00:00.00Z'),
    // End date to filter orders inserted earlier than (optional)
  endDate: new Date('1970-01-01T00:00:00.00Z'),
    // Comma separated list of return orders ids to filter by (optional)
  iDs: [
    1,
  ],
    // Comma separated list of reference ids to filter by (optional)
  referenceIds: [
    "ReferenceIds_example",
  ],
    // Comma separated list of statuses to filter by (optional)
  status: [
    "AwaitingArrival",
  ],
    // Comma separated list of destination fulfillment center IDs to filter by (optional)
  fulfillmentCenterIds: [
    1,
  ],
    // Comma separated list of tracking numbers to filter by (optional)
  trackingNumbers: [
    "TrackingNumbers_example",
  ],
    // Comma separated list of original shipment IDs to filter by (optional)
  originalShipmentIds: [
    1,
  ],
    // Comma separated list of inventory IDs contained in return to filter by (optional)
  inventoryIds: [
    1,
  ],
  
  shipbobChannelId: 1,
};

const data = await apiInstance._10returnGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | [**number**] | Page of return orders to get | (optional) defaults to undefined
 **limit** | [**number**] | Amount of return orders per page to request | (optional) defaults to undefined
 **sortOrder** | **ShipbobReturnsPublicCommonSortOrder** | Order to sort results by | (optional) defaults to undefined
 **startDate** | [**Date**] | Start date to filter orders inserted later than | (optional) defaults to undefined
 **endDate** | [**Date**] | End date to filter orders inserted earlier than | (optional) defaults to undefined
 **iDs** | **Array&lt;number&gt;** | Comma separated list of return orders ids to filter by | (optional) defaults to undefined
 **referenceIds** | **Array&lt;string&gt;** | Comma separated list of reference ids to filter by | (optional) defaults to undefined
 **status** | **Array&lt;ShipbobReturnsPublicCommonReturnStatus&gt;** | Comma separated list of statuses to filter by | (optional) defaults to undefined
 **fulfillmentCenterIds** | **Array&lt;number&gt;** | Comma separated list of destination fulfillment center IDs to filter by | (optional) defaults to undefined
 **trackingNumbers** | **Array&lt;string&gt;** | Comma separated list of tracking numbers to filter by | (optional) defaults to undefined
 **originalShipmentIds** | **Array&lt;number&gt;** | Comma separated list of original shipment IDs to filter by | (optional) defaults to undefined
 **inventoryIds** | **Array&lt;number&gt;** | Comma separated list of inventory IDs contained in return to filter by | (optional) defaults to undefined
 **shipbobChannelId** | [**number**] |  | (optional) defaults to undefined


### Return type

**Array<ShipbobReturnsPublicApiViewModelsReturnOrderViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  * Page-Number - Number of the current page <br>  * Total-Pages - Total number of pages of results <br>  * Total-Count - Total number of results <br>  * Page-Size - Number of results per page <br>  |
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10returnIdCancelPost**
> ShipbobReturnsPublicApiViewModelsReturnOrderViewModel _10returnIdCancelPost()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnIdCancelPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnIdCancelPostRequest = {
    // Id of the return order
  id: 1,
    // Channel Id for Operation
  shipbobChannelId: 1,
};

const data = await apiInstance._10returnIdCancelPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the return order | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**ShipbobReturnsPublicApiViewModelsReturnOrderViewModel**

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

# **_10returnIdGet**
> ShipbobReturnsPublicApiViewModelsReturnOrderViewModel _10returnIdGet()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnIdGetRequest = {
    // Id of the return order
  id: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10returnIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the return order | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**ShipbobReturnsPublicApiViewModelsReturnOrderViewModel**

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

# **_10returnIdPut**
> ShipbobReturnsPublicApiViewModelsReturnOrderViewModel _10returnIdPut()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnIdPutRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnIdPutRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
    // Id of the return order
  id: 1,
    // Model defining the return (optional)
  shipbobReturnsPublicApiViewModelsCreateReturnViewModel: {
    fulfillmentCenter: {
      id: 1,
      name: "Cicero (IL)",
    },
    referenceId: "ShipBob_Return_123",
    trackingNumber: "1Z9999999999999999",
    inventory: [
      {
        id: 111222,
        quantity: 1,
        requestedAction: "Default",
      },
    ],
    originalShipmentId: 123456,
  },
};

const data = await apiInstance._10returnIdPut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobReturnsPublicApiViewModelsCreateReturnViewModel** | **ShipbobReturnsPublicApiViewModelsCreateReturnViewModel**| Model defining the return |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined
 **id** | [**number**] | Id of the return order | defaults to undefined


### Return type

**ShipbobReturnsPublicApiViewModelsReturnOrderViewModel**

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
**401** | Authorization missing or invalid |  -  |
**403** | The provided credentials are not authorized to access this resource |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10returnIdStatushistoryGet**
> Array<ShipbobReturnsPublicApiViewModelsReturnOrderStatusHistoryViewModel> _10returnIdStatushistoryGet()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnIdStatushistoryGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnIdStatushistoryGetRequest = {
    // Id of the return order
  id: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10returnIdStatushistoryGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] | Id of the return order | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipbobReturnsPublicApiViewModelsReturnOrderStatusHistoryViewModel>**

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

# **_10returnPost**
> ShipbobReturnsPublicApiViewModelsReturnOrderViewModel _10returnPost()


### Example


```typescript
import { createConfiguration, ReturnsApi } from '';
import type { ReturnsApi10returnPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ReturnsApi(configuration);

const request: ReturnsApi10returnPostRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
    // Model defining the return (optional)
  shipbobReturnsPublicApiViewModelsCreateReturnViewModel: {
    fulfillmentCenter: {
      id: 1,
      name: "Cicero (IL)",
    },
    referenceId: "ShipBob_Return_123",
    trackingNumber: "1Z9999999999999999",
    inventory: [
      {
        id: 111222,
        quantity: 1,
        requestedAction: "Default",
      },
    ],
    originalShipmentId: 123456,
  },
};

const data = await apiInstance._10returnPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobReturnsPublicApiViewModelsCreateReturnViewModel** | **ShipbobReturnsPublicApiViewModelsCreateReturnViewModel**| Model defining the return |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**ShipbobReturnsPublicApiViewModelsReturnOrderViewModel**

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
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


