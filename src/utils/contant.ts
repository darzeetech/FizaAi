import type { RoutePathOptionType } from './type';

export const httpStatusCodes = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  SERVER_FAILED: 500,
};

export const routePathOptions: RoutePathOptionType[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
  },
  {
    path: '/orders',
    label: 'Orders',
    formType: {
      create: 'Add Order Details',
      edit: 'Edit Order Details',
      'order-summary': 'Order Summary',
    },
    showBackIcon: true,
    previousUrl: '/select-outfit',
  },
  {
    path: '/select-customer',
    label: 'Select or add customer',
    showBackIcon: true,
    previousUrl: '/dashboard',
  },
  {
    path: '/select-outfit',
    label: 'Select Outfits',
    showBackIcon: true,
    previousUrl: '/select-customer',
  },
  {
    path: '/orders-list',
    label: 'Orders',
  },
  {
    path: '/customers',
    label: 'Customers',
  },
];

export const moneyFormatSigns = {
  rupee: '\u20B9',
};

export const GA_ID = 'G-67MM2LW547';
