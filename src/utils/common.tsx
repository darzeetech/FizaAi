import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { RegexObj } from './regexValue';

export const validateValueWithRegex = (value: string, regex: RegexObj) => {
  let valid = true;

  const { expression } = regex;
  let { message = '' } = regex;

  if (_isNil(expression) || _isEmpty(expression)) {
    valid = false;
    message = 'Please Provide valid Regex';
  } else {
    const regexExp = new RegExp(expression);

    if (regexExp.test(value)) {
      valid = true;
      message = '';
    } else {
      valid = false;
    }
  }

  return {
    valid,
    message,
  };
};

export const getValueFromLocalStorage = (key: string) => {
  // if (key == 'token') {
  //   return 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI5MDkwOTA5MDkwIiwiZXhwIjoyMDIxOTkwODU3LCJpYXQiOjE3MDY2MzA4NTd9.yDtMUM5ofpiVHRXQ8WVqVdrwSug44db5Vt1RRGsPOYX963MtM-Iv872V2DNSe_xCmQ2LKQFkcDpl3YawAs2D4w';
  // }
  const value = window.localStorage.getItem(key);

  return value !== 'undefined' && !_isNil(value) ? JSON.parse(value) : '';
};

export const setValueInLocalStorage = (key: string, data: any) => {
  return window.localStorage.setItem(key, JSON.stringify(data));
};

export const setDataAtKeyInNestedObject = (
  data: Record<string, any> | undefined,
  key: string,
  value: any
) => {
  if (_isNil(data)) {
    data = {};
  }

  if (_isEmpty(key)) {
    return data;
  }

  let schema = data;
  const keysList = key.split('.');

  for (let i = 0; i < keysList.length - 1; i++) {
    const currentKey = keysList[i];

    if (_isNil(schema[currentKey])) {
      return data;
    } else {
      schema = schema[currentKey];
    }
  }

  const lastKey = keysList[keysList.length - 1];
  schema[lastKey] = value;

  return data;
};

export const getValueAtKeyInNestedObject = (data: Record<string, any>, key: string) => {
  if (_isNil(data) || _isEmpty(key)) {
    return null;
  }

  const keysList = key.split('.');

  for (let i = 0; i < keysList.length; i++) {
    const currentKey = keysList[i];

    if (_isNil(data[currentKey])) {
      return null;
    } else {
      data = data[currentKey];
    }
  }

  return data;
};

export const getInitailsOfName = (name: string) => {
  const words = name.split(' ');

  if (words.length === 1) {
    // If there's only one word, return the first two characters
    return name.slice(0, 2).toUpperCase();
  } else {
    // If there are multiple words, return the first character of each word
    return words.map((word) => word.charAt(0).toUpperCase()).join('');
  }
};

export const validateDataBasedOnConfig = (
  validtionConfig: Record<string, any>,
  data: Record<string, any>
) => {
  let isValid = true;
  let errorData: Record<string, any> = {};

  Object.keys(validtionConfig).forEach((key) => {
    if (!_isNil(validtionConfig[key].isRequired) && validtionConfig[key].isRequired.required) {
      if (_isNil(data) || _isNil(data[key])) {
        isValid = false;
        errorData = {
          ...errorData,
          [key]: validtionConfig[key].errMsg ?? 'This field is required',
        };
      }
    }

    if (!_isNil(validtionConfig[key].regex) && !_isEmpty(data[key])) {
      const { valid, message } = validateValueWithRegex(data[key], validtionConfig[key].regex);
      isValid = valid;
      errorData = {
        ...errorData,
        [key]: message,
      };
    }
  });

  return {
    isValid,
    errorData,
  };
};

export const handleDownloadInvoice = async (link: string, fileName = 'downloaded_file.pdf') => {
  try {
    const response = await fetch(link);
    const blob = await response.blob(); // Create a blob from the response
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName; // The name of the downloaded file
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    a.remove();
  } catch (err) {
    if (err instanceof Error) {
      // eslint-disable-next-line
      console.log(err.message);
    }
  }
};

export const convertUrlStringToObject = (url: string) => {
  const params = new URLSearchParams(url.split('?')[1]);
  const entries: [string, string][] = [];
  params.forEach((value, key) => {
    entries.push([key, value]);
  });

  return Object.fromEntries(entries);
};

export const convertObjectToQueryString = (obj: Record<string, any>) => {
  const params = new URLSearchParams();

  for (const key in obj) {
    const value = obj[key];
    const hasValue =
      typeof value === 'number' ? !_isNil(value) : !_isNil(value) && !_isEmpty(value);

    if (hasValue) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
};

export const convertNumberOrStringToPriceFormat = (price: number | string) => {
  return Intl.NumberFormat('en-IN').format(typeof price === 'string' ? parseFloat(price) : price);
};

//eslint-disable-next-line
export const sendToGA = function (...args: any[]) {
  if (!_isNil(window.dataLayer)) {
    //eslint-disable-next-line
    window.dataLayer.push(arguments);
  }
};

export const installGA = (trackingId: string) => {
  const scriptId = 'ga-gtag';

  if (!_isNil(document.getElementById(scriptId))) {
    return;
  }

  const { head } = document;
  const script = document.createElement('script');
  script.id = scriptId;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;

  head.insertBefore(script, head.firstChild);

  window.dataLayer = window.dataLayer ?? [];

  sendToGA('js', new Date());
  sendToGA('config', trackingId);
};

export const installAIBot = () => {
  const script = document.createElement('script');
  script.src = 'https://app.wonderchat.io/scripts/wonderchat.js';

  script.setAttribute('data-name', 'wonderchat');
  script.setAttribute('data-address', 'app.wonderchat.io');
  script.setAttribute('data-id', 'clw8ffx8u01aouu0wonlp70b1');
  script.setAttribute('data-widget-size', 'normal');
  script.setAttribute('data-widget-button-size', 'normal');

  const { body } = document;

  body.appendChild(script);
};
