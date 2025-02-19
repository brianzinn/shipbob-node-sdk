# .ChannelsApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10channelGet**](ChannelsApi.md#_10channelGet) | **GET** /1.0/channel | Get user-authorized channel info


# **_10channelGet**
> Array<ShipBobChannelsApiViewModelsChannelViewModel> _10channelGet()


### Example


```typescript
import { createConfiguration, ChannelsApi } from '';

const configuration = createConfiguration();
const apiInstance = new ChannelsApi(configuration);

const request = {};

const data = await apiInstance._10channelGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters
This endpoint does not need any parameter.


### Return type

**Array<ShipBobChannelsApiViewModelsChannelViewModel>**

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
**401** | Unauthorized |  -  |
**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


