import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import type { OrderDetailsType, OrderItemType, StitchOptionsObj } from '../../type';

export const formatStitchOptionsApiResponse = (stitchOptionList: StitchOptionsObj[]) => {
  const updatedOptions = stitchOptionList.map((sideOption) => {
    const list = sideOption.stitch_options.map((option) => {
      if (option.type === 'counter') {
        return {
          ...option,
          value: 0,
        };
      }

      return option;
    });

    return {
      ...sideOption,
      stitch_options: list,
    };
  });

  return updatedOptions;
};

export const formatStitchOptionsPayload = (stitchOptionList?: StitchOptionsObj[]) => {
  const stitchDetails: Array<{
    stitch_option_id: number;
    values: string[];
  }> = [];

  stitchOptionList?.forEach((sideOption) => {
    sideOption.stitch_options.forEach((option) => {
      if (!_isNil(option.value)) {
        const valueToSet = option.value;

        if (!(option.type === 'counter' && valueToSet.toString() === '0')) {
          stitchDetails.push({
            stitch_option_id: option.id,
            values: option.type === 'counter' ? [valueToSet.toString()] : valueToSet,
          });
        }
      }
    });
  });

  return stitchDetails;
};

export const calulateOrderAmount = (order_details: OrderDetailsType) => {
  const { order_amount_details, order_items } = order_details;

  const totalAmount =
    order_items?.reduce((sum, item) => {
      return (
        sum +
        (item?.price_breakup
          ?.filter((priceObj) => !priceObj.is_deleted && priceObj.component !== '')
          ?.reduce((outfitTotal, priceObj) => {
            return outfitTotal + priceObj.component_quantity * (priceObj?.value ?? 0);
          }, 0) ?? 0)
      );
    }, 0) ?? 0;

  const finalOrderAmountDetails = {
    total_amount: totalAmount,
    advance_received:
      _isNil(order_amount_details) || _isNil(order_amount_details.advance_received)
        ? undefined
        : parseFloat(order_amount_details.advance_received.toString()),
    balance_due: totalAmount - (order_amount_details?.advance_received ?? 0),
  };

  return finalOrderAmountDetails;
};

export const formatOrderItemPayload = (currentOutfit: OrderItemType) => {
  const { cloth_images, audio_urls, ...currentOutfitPayload } = currentOutfit;

  currentOutfitPayload.cloth_image_reference_ids =
    cloth_images?.map((img) => img.reference_id) ?? [];

  currentOutfitPayload.audio_reference_ids = audio_urls?.map((file) => file.reference_id) ?? [];

  currentOutfitPayload.price_breakup =
    currentOutfitPayload?.price_breakup?.map((price) => {
      return {
        ...price,
        value: _isNil(price?.value) ? null : parseFloat(price.value.toString()),
      };
    }) ?? [];

  currentOutfitPayload.amount_refunded = _isNil(currentOutfitPayload.amount_refunded)
    ? null
    : parseFloat(currentOutfitPayload.amount_refunded.toString());

  return currentOutfitPayload;
};

export const formatOrderpayload = (order_details: OrderDetailsType) => {
  const { order_items, ...currentOrderDetails } = order_details;

  const updatedOrderItems = order_items.map((item) => {
    const { cloth_images, audio_urls, ...currentItemPayload } = item;

    currentItemPayload.cloth_image_reference_ids =
      cloth_images?.map((img) => img.reference_id) ?? [];

    currentItemPayload.audio_reference_ids = audio_urls?.map((file) => file.reference_id) ?? [];

    currentItemPayload.price_breakup =
      currentItemPayload?.price_breakup?.map((price) => {
        return {
          ...price,
          value: _isNil(price?.value) ? null : parseFloat(price.value.toString()),
        };
      }) ?? [];

    return currentItemPayload;
  });

  currentOrderDetails.order_items = updatedOrderItems;
  currentOrderDetails.order_amount_details = calulateOrderAmount(order_details);

  const orderPayload = {
    order_details: currentOrderDetails,
  };

  return orderPayload;
};

export const validateOrderItem = (item: OrderItemType) => {
  let isValid = true;

  if (_isNil(item.delivery_date) || _isEmpty(item.delivery_date)) {
    isValid = false;
  }

  //   if (_isNil(item.price_breakup) || _isEmpty(item.price_breakup)) {
  //     isValid = false;
  //   } else {
  //     const stitchingPriceObj = item.price_breakup.find((obj) => obj.component === 'Stitching Cost');

  //     if (_isNil(stitchingPriceObj) || _isNil(stitchingPriceObj.value)) {
  //       isValid = false;
  //     }
  //   }

  return isValid;
};
