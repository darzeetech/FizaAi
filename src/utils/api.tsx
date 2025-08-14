import _isEmpty from 'lodash/isEmpty';
import { setValueInLocalStorage } from './common';

const baseUrl = process.env.REACT_APP_BASE_API_URL;

export const getApiData = async (url: string) => {
  if (!_isEmpty(url)) {
    let response = await fetch(baseUrl + url);
    response = await response.json();
    // console.log('getApiData', response);

    return response;
  }
};

export const logoutRequest = () => {
  setValueInLocalStorage('token', '');
  window.localStorage.clear();
};
