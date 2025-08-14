export type listDataType = Record<string, any>;

export type CustomerDetailsType = {
  age: number;
  phone_number: string;
  country_code: string;
  name: string;
  boutique_id: number;
  gender: string;
  customer_image_urls: Record<string, string>;
};

export type CustomerDetailsErrorType = Record<keyof CustomerDetailsType, string>;
