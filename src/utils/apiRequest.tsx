import _isEmpty from 'lodash/isEmpty';

import { toasts } from '../ui-component';
import { getValueFromLocalStorage, setValueInLocalStorage } from './common';

const baseUrl = process.env.REACT_APP_BASE_API_URL || '';

const getAuthToken = () =>
  getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token') || '';

const getRefreshToken = () => getValueFromLocalStorage('refreshToken') || '';

const saveAuthTokens = (auth_token: string, refresh_token?: string) => {
  if (auth_token) {
    setValueInLocalStorage('userToken', auth_token);
    setValueInLocalStorage('token', auth_token);
  }

  if (refresh_token) {
    setValueInLocalStorage('refreshToken', refresh_token);
  }

  window.localStorage.setItem('isAuthenticated', 'true');
};

const clearAuthAndRedirect = () => {
  window.localStorage.removeItem('isAuthenticated');
  window.localStorage.removeItem('userToken');
  window.localStorage.removeItem('token');
  window.localStorage.removeItem('refreshToken');

  toasts('error', 'Session expired. Please login again.', 'auth-expired');
  window.location.href = '/';
};
const makeApiRequest = async (url: string, config: any, retry = true): Promise<any> => {
  try {
    const token = getAuthToken();
    const boutique_id = getValueFromLocalStorage('boutique_id');

    // Build headers
    const updatedConfig: any = {
      ...config,
      headers: {
        ...(config?.headers || {}),
      },
    };

    // 🔹 x-boutique-id (don't use _isEmpty for numbers)
    if (boutique_id !== null && boutique_id !== undefined && boutique_id !== '') {
      updatedConfig.headers['x-boutique-id'] = String(boutique_id);
      // optional: also keep PascalCase if some services use that
      // updatedConfig.headers['X-Boutique-ID'] = String(boutique_id);
    }

    // 🔹 Authorization header
    if (!_isEmpty(token)) {
      updatedConfig.headers.Authorization = `Bearer ${token}`;
    }

    // Support both relative and absolute URLs
    const fullUrl = url.startsWith('http') ? url : baseUrl + url;

    const response = await fetch(fullUrl, updatedConfig);
    const { status, statusText } = response;
    const contentType = response.headers.get('Content-Type') || '';

    // 🔁 Handle auth failures (401/403) with refresh_token
    const isAuthEndpoint =
      url.includes('api/v1/auth/user/refresh_token') ||
      url.includes('api/v1/auth/user/generate_otp') ||
      url.includes('api/v1/auth/user/verify_otp');

    if ((status === 401 || status === 403) && retry && !isAuthEndpoint) {
      const refreshToken = getRefreshToken();

      if (!_isEmpty(refreshToken)) {
        try {
          const refreshResponse = await fetch(baseUrl + 'auth/user/refresh_token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();

            if (refreshData?.auth_token) {
              // Save new tokens
              saveAuthTokens(refreshData.auth_token, refreshData.refresh_token);

              // Retry original request ONCE with new token
              return makeApiRequest(url, config, false);
            }
          }

          // If refresh failed:
          clearAuthAndRedirect();

          return {
            data: null,
            rawHex: null,
            rawBuffer: null,
            isRawHex: false,
            status: false,
            message: 'Session expired',
          };
        } catch {
          clearAuthAndRedirect();

          return {
            data: null,
            rawHex: null,
            rawBuffer: null,
            isRawHex: false,
            status: false,
            message: 'Session expired',
          };
        }
      } else {
        clearAuthAndRedirect();

        return {
          data: null,
          rawHex: null,
          rawBuffer: null,
          isRawHex: false,
          status: false,
          message: 'Session expired',
        };
      }
    }

    // ===== Normal response handling =====
    let data: any = null;
    let rawHex: string | null = null;
    let rawBuffer: ArrayBuffer | null = null;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // For ESC/POS (thermal printer) or other binary responses
      rawBuffer = await response.arrayBuffer();
      const byteArray = new Uint8Array(rawBuffer);
      rawHex = Array.from(byteArray)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    }

    // Status Handling
    if (status >= 200 && status < 300) {
      if (data?.message) {
        toasts('success', data.message, 'success');
      }
    } else if (status >= 400) {
      toasts('error', data?.message || statusText, 'api-error');
    }

    return {
      data: data || null,
      rawHex: rawHex || null,
      rawBuffer: rawBuffer || null,
      isRawHex: !!rawHex,
      status: status >= 200 && status < 300,
      message: data?.message || '',
    };
  } catch (error: any) {
    if (error instanceof Error) {
      toasts('error', error.message, 'api-error');
    }

    return {
      data: null,
      rawHex: null,
      rawBuffer: null,
      isRawHex: false,
      status: false,
      message: error?.message || 'Unexpected error',
    };
  }
};

const getRequest = (url: string, headers: Record<string, any> = {}) => {
  const config = {
    method: 'GET',
    headers,
  };

  return makeApiRequest(url, config);
};

const postRequest = (
  url: string,
  params: any = {},
  isFormData = false,
  headers: Record<string, any> = {}
) => {
  const config = {
    method: 'POST',
    headers: isFormData
      ? {
          ...headers,
          // 'Content-Type': 'multipart/form-data', // browser sets this for FormData
        }
      : {
          ...headers,
          'Content-Type': 'application/json',
        },
    body: isFormData ? params : JSON.stringify(params),
  };

  return makeApiRequest(url, config);
};

const putRequest = (
  url: string,
  params: Record<string, any> = {},
  isFormData = false,
  headers: Record<string, any> = {}
) => {
  const config = {
    method: 'PUT',
    headers: isFormData
      ? {
          ...headers,
          // 'Content-Type': 'multipart/form-data',
        }
      : {
          ...headers,
          'Content-Type': 'application/json',
        },
    body: isFormData ? params : JSON.stringify(params),
  };

  return makeApiRequest(url, config);
};

const patchRequest = (
  url: string,
  params: Record<string, any> = {},
  headers: Record<string, any> = {}
) => {
  const config = {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return makeApiRequest(url, config);
};

const deleteRequest = (
  url: string,
  params: Record<string, any> = {},
  headers: Record<string, any> = {}
) => {
  const config = {
    method: 'DELETE',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  };

  return makeApiRequest(url, config);
};

export const api = {
  getRequest,
  postRequest,
  putRequest,
  patchRequest,
  deleteRequest,
};
