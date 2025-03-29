/**
 * The oAuth files are separate.  You would use them to make standalone calls.
 * The `access_token` provided from these calls is provided to `createShipBobApi` with the App name (see tests for usage)
 */
import { AuthorizeParametersAPI } from './types';

/**
 * Step 1
 * ------
 * ShipBob’s current OAuth implementation utilizes the Authorization Code Flow, which requires user interaction for authentication.
 * This design supports applications where end-users are expected to log in and authorize access.
 *
 * ShipBob doesn't support Client Credentials Flow, which allows server-to-server (S2S) authentication using only the client_id and client_secret.
 * However, ShipBob does not currently support this flow.
 *
 * - Access tokens are valid for 1 hour.
 * - Refresh tokens are valid for 30 days if not used.
 *
 * NOTE: that's why this method return a URL.  It's where you will send an end-user to authorize access.
 * NOTE: make sure to request 'offline_access', if you want the refresh token.
 * NOTE: the authorization code provided is good only for 2 minutes
 *
 * @param query
 * @param options
 * @returns
 */
export const oAuthGetConnectUrl = (query: AuthorizeParametersAPI /* | AuthorizeParametersWeb */) => {
  const url = new URL('https://auth.shipbob.com/connect/authorize');

  if (query.client_id === undefined) {
    throw new Error('You must have at least a client_id to authorize oAuth');
  }

  for (const param of Object.keys(query)) {
    // the number[] is probably wrong
    const authParam = param as keyof AuthorizeParametersAPI;
    if (query[authParam] === undefined) {
      continue;
    }

    const val =
      authParam === 'scope' // Array.isArray(...)
        ? query[authParam].join(' ')
        : // : typeof query[authParam] === 'string' ? query[authParam] : query[authParam].toString();
          query[authParam];
    url.searchParams.set(param, val);
  }
  // ie: put a breakpoint here and copy(url.href)
  return url.href;
};

export type ConnectToken =
  | {
      /**
       * What is this for?
       */
      id_token: string;
      /**
       * To access the API
       */
      access_token: string;
      expires_in: 3600;
      token_type: 'Bearer';
      /**
       * Use this to refresh your token (good for 30 days)
       *
       * NOTE: this is only supplied if you have requested the scope "offline_access"
       */
      refresh_token?: string;
      /**
       * space separated list of scopes that were approved by end user
       */
      scope: string;
    }
  | {
      /**
       * ie: 'invalid_grant'
       */
      error: string;
    };

export type ConnectTokenResponse =
  | {
      /**
       * Don't let this mislead you.  Still check the payload for 'error' (just means the request succeeded).
       */
      success: true;
      payload: ConnectToken;
    }
  | {
      success: false;
      text: string;
    };

/**
 * Step 2
 *
 * @param redirectUri not sure why this is needed
 * @param client_id from your ShipBob app
 * @param client_secret from your ShipBob app (only available at time of creation)
 * @param code provided in the callback from step 1
 */
export const oAuthGetAccessToken = async (
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  code: string
): Promise<ConnectTokenResponse> => {
  const response = await fetch('https://auth.shipbob.com/connect/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });

  const contentType = response.headers.get('content-type');
  if (contentType?.startsWith('application/json')) {
    return {
      success: true,
      payload: (await response.json()) as ConnectToken,
    };
  } else {
    return {
      success: false,
      text: await response.text(),
    };
  }
};

/**
 * Step 3+
 * -------
 *
 * 1) User first authenticates `oAuthGetAccessToken`
 *   - access token: ABC
 *   - refresh token: 123
 * 2) Refresh token: use refresh token 123 to request new token
 *   - access token: DEF
 *   - refresh token: 456
 * 3) Refresh token: use refresh token 456 to request new tokens
 *   - access token: GHI
 *   - refresh token: 789
 *
 * @param redirectUri not sure why this is needed
 * @param clientId from your ShipBob app
 * @param clientSecret from your ShipBob app (only available at time of creation)
 * @param refreshToken token provided from last authorization
 * @returns
 */
export const oAuthRefreshAccessToken = async (
  redirectUri: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<ConnectTokenResponse> => {
  const response = await fetch('https://auth.shipbob.com/connect/token', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const contentType = response.headers.get('content-type');
  if (contentType?.startsWith('application/json')) {
    return {
      success: true,
      payload: (await response.json()) as ConnectToken,
    };
  } else {
    return {
      success: false,
      text: await response.text(),
    };
  }
};
