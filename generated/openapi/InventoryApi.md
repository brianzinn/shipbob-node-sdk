# .InventoryApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10inventoryGet**](InventoryApi.md#_10inventoryGet) | **GET** /1.0/inventory | List inventory items
[**_10inventoryInventoryIdGet**](InventoryApi.md#_10inventoryInventoryIdGet) | **GET** /1.0/inventory/{inventoryId} | Get an inventory item
[**_10productProductIdInventoryGet**](InventoryApi.md#_10productProductIdInventoryGet) | **GET** /1.0/product/{productId}/inventory | Get a list of inventory items by product id


# **_10inventoryGet**
> Array<ShipbobInventoryApiViewModelsInventoryViewModel> _10inventoryGet()


### Example


```typescript
import { createConfiguration, InventoryApi } from '';
import type { InventoryApi10inventoryGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new InventoryApi(configuration);

const request: InventoryApi10inventoryGetRequest = {
    // Page of inventory items to get (optional)
  page: 0,
    // Amount of inventory items per page to request (optional)
  limit: 1,
    // Whether the inventory should be active or not (optional)
  isActive: true,
    // Whether the inventory is digital or not (optional)
  isDigital: true,
    // Comma separated inventory ids to filter by (optional)
  iDs: [
    1,
  ],
    // Sort will default to ascending order for each field.   To sort in descending order please pass a \"-\" in front of the field name.   For example, Sort=-onHand,name will sort by onHand descending (optional)
  sort: "Sort_example",
    // Search is available for 2 fields, Inventory ID and Name -  1. Expected behavior for search by Inventory ID is exact match  2. Expected behavior for search by Inventory Name is partial match, i.e. does not have to be start of word,   but must be consecutive characters. This is not case sensitive. (optional)
  search: "Search_example",
    // LocationType is valid for hub, spoke, or lts.  LocationType will default to all locations. (optional)
  locationType: "LocationType_example",
};

const data = await apiInstance._10inventoryGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | [**number**] | Page of inventory items to get | (optional) defaults to undefined
 **limit** | [**number**] | Amount of inventory items per page to request | (optional) defaults to undefined
 **isActive** | [**boolean**] | Whether the inventory should be active or not | (optional) defaults to undefined
 **isDigital** | [**boolean**] | Whether the inventory is digital or not | (optional) defaults to undefined
 **iDs** | **Array&lt;number&gt;** | Comma separated inventory ids to filter by | (optional) defaults to undefined
 **sort** | [**string**] | Sort will default to ascending order for each field.   To sort in descending order please pass a \&quot;-\&quot; in front of the field name.   For example, Sort&#x3D;-onHand,name will sort by onHand descending | (optional) defaults to undefined
 **search** | [**string**] | Search is available for 2 fields, Inventory ID and Name -  1. Expected behavior for search by Inventory ID is exact match  2. Expected behavior for search by Inventory Name is partial match, i.e. does not have to be start of word,   but must be consecutive characters. This is not case sensitive. | (optional) defaults to undefined
 **locationType** | [**string**] | LocationType is valid for hub, spoke, or lts.  LocationType will default to all locations. | (optional) defaults to undefined


### Return type

**Array<ShipbobInventoryApiViewModelsInventoryViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10inventoryInventoryIdGet**
> ShipbobInventoryApiViewModelsInventoryViewModel _10inventoryInventoryIdGet()


### Example


```typescript
import { createConfiguration, InventoryApi } from '';
import type { InventoryApi10inventoryInventoryIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new InventoryApi(configuration);

const request: InventoryApi10inventoryInventoryIdGetRequest = {
    // The inventory id to get
  inventoryId: 1,
};

const data = await apiInstance._10inventoryInventoryIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inventoryId** | [**number**] | The inventory id to get | defaults to undefined


### Return type

**ShipbobInventoryApiViewModelsInventoryViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10productProductIdInventoryGet**
> Array<ShipbobInventoryApiViewModelsInventoryViewModel> _10productProductIdInventoryGet()


### Example


```typescript
import { createConfiguration, InventoryApi } from '';
import type { InventoryApi10productProductIdInventoryGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new InventoryApi(configuration);

const request: InventoryApi10productProductIdInventoryGetRequest = {
    // The product id to get inventory for
  productId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10productProductIdInventoryGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | [**number**] | The product id to get inventory for | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipbobInventoryApiViewModelsInventoryViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


