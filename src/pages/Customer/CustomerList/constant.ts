import { integerRegex, mobileNumberRegex } from '../../../utils/regexValue';
import { CustomerDetailsType } from '../types';

export const validateCustomerDetailsObject: Record<keyof CustomerDetailsType, any> = {
  age: {
    regex: integerRegex,
  },
  country_code: {},
  phone_number: {
    regex: mobileNumberRegex,
  },
  name: {
    isRequired: {
      required: true,
      errMsg: 'This field is required',
    },
  },
  gender: {
    isRequired: {
      required: true,
      errMsg: 'This field is required',
    },
  },
  customer_image_urls: {},
  boutique_id: {
    isRequired: {
      required: true,
      errMsg: 'This field is required',
    },
  },
};

export const defaultErrorObj = {
  age: '',
  phone_number: '',
  country_code: '',
  name: '',
  boutique_id: '',
  gender: '',
  customer_image_urls: '',
};
