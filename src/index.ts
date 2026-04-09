import { CreateOptions } from './types';

import { client } from './client/2026-01/client.gen';
import { get202601Channel } from './client/2026-01/sdk.gen';
import type { ChannelsChannelViewModel } from './client/2026-01/types.gen';

export * from './types';
export * from './oAuth';
// exporting will require puppeteer in client
// export * from './WebScraper';

export type Nullable<T> = T | null;

export type Credentials = {
  token: string;
  channelId?: number;
};

const REMAINING_CALLS = 'x-remaining-calls'; // in sliding window
const RETRY_AFTER_SECONDS = 'x-retry-after'; // seconds to wait for rate-limiting

const IGNORED_HEADERS = [
  'cf-cache-status',
  'cf-ray',
  'connection',
  'content-encoding',
  'content-length',
  // 'content-type', // useful for failed responses
  'date',
  'request-context',
  'server',
  'strict-transport-security',
  'transfer-encoding',
  'vary',
  'x-powered-by',
  REMAINING_CALLS, // part of rateLimit: {}
  RETRY_AFTER_SECONDS, // part of rateLimit: {}
];

// single-merchant application
const DEFAULT_CHANNEL_APPLICATION_NAME = 'SMA';

export type ClientGetResult<TData = unknown, TError = unknown> = Awaited<ReturnType<typeof client.get<TData, TError>>>;
export type ClientPostResult<TData = unknown, TError = unknown> = Awaited<
  ReturnType<typeof client.post<TData, TError>>
>;

/**
 * Create an authenticated API client for the 2026-01 OpenAPI endpoints.
 * Loads channels and selects one to send as `shipbob_channel_id` header on all requests (@see options parameter).
 *
 * The issue with this is that it calls static methods on the client, so you can't have multiple instances configured differently.
 * We could return a client and then it could be passed explicitly to the imported methods.
 *
 * @param token Personal Access Token (PAT) or `accessToken` (from web scraper)
 * @param baseUrl API base URL — defaults to `https://sandbox-api.shipbob.com`.  Must provide for production.
 * @param channelPredicateOrApplicationName Application name string or predicate to select a channel. Defaults to 'SMA'.
 * @returns Authenticated client with channel header configured
 */
export const createAPI = async (
  token: string,
  baseUrl: 'https://api.shipbob.com' | 'https://sandbox-api.shipbob.com' = 'https://sandbox-api.shipbob.com',
  channelPredicateOrApplicationName:
    | string
    | ((
        channels: ChannelsChannelViewModel[]
      ) => ChannelsChannelViewModel | undefined) = DEFAULT_CHANNEL_APPLICATION_NAME,
  options: CreateOptions = {
    logTraffic: false,
    skipChannelLoad: false,
  }
) => {
  if (!token) {
    throw new Error('A PAT or oAuth token is required to create a ShipBob API client');
  }

  const normalizedBaseUrl = baseUrl.startsWith('https://') ? baseUrl : `https://${baseUrl}`;
  client.setConfig({
    baseUrl: normalizedBaseUrl,
    auth: token,
  });

  client.interceptors.response.clear();
  client.interceptors.response.use((response, _request) => {
    if (options.logTraffic) {
      const remainingCalls = response.headers.has(REMAINING_CALLS)
        ? parseInt(response.headers.get(REMAINING_CALLS)!)
        : null;
      const retryAfter = response.headers.has(RETRY_AFTER_SECONDS)
        ? parseInt(response.headers.get(RETRY_AFTER_SECONDS)!)
        : null;

      if (remainingCalls !== null || retryAfter !== null) {
        console.log(` > remaining calls: ${remainingCalls} - retry after: ${retryAfter}`);
      }

      const headers = Array.from(response.headers).reduce<Record<string, string>>((prev, [key, val]) => {
        if (IGNORED_HEADERS.indexOf(key) === -1) {
          prev[key] = val;
        }
        return prev;
      }, {});

      console.log(
        ` > Response headers: ${JSON.stringify(
          Object.keys(headers)
            .map((key) => `${key}:${headers[key]}}`)
            .join(',')
        )}`
      );
    }
    return response;
  });

  let selectedChannel: ChannelsChannelViewModel | undefined = undefined;

  if (options.skipChannelLoad !== true) {
    const { data, error } = await get202601Channel();
    if (error) {
      throw new Error(`Failed to load channels: ${JSON.stringify(error)}`);
    }

    const channels = data?.items ?? [];
    selectedChannel =
      typeof channelPredicateOrApplicationName === 'string'
        ? channels.find((c) => c.application_name === channelPredicateOrApplicationName)
        : channelPredicateOrApplicationName(channels);

    if (!selectedChannel?.id) {
      throw new Error(
        `Did not find channel. Available application names: {${channels.map((c) => c.application_name).join(',')}}`
      );
    }
  }

  client.interceptors.request.clear();
  client.interceptors.request.use((request, _options) => {
    if (options.extraHeaders) {
      for (const key of Object.keys(options.extraHeaders)) {
        request.headers.set(key, options.extraHeaders[key]);
      }
    }

    if (options.sendChannelId && selectedChannel && selectedChannel.id) {
      request.headers.set('shipbob_channel_id', selectedChannel.id.toString());
    }

    // Their API only works using unescaped reserved characters.  Since we aren't passing "," or ":" ever then this is safe (for us).
    // If a caller is searching for ie: products with those characters in the name then this may fail.
    // ie: https://.../experimental/product?sku=any%3A123%2C456 => https://.../experimental/product?sku=any:123,456
    // NOTE: both replacements are needed for above to work
    const url = request.url.replace(/%2C/g, ',').replace(/%3A/g, ':');
    const newRequest = new Request(url, request);

    if (options.logTraffic) {
      console.log(`> ${newRequest.method}: '${newRequest.url}'`);
      if (newRequest.method !== 'GET' && newRequest.bodyUsed) {
        const utf8Stream = newRequest.body?.pipeThrough(new TextDecoderStream());
        console.log(`  > body: ${utf8Stream}`);
      }
    }

    return newRequest;
  });

  client.setConfig({
    headers: {
      'User-Agent': 'shipbob-node-sdk',
    },
  });

  // allows caller to alter options after API creation (same instance)
  return {
    options,
    /**
     *
     * @param path should include leading slash (api version is included automatically)
     * @returns
     */
    get: async <TData = unknown, TError = unknown>(path: string): Promise<ClientGetResult<TData, TError>> => {
      const response = await client.get<TData, TError>({
        security: [{ scheme: 'bearer', type: 'http' }],
        url: `/2026-01${path}`,
      });

      return response;
    },
    /**
     *
     * @param path should include leading slash (api version is included automatically)
     * @param body request body
     * @returns
     */
    post: async <TData = unknown, TError = unknown>(
      path: string,
      body?: unknown
    ): Promise<ClientPostResult<TData, TError>> => {
      const response = await client.post<TData, TError>({
        security: [{ scheme: 'bearer', type: 'http' }],
        url: `/2026-01${path}`,
        body,
      });

      return response;
    },
  };
};
