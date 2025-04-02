import puppeteer, { Browser, Page } from 'puppeteer';

// import { getLatestSecret } from './SecretsManager';

export type AuthResponse =
  | { success: false; reason: string }
  | {
      success: true;
      accessToken: string;
      refreshToken: string;
      scopes: string[];
      // headers: Record<string, string>
    };

/**
 * This is the /connect/token in regular auth flow
 */
const SAVE_TOKEN_PAGE = '/Account/SaveToken';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Credentials = {
  email: string;
  password: string;
};

/**
 * Attempt to login and return an auth token (that can in turn be used to access API)
 */
const loginShipBob = async (page: Page, credentials: Credentials, waitTimoutInSeconds = 30): Promise<AuthResponse> => {
  // hopefully this doesn't change!
  await page.goto('https://web.shipbob.com/app/Merchant/#/Login', {
    timeout: 0, // no timeout - it's a slow page
  });

  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.waitForSelector('input[name=Username]');

  // <input name="Username" type="email" data-sb-automation="username-input" ...>
  await page.type('input[name=Username]', credentials.email);
  // await page.type('input[type="password"]', password);
  // <input name="Password" id="password-input" type="password" data-sb-automation="password-input">
  await page.type('input[name=Password]', credentials.password);

  // we will attach to this context as we progress authentication
  const context = {
    scopes: [] as string[],
  };

  const interceptorPromise = new Promise<AuthResponse>((resolve, reject) => {
    const loginTimoutHandle = setTimeout(() => {
      reject(new Error('timeout occured waiting to login'));
    }, waitTimoutInSeconds * 1000);

    // setup interception, before clicking login button
    page.setRequestInterception(true);
    // probably we could use only "request" and it would work, too. Untested.
    page.on('request', (request) => {
      const { host, pathname, searchParams } = new URL(request.url());
      // lots of the traffic for "i.clarity.ms", "px.ads.linkedin.com", "connect.facebook.net", "www.facebook.com", etc.
      // we only care about auth.shipbob.com and web.shipbob.com:
      if (host.endsWith('shipbob.com')) {
        console.log(`request > host:${host}${pathname.substring(10)}...`);
        switch (pathname) {
          case '/connect/authorize/callback':
            console.log(' > returning to shipbob UI...');
            break;
          case '/app/Merchant/signin-callback':
            // cancel timout for logging in (hopefully our continuation works.  CF clearance and API token).
            clearTimeout(loginTimoutHandle);
            console.log(' > Checking for code querystring fragment (and storing scope)');
            if (searchParams.has('code')) {
              const authToken = searchParams.get('code');
              const scopes = searchParams.get('scope');
              console.log('short-lived auth token received');
              if (authToken === null || scopes === null) {
                reject(new Error('Authtoken or scope null'));
                break;
              }
              // attach the scopes to context.  ie: channel_read not available
              const decodedScopes = decodeURIComponent(scopes);
              context.scopes = decodedScopes.split(' ');
            }
            break;
          // this seems to be what makes the account allow one login (everybody else gets spinners)
          // if you haven't hit this page, you will get a 401 with the "short-lived" token
          case SAVE_TOKEN_PAGE:
            {
              page.on('response', (event) => {
                const { host, pathname } = new URL(event.url());
                console.log(` > response from: ${host}${pathname}`);
                if (host.endsWith('shipbob.com')) {
                  if (pathname === SAVE_TOKEN_PAGE) {
                    const responseHeaders = event.headers();
                    const accessToken = responseHeaders['accesstoken'];
                    const refreshToken = responseHeaders['refreshtoken'];
                    if (accessToken === undefined) {
                      reject(new Error(`response is missing access token: ${Object.keys(responseHeaders)}`));
                    }

                    page.removeAllListeners();
                    resolve({
                      success: true,
                      accessToken,
                      refreshToken,
                      scopes: context.scopes,
                    });
                    return;
                  }
                }
              });
            }
            break;
          default:
            if (!pathname.endsWith('js') && !pathname.endsWith('css')) {
              // this is where cf-clearance cookies are set:
              console.log(` > Shipbob ignored path: ${pathname}`);
            }
            break;
        }
      }
      request.continue();
    });

    // kick off login process - navigation listeners are already registered
    Promise.all([page.waitForNavigation({ waitUntil: 'networkidle0' }), page.click('#login-button')]).then(() => {
      console.log(' > Login clicked (interceptors are running)');
    });
  });

  return interceptorPromise;
};

/**
 * Retrieves an auth and refresh token from web.shipbob.com Merchant Login
 *
 * NOTE: this is obviously brittle and unsupported - can break at any time - even a small UI update on ShipBob side.
 */
export const getAccessTokenUI = async (credentials: Credentials, timeoutInSeconds = 60): Promise<AuthResponse> => {
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true, // for v16.2.0
      // headless: 'new', // equivalent to headless:true in the future - use for Chrome > 112
      args: [
        '--no-sandbox', // not running as root
        '--disable-setuid-sandbox',
      ],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:136.0) Gecko/20100101 Firefox/136.0');

    const loginResponse = await loginShipBob(page, credentials, timeoutInSeconds);
    if (loginResponse.success !== true) {
      console.error('reason:', loginResponse.reason);
    }

    return loginResponse;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};
