# .LocationsApi

All URIs are relative to *https://api.shipbob.com*

Method | HTTP request | Description
------------- | ------------- | -------------
[**_10locationGet**](LocationsApi.md#_10locationGet) | **GET** /1.0/location | Get locations


# **_10locationGet**
> Array<Model10LocationGet200ResponseInner> _10locationGet()


### Example


```typescript
import { createConfiguration, LocationsApi } from '';
import type { LocationsApi10locationGetRequest } from '';

const configuration = createConfiguration();
const apiInstance = new LocationsApi(configuration);

const request: LocationsApi10locationGetRequest = {
    // Return all locations the user has access to (optional)
  userId: 1,
    // Whether the inactive locations should be included or not (optional)
  includeInactive: true,
    // Return all the receiving enabled locations (optional)
  receivingEnabled: true,
    // Return all the access granted locations (optional)
  accessGranted: true,
};

const data = await apiInstance._10locationGet(request);
console.log('API called successfully. Returned data:', data);
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | [**number**] | Return all locations the user has access to | (optional) defaults to undefined
 **includeInactive** | [**boolean**] | Whether the inactive locations should be included or not | (optional) defaults to undefined
 **receivingEnabled** | [**boolean**] | Return all the receiving enabled locations | (optional) defaults to undefined
 **accessGranted** | [**boolean**] | Return all the access granted locations | (optional) defaults to undefined


### Return type

**Array<Model10LocationGet200ResponseInner>**

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


