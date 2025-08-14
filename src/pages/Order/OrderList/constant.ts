import type { Options } from '../../../components/FormComponents';

type TabListConfigType = {
  label: string;
  queryFilters: Record<string, any>;
  statusFilterOptions: Array<Options & { order: number }>;
  dateFilterOptions?: Record<string, boolean>;
};

export const tabListConfig: TabListConfigType[] = [
  {
    label: 'Active',
    queryFilters: {
      //   order_item_status_list: '1,2,3,4,6',
      order_status_list: '2',
    },
    statusFilterOptions: [
      { label: 'Accepted', value: '1', order: 1 },
      { label: 'Under Cutting', value: '2', order: 2 },
      { label: 'Under Finishing', value: '3', order: 4 },
      { label: 'Completed', value: '4', order: 5 },
      { label: 'Under Stitching', value: '6', order: 2 },
    ],
  },
  {
    label: 'Past Due',
    queryFilters: {
      order_status_list: '2',
      //   order_item_status_list: '1,2,3,4,6',
      delivery_date_till: new Date().toISOString().slice(0, 19),
    },
    statusFilterOptions: [
      { label: 'Accepted', value: '1', order: 1 },
      { label: 'Under Cutting', value: '2', order: 2 },
      { label: 'Under Finishing', value: '3', order: 4 },
      { label: 'Completed', value: '4', order: 5 },
      { label: 'Under Stitching', value: '6', order: 2 },
    ],
  },
  {
    label: 'Upcoming',
    queryFilters: {
      order_status_list: '2',
      //   order_item_status_list: '1,2,3,4,6',
      delivery_date_from: new Date().toISOString().slice(0, 19),
    },
    statusFilterOptions: [
      { label: 'Accepted', value: '1', order: 1 },
      { label: 'Under Cutting', value: '2', order: 2 },
      { label: 'Under Finishing', value: '3', order: 4 },
      { label: 'Completed', value: '4', order: 5 },
      { label: 'Under Stitching', value: '6', order: 2 },
    ],
  },
  {
    label: 'Pending Payment',
    queryFilters: {
      order_status_list: '3',
      payment_due: true,
      //   order_item_status_list: '5',
    },
    statusFilterOptions: [],
    dateFilterOptions: {
      deliveryDateFilter: true,
    },
  },
  {
    label: 'Delivered',
    queryFilters: {
      order_status_list: '3',
      //   order_item_status_list: '5',
    },
    statusFilterOptions: [],
    dateFilterOptions: {
      deliveryDateFilter: true,
    },
  },
  {
    label: 'Draft',
    queryFilters: {
      //   order_item_status_list: '7',
      order_status_list: '1',
    },
    statusFilterOptions: [],
  },
];

export const pageSize = 10;
export const defaultPaginationObj = {
  currentPage: 1,
  pageCount: 1,
};

export const orderTableHeaders = [
  {
    label: '',
    isSort: false,
    key: 'openChildTable',
    order: 0,
    isParent: true,
    isChild: false,
  },
  {
    label: 'Order Number',
    isSort: false,
    key: 'boutique_order_id',
    order: 1,
    isParent: true,
    isChild: false,
  },
  {
    label: 'Customer Name',
    isSort: false,
    key: 'customer_details.customer_name',
    order: 2,
    isParent: true,
  },
  {
    label: 'Phone Number',
    isSort: false,
    key: 'customer_details.phone_number',
    order: 3,
    isParent: true,
  },
  {
    label: 'Items',
    isSort: false,
    key: 'order_item_details',
    order: 4,
    isParent: true,
    isChild: true,
  },
  {
    label: 'Trial Date',
    isSort: false,
    key: 'trial_date',
    order: 5,
    isParent: false,
    isChild: true,
  },
  {
    label: 'Delivery Date',
    isSort: false,
    key: 'delivery_date',
    order: 6,
    isParent: false,
    isChild: true,
  },
  {
    label: 'Item Status',
    isSort: false,
    key: 'status',
    order: 7,
    isParent: false,
    isChild: true,
  },
  {
    label: 'Total Amount',
    isSort: false,
    key: 'total_amount',
    order: 4,
    isParent: true,
    isChild: true,
  },
  {
    label: '',
    isSort: false,
    key: 'openDetails',
    order: 0,
    isParent: true,
    isChild: true,
  },
];

export const outfitStatusFilterOptions = [
  { label: 'Accepted', value: 1, order: 1 },
  { label: 'Under Cutting', value: 2, order: 2 },
  { label: 'Under Finishing', value: 3, order: 4 },
  { label: 'Completed', value: 4, order: 5 },
  { label: 'Delivered', value: 5, order: 6 },
  { label: 'Under Stitching', value: 6, order: 3 },
  //   { label: 'Drafted', value: 7 },
];

export const outfitStatusOptions = {
  Accepted: outfitStatusFilterOptions
    .filter((option) => option.label !== 'Delivered')
    .sort((a, b) => a.order - b.order),
  'Under Cutting': outfitStatusFilterOptions
    .filter((option) => option.label !== 'Delivered')
    .sort((a, b) => a.order - b.order),
  'Under Finishing': outfitStatusFilterOptions
    .filter((option) => option.label !== 'Delivered')
    .sort((a, b) => a.order - b.order),
  Completed: outfitStatusFilterOptions.sort((a, b) => a.order - b.order),
  Delivered: outfitStatusFilterOptions.sort((a, b) => a.order - b.order),
  'Under Stitching': outfitStatusFilterOptions
    .filter((option) => option.label !== 'Delivered')
    .sort((a, b) => a.order - b.order),
  Drafted: [],
  '': outfitStatusFilterOptions.sort((a, b) => a.order - b.order),
};
