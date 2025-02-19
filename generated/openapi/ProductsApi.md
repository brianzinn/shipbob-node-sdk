# .ProductsApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10productBatchPost**](ProductsApi.md#_10productBatchPost) | **POST** /1.0/product/batch | Add multiple products to the store
[**_10productGet**](ProductsApi.md#_10productGet) | **GET** /1.0/product | Get multiple products
[**_10productPost**](ProductsApi.md#_10productPost) | **POST** /1.0/product | Add a single product to the store
[**_10productProductIdGet**](ProductsApi.md#_10productProductIdGet) | **GET** /1.0/product/{productId} | Get a single product
[**_10productProductIdPut**](ProductsApi.md#_10productProductIdPut) | **PUT** /1.0/product/{productId} | Modify a single product


# **_10productBatchPost**
> Array<ShipbobProductsApiViewModelsPublicProductViewModel> _10productBatchPost()


### Example


```typescript
import { createConfiguration, ProductsApi } from '';
import type { ProductsApi10productBatchPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProductsApi(configuration);

const request: ProductsApi10productBatchPostRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
    // List of up to 50 products to add (optional)
  shipbobProductsApiModelsPublicCreateProductModel: [
    {
      referenceId: "TShirtBlueM",
      sku: "TShirtBlueM",
      name: "Medium Blue T-Shirt",
      barcode: "123456789012",
      gtin: "012345678905",
      upc: "012345678912",
      unitPrice: 20.32,
    },
  ],
};

const data = await apiInstance._10productBatchPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobProductsApiModelsPublicCreateProductModel** | **Array<ShipbobProductsApiModelsPublicCreateProductModel>**| List of up to 50 products to add |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**Array<ShipbobProductsApiViewModelsPublicProductViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Unprocessable Content |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10productGet**
> Array<ShipbobProductsApiViewModelsPublicProductViewModel> _10productGet()


### Example


```typescript
import { createConfiguration, ProductsApi } from '';
import type { ProductsApi10productGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProductsApi(configuration);

const request: ProductsApi10productGetRequest = {
    // Comma separated list of reference ids to filter by (optional)
  referenceIds: [
    "ReferenceIds_example",
  ],
    // Page of products to get  - Valid Range is 0 to integer max with a default of 1 (optional)
  page: 0,
    // Amount of products per page to request  - Valid Range is 1 to 250 with a default of 50 (optional)
  limit: 1,
    // Comma separated list of product ids to filter by (optional)
  iDs: [
    1,
  ],
    // Search is available for 2 fields of the inventory record related to the product: Inventory ID and Name -  1. Expected behavior for search by Inventory ID is exact match  2. Expected behavior for search by Inventory Name is partial match, i.e. does not have to be start of word,   but must be consecutive characters. This is not case sensitive. (optional)
  search: "Search_example",
    // Status filter for products:  - Any: Include both active and inactive  - Active: Filter products that are Active  - Inactive: Filter products that are Inactive (optional)
  activeStatus: "Any",
    // Bundle filter for products:  - Any: Don\'t filter and consider products that are bundles or not bundles  - Bundle: Filter by products that are bundles  - NotBundle: Filter by products that are not bundles (optional)
  bundleStatus: "Any",
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10productGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **referenceIds** | **Array&lt;string&gt;** | Comma separated list of reference ids to filter by | (optional) defaults to undefined
 **page** | [**number**] | Page of products to get  - Valid Range is 0 to integer max with a default of 1 | (optional) defaults to undefined
 **limit** | [**number**] | Amount of products per page to request  - Valid Range is 1 to 250 with a default of 50 | (optional) defaults to undefined
 **iDs** | **Array&lt;number&gt;** | Comma separated list of product ids to filter by | (optional) defaults to undefined
 **search** | [**string**] | Search is available for 2 fields of the inventory record related to the product: Inventory ID and Name -  1. Expected behavior for search by Inventory ID is exact match  2. Expected behavior for search by Inventory Name is partial match, i.e. does not have to be start of word,   but must be consecutive characters. This is not case sensitive. | (optional) defaults to undefined
 **activeStatus** | **ShipbobProductsCommonModelsProductActiveStatus** | Status filter for products:  - Any: Include both active and inactive  - Active: Filter products that are Active  - Inactive: Filter products that are Inactive | (optional) defaults to undefined
 **bundleStatus** | **ShipbobProductsCommonModelsProductBundleStatus** | Bundle filter for products:  - Any: Don\&#39;t filter and consider products that are bundles or not bundles  - Bundle: Filter by products that are bundles  - NotBundle: Filter by products that are not bundles | (optional) defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**Array<ShipbobProductsApiViewModelsPublicProductViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  * Page-Number - Number of the current page <br>  * Total-Pages - Total number of pages of results <br>  * Total-Count - Total number of results <br>  * Page-Size - Number of results per page <br>  * Next-Page - The href of the next page of results, if there is a next page <br>  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10productPost**
> ShipbobProductsApiViewModelsPublicProductViewModel _10productPost()


### Example


```typescript
import { createConfiguration, ProductsApi } from '';
import type { ProductsApi10productPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProductsApi(configuration);

const request: ProductsApi10productPostRequest = {
    // Channel Id for Operation
  shipbobChannelId: 1,
    // The product to add (optional)
  shipbobProductsApiModelsPublicCreateProductModel: {
    referenceId: "TShirtBlueM",
    sku: "TShirtBlueM",
    name: "Medium Blue T-Shirt",
    barcode: "123456789012",
    gtin: "012345678905",
    upc: "012345678912",
    unitPrice: 20.32,
  },
};

const data = await apiInstance._10productPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobProductsApiModelsPublicCreateProductModel** | **ShipbobProductsApiModelsPublicCreateProductModel**| The product to add |
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**ShipbobProductsApiViewModelsPublicProductViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Unprocessable Content |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10productProductIdGet**
> ShipbobProductsApiViewModelsPublicProductViewModel _10productProductIdGet()


### Example


```typescript
import { createConfiguration, ProductsApi } from '';
import type { ProductsApi10productProductIdGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProductsApi(configuration);

const request: ProductsApi10productProductIdGetRequest = {
    // Unique identifier of the product
  productId: 1,
    // Channel Id for Operation (optional)
  shipbobChannelId: 1,
};

const data = await apiInstance._10productProductIdGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **productId** | [**number**] | Unique identifier of the product | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | (optional) defaults to undefined


### Return type

**ShipbobProductsApiViewModelsPublicProductViewModel**

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
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10productProductIdPut**
> ShipbobProductsApiViewModelsPublicProductViewModel _10productProductIdPut()


### Example


```typescript
import { createConfiguration, ProductsApi } from '';
import type { ProductsApi10productProductIdPutRequest } from '';

const configuration = createConfiguration();
const apiInstance = new ProductsApi(configuration);

const request: ProductsApi10productProductIdPutRequest = {
    // Unique identifier of the product to modify
  productId: 1,
    // Channel Id for Operation
  shipbobChannelId: 1,
    // Updated fields to the product (optional)
  shipbobProductsApiModelsPublicUpdateProductModel: {
    name: "Medium Blue T-Shirt",
    sku: "TShirtBlueM",
    barcode: "123456789012",
    gtin: "012345678905",
    upc: "012345678912",
    unitPrice: 20.32,
  },
};

const data = await apiInstance._10productProductIdPut(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipbobProductsApiModelsPublicUpdateProductModel** | **ShipbobProductsApiModelsPublicUpdateProductModel**| Updated fields to the product |
 **productId** | [**number**] | Unique identifier of the product to modify | defaults to undefined
 **shipbobChannelId** | [**number**] | Channel Id for Operation | defaults to undefined


### Return type

**ShipbobProductsApiViewModelsPublicProductViewModel**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: application/json-patch+json, application/json, text/json, application/*+json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |
**422** | Unprocessable Content |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


