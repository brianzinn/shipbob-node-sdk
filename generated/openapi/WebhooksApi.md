# .WebhooksApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10webhookGet**](WebhooksApi.md#_10webhookGet) | **GET** /1.0/webhook | Get Webhooks
[**_10webhookIdDelete**](WebhooksApi.md#_10webhookIdDelete) | **DELETE** /1.0/webhook/{id} | Delete an existing webhook subscription
[**_10webhookPost**](WebhooksApi.md#_10webhookPost) | **POST** /1.0/webhook | Create a new webhook subscription


# **_10webhookGet**
> Array<ShipBobWebhooksPublicApiModelsWebhookViewModel> _10webhookGet()

All parameters are AND filters

### Example


```typescript
import { createConfiguration, WebhooksApi } from '';
import type { WebhooksApi10webhookGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WebhooksApi(configuration);

const request: WebhooksApi10webhookGetRequest = {
    // Topic of the webhooks requested (optional)
  topic: "order_shipped",
    // Page of Webhooks to get (optional)
  page: 0,
    // Amount of Webhooks per page to request (optional)
  limit: 1,
};

const data = await apiInstance._10webhookGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **topic** | **ShipBobWebhooksPublicCommonTopics** | Topic of the webhooks requested | (optional) defaults to undefined
 **page** | [**number**] | Page of Webhooks to get | (optional) defaults to undefined
 **limit** | [**number**] | Amount of Webhooks per page to request | (optional) defaults to undefined


### Return type

**Array<ShipBobWebhooksPublicApiModelsWebhookViewModel>**

### Authorization

[oauth2](README.md#oauth2)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Success |  * Page-Number - Number of the current page <br>  * Total-Pages - Total number of pages of results <br>  * Total-Count - Total number of results <br>  * Page-Size - Number of results per page <br>  * Next-Page - The href of the next page of results, if there is a next page <br>  |
**400** | Bad Request |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10webhookIdDelete**
> void _10webhookIdDelete()


### Example


```typescript
import { createConfiguration, WebhooksApi } from '';
import type { WebhooksApi10webhookIdDeleteRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WebhooksApi(configuration);

const request: WebhooksApi10webhookIdDeleteRequest = {
    // 
  id: 1,
};

const data = await apiInstance._10webhookIdDelete(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | [**number**] |  | defaults to undefined


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
**204** | Success |  -  |
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)

# **_10webhookPost**
> ShipBobWebhooksPublicApiModelsWebhookViewModel _10webhookPost()


### Example


```typescript
import { createConfiguration, WebhooksApi } from '';
import type { WebhooksApi10webhookPostRequest } from '';

const configuration = createConfiguration();
const apiInstance = new WebhooksApi(configuration);

const request: WebhooksApi10webhookPostRequest = {
    //  (optional)
  shipbobChannelId: 1,
    //  (optional)
  shipBobWebhooksPublicApiModelsCreateWebhookSubscriptionModel: {
    topic: "order_shipped",
    subscriptionUrl: "https://mywebsite.com/shipbob/handler",
  },
};

const data = await apiInstance._10webhookPost(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **shipBobWebhooksPublicApiModelsCreateWebhookSubscriptionModel** | **ShipBobWebhooksPublicApiModelsCreateWebhookSubscriptionModel**|  |
 **shipbobChannelId** | [**number**] |  | (optional) defaults to undefined


### Return type

**ShipBobWebhooksPublicApiModelsWebhookViewModel**

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
**401** | No access right at this time |  -  |
**403** | No access |  -  |
**422** | Client Error |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


