// import { httpStatusCodes } from './contant';
import _isEmpty from 'lodash/isEmpty';

import { toasts } from '../ui-component';
//import { getValueFromLocalStorage } from './common';
import { auth } from '../firbase/index';
import { getValueFromLocalStorage } from './common';

// const { fetch: originalFetch } = window;

// window.fetch = async (...args) => {
//   const [resource, config] = args;
//   // request interceptor starts
//   // resource = 'https://jsonplaceholder.typicode.com/todos/2';
//   const controller = new AbortController();
//   //   const timeoutId = setTimeout(() => controller.abort(), 300000);
//   let updatedConfig = {
//     ...config,
//     headers: {
//       ...config?.headers,
//       //   Authorization: getValueFromLocalStorage('accessToken') ?? '',
//     },
//     signal: controller.signal,
//   };

//   //   if (process.env.NODE_ENV === 'development') {
//   //     updatedConfig = {
//   //       ...updatedConfig,
//   //       headers: {
//   //         ...config?.headers,

//   //         frontEnv: 'local',
//   //       },
//   //     };
//   //   }

//   // request interceptor ends
//   // console.log('Config:', config);

//   await originalFetch(resource, updatedConfig);

//   // response interceptor here
//   // if(response.status === httpStatusCodes.UNAUTHORIZED){
//   //

//   return Promise.reject('Logging Out');
// };

const baseUrl = process.env.REACT_APP_BASE_API_URL;

const makeApiRequest = async (url: string, config: any) => {
  try {
    const token = await auth.currentUser?.getIdToken();
    const boutique_id = getValueFromLocalStorage('boutique_id');

    const updatedConfig = {
      ...config,
      headers: {
        ...config.headers,
        'X-Boutique-ID': boutique_id, // <-- Add this line
      },
    };

    if (!_isEmpty(token)) {
      updatedConfig.headers = {
        ...updatedConfig.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    const response = await fetch(baseUrl + url, updatedConfig);
    const { status, statusText } = response;
    const contentType = response.headers.get('Content-Type');
    3;

    let data = null;
    let rawHex: string | null = null;
    let rawBuffer: ArrayBuffer | null = null;

    if (
      contentType &&
      (contentType.includes('application/json') || contentType.includes('application/problem+json'))
    ) {
      data = await response.json();
    } else {
      // For ESC/POS (thermal printer)
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
      toasts('error', data?.message || data?.detail || statusText, 'api-error');
    }

    const responseData = {
      data: data || null,
      rawHex: rawHex || null,
      rawBuffer: rawBuffer || null,
      isRawHex: !!rawHex,
      status: status >= 200 && status < 300,
      message: data?.message || '',
    };

    return responseData;
  } catch (error: any) {
    if (error instanceof Error) {
      toasts('error', error.message, 'api-error');
    }

    return error;
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
          //   'Content-Type': 'multipart/form-data',
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
          //   'Content-Type': 'multipart/form-data',
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
    headers,
    body: params,
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
    headers,
    body: params,
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
