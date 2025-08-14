import { createSlice } from '@reduxjs/toolkit';
import type {
  OrderDetailsType,
  OrderAmountDetailsType,
  OutfitDetailsType,
  StitchOptionsObj,
} from '../type';

type CreateOrderReducerType = {
  order_details: OrderDetailsType;
  order_amount_details: OrderAmountDetailsType;
  customer_details: Record<string, any>;
  outfit_list: OutfitDetailsType[];
  selected_outfits: Record<string, OutfitDetailsType>;
  outfit_stitch_options: Record<string, StitchOptionsObj[]>;
  saved_stitch_option_ref_ids: Record<string, number[]>;
};

const initialState: CreateOrderReducerType = {
  order_details: {
    order_items: [],
    order_amount_details: {
      total_amount: 0,
      advance_received: 0,
      balance_due: 0,
    },
  },
  order_amount_details: {
    total_amount: 0,
    advance_received: 0,
    balance_due: 0,
  },
  customer_details: {},
  outfit_list: [],
  selected_outfits: {},
  outfit_stitch_options: {},
  saved_stitch_option_ref_ids: {},
};

export const CreateOrderSlice = createSlice({
  name: 'Create Order',
  initialState,
  reducers: {
    updateOrderDetails: (state, action) => {
      const data = action?.payload?.data || {};
      state.order_details = data;
    },
    updateOrderAmountDetails: (state, action) => {
      const data = action?.payload?.data || {};
      state.order_amount_details = data;
    },
    updateCustomerDetails: (state, action) => {
      const data = action?.payload?.data || {};
      state.customer_details = data;
    },
    updateCustomerDetailsa: (state, action) => {
      const data = action?.payload?.data || {};
      state.customer_details = data;
    },
    updateOutfitList: (state, action) => {
      const data = action?.payload?.data || [];
      state.outfit_list = data;
    },
    updateSelectedOutfits: (state, action) => {
      const data = action?.payload?.data || {};
      state.selected_outfits = data;
    },
    updteOutfitStitchOptions: (state, action) => {
      const data = action?.payload?.data || {};
      state.outfit_stitch_options = data;
    },
    updateStitchOptionRefIds: (state, action) => {
      const data = action?.payload?.data || {};
      state.saved_stitch_option_ref_ids = data;
    },
    clearOrderDetailsReducer: (state) => {
      //   state.order_details = {
      //     order_items: [],
      //   };
      state.order_amount_details = {
        total_amount: 0,
        advance_received: 0,
        balance_due: 0,
      };
      state.outfit_stitch_options = {};
    },
    clearAllCreateOrderReducer: (state) => {
      state.order_details = {
        order_items: [],
      };
      state.order_amount_details = {
        total_amount: 0,
        advance_received: 0,
        balance_due: 0,
      };
      state.customer_details = {};
      state.outfit_list = [];
      state.selected_outfits = {};
      state.outfit_stitch_options = {};
    },
  },
});

export const {
  updateOrderDetails,
  updateOrderAmountDetails,
  updateCustomerDetails,
  updateCustomerDetailsa,
  updateOutfitList,
  updateSelectedOutfits,
  updteOutfitStitchOptions,
  updateStitchOptionRefIds,
  clearOrderDetailsReducer,
  clearAllCreateOrderReducer,
} = CreateOrderSlice.actions;
export default CreateOrderSlice.reducer;
