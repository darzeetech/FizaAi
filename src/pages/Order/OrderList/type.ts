export type OrderItemListType = {
  id: number;
  is_priority_order: boolean;
  outfit_type: string;
  outfit_type_index: number;
  outfit_type_image_link: string;
  trial_date: string;
  delivery_date: string;
  pieces: number;
  item_quantity: number;
  order_id: number;
  customer_name: string;
  status: string;
  outfit_alias: string;
};

export type OrderListType = {
  order_id: number;
  boutique_order_id: number;
  order_status: string;
  order_item_details: OrderItemListType;
  order_amount_details: {
    total_amount: number;
    advance_received: number;
    balance_due: number;
  };
  customer_details: {
    customer_name: string;
    customer_id: number;
    phone_number: string;
    age: number;
    profile_pic_link: string;
    gender: string;
  };
};

export type OutfitObjType = {
  outfit_type: string;
  outfit_type_image_link: string;
  item_id: number;
  outfit_alias: string;
};
