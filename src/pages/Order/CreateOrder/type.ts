import type { FormFieldType } from '../../../components/FormComponents';
import type { ImageObjType } from '../../../ui-component';
import { StitchOptionSummaryObj } from '../components/MesurementSummary';
import type { CustomMeasurementsDetailsType } from './components/OrderDetails/components/Measurements/CustomMeasurements';

export type OrderPriceBreakupType = {
  component: string;
  value: number | null;
  component_quantity: number;
  id?: number;
  is_deleted?: boolean;
};

export type OrderItemType = {
  is_priority_order: boolean;
  is_deleted?: boolean;
  trial_date: string;
  delivery_date: string;
  outfit_type: number;
  outfit_alias: string;
  order_type: string;
  inspiration: string;
  special_instructions: string;
  item_quantity: number;
  cloth_images: ImageObjType[];
  audio_urls: ImageObjType[];
  price_breakup: OrderPriceBreakupType[];
  cloth_image_reference_ids?: string[];
  audio_reference_ids?: string[];
  measurement_revision_id?: number;
  stitch_option_references?: number[];
  id?: number;
  measurement_details?: {
    measurement_image_link?: string;
    inner_measurement_details?: CustomMeasurementsDetailsType[];
  };
  //   order_item_stitch_options?: Record<string, StitchOptionsObj[]>;
  order_item_stitch_options: Record<string, StitchOptionSummaryObj[]>;
  audio_file_details?: any;
  amount_refunded?: number | null;
};

export type OrderDetailsType = Record<string, any> & {
  order_items: OrderItemType[];
  order_id?: number;
  boutique_order_id?: number;
  order_status?: string;
  order_amount_details?: OrderAmountDetailsType;
};

export type OrderAmountDetailsType = {
  total_amount: number;
  advance_received?: number;
  balance_due: number;
};

export type OutfitDetailsType = {
  outfit_index: number;
  outfit_name: string;
  outfit_details_title: string;
  outfit_link: string;
  pieces: number;
  portfolio_eligible: boolean;
  stitch_options_exist: boolean;
};

export type StitchOptionsObj = {
  side: string;
  stitch_options: FormFieldType[];
};
