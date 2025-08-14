import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import { moneyFormatSigns } from '../../../../../utils/contant';
import { RootState } from '../../../../../store';
import { api } from '../../../../../utils/apiRequest';
import { positiveNumberRegex } from '../../../../../utils/regexValue';
import {
  convertNumberOrStringToPriceFormat,
  getValueFromLocalStorage,
  setDataAtKeyInNestedObject,
} from '../../../../../utils/common';
import {
  InputField,
  AudioRecordField,
  BulkImageUploadField,
} from '../../../../../components/FormComponents';

import { Button, Loader, toasts, Text } from '../../../../../ui-component';
import { RightArrowIcon } from '../../../../../assets/icons';

import MeasurementSummary from '../../../components/MesurementSummary';
import { updateOrderDetails } from '../../reducer';
import type { OrderDetailsType } from '../../type';
import { formatOrderpayload } from '../OrderDetails/helperFunction';

import { OutfitChipContent } from '../../../OrderList/component/OutfitSummaryDetails/style';
import { OrderSummaryContainer, SummaryDetailsContainer, SummaryHeaderContainer } from './style';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { order_details, customer_details, selected_outfits } = createOrderReducer;
  const { order_items, order_status, order_id, boutique_order_id, order_amount_details } =
    order_details;

  const orderConfirmRequired = order_status === 'Drafted';

  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number>();
  const [hasItemDetails, setHasItemDetails] = useState<Record<number, boolean>>({});

  const totalSelectedOutfits = Object.keys(selected_outfits).length;

  useEffect(() => {
    window.addEventListener('resize', () => {
      calculateHeight();
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  useEffect(() => {
    calculateHeight();
  }, [totalSelectedOutfits]);

  useEffect(() => {
    const hasItemDetailsMap = order_items.reduce(
      (acc, currItem) => ({
        ...acc,
        [currItem.id ?? -1]:
          !_isNil(currItem.id) && !_isNil(hasItemDetails[currItem.id])
            ? hasItemDetails[currItem.id]
            : false,
      }),
      {}
    );

    setHasItemDetails(hasItemDetailsMap);

    setSelectedItemId(order_items.length > 0 ? order_items[0].id : undefined);
  }, [order_items.length]);

  const calculateHeight = () => {
    const outfitListDiv = document.getElementById('outfit-list');
    const outfitDetailsDiv = document.getElementById('outfit-details-container');

    if (!_isNil(outfitDetailsDiv)) {
      const height = outfitListDiv?.getBoundingClientRect().height ?? 80;

      outfitDetailsDiv.style.height = `calc(100vh - 120px -  120px - 24px - ${height}px)`;
    }
  };

  useEffect(() => {
    if (!_isNil(selectedItemId) && !hasItemDetails[selectedItemId]) {
      void handleGetSelectedItemData(selectedItemId);
    }
  }, [selectedItemId]);

  const handleGetSelectedItemData = async (id: number) => {
    try {
      setIsLoading(true);
      const response = await handleGetOrderItem(id);

      if (!_isEmpty(response)) {
        const updatedOrderItems = order_items.map((item) => {
          if (item.id === id) {
            return response;
          }

          return item;
        });

        // Update Order Details
        dispatch(
          updateOrderDetails({
            data: {
              ...order_details,
              order_items: updatedOrderItems,
            },
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'get-order-item-details-error');
      }
    }

    setHasItemDetails({
      ...hasItemDetails,
      [id]: true,
    });

    setIsLoading(false);
  };

  //eslint-disable-next-line
  const getAllOrderItems = async () => {
    const updatedOrderItems: any[] = Array.from({ length: order_items.length }, (_, index) => ({
      id: order_items[index].id,
    }));

    try {
      setIsLoading(true);

      await Promise.all(
        order_items.map(async (itemObj, index) => {
          const { id } = itemObj;

          if (!_isNil(id)) {
            const response = await handleGetOrderItem(id);
            updatedOrderItems[index] = response;
          }

          return {};
        })
      );

      dispatch(
        updateOrderDetails({
          data: {
            ...order_details,
            order_items: updatedOrderItems,
          },
        })
      );

      setSelectedItemId(updatedOrderItems.length > 0 ? updatedOrderItems[0].id : undefined);
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'get-all-order-item-error');
      }
    }
    setIsLoading(false);
  };

  const handleGetOrderItem = async (id: number) => {
    try {
      const response = await api.getRequest(`order_item/${id}`);
      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        const updatedCurrentOutfit = {
          ...data,
          order_type: data.type?.toLowerCase() ?? '',
          outfit_type: data.outfit_type_index,
          cloth_images: data.cloth_image_file_details ?? [],
          audio_urls: data.audio_file_details ?? [],
          price_breakup: data.price_breakup_summary_list ?? data.price_breakup ?? [],
        };

        return updatedCurrentOutfit;
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'get-order-item-error');
      }
    }

    return {};
  };

  const handleUpdateOrder = async () => {
    try {
      setIsLoading(true);
      const orderPayload = formatOrderpayload(order_details);
      const response = await api.postRequest('order/', orderPayload);

      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        const { order_id } = data;

        const updatedOrderItems = order_items.map((item, index) => {
          return {
            ...item,
            id: data.order_item_summary_list[index].id,
            price_breakup: item.price_breakup.map((priceObj, i) => ({
              ...priceObj,
              id: data.order_item_summary_list[index].price_breakup[i].id,
            })),
          };
        });

        // Update Order Details
        dispatch(
          updateOrderDetails({
            data: {
              ...order_details,
              order_id,
              order_items: updatedOrderItems,
            },
          })
        );

        if (!orderConfirmRequired) {
          navigate('/orders-list');
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'update-order-error');
      }
    }
    setIsLoading(false);
  };

  const handleConfirmOrder = async () => {
    try {
      setIsLoading(true);
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const response = await api.postRequest(
        `order/${order_id}/confirm?boutique_id=${boutique_id}`,
        {
          order_details: {
            order_amount_details: {
              ...order_amount_details,
              advance_received: parseFloat(
                (order_amount_details?.advance_received ?? 0).toString()
              ),
            },
          },
        }
      );

      const { status } = response;

      if (status) {
        navigate('/orders-list');
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'confirm-order-error');
      }
    }
    setIsLoading(false);
  };

  const currentItemDetails = order_items.find((itemObj) => itemObj.id === selectedItemId);

  const handleChange = (value: any, key: string) => {
    let updatedData = structuredClone(order_details);
    updatedData = setDataAtKeyInNestedObject(updatedData, key, value) as OrderDetailsType;

    const balanceDue = (order_amount_details?.total_amount ?? 0) - (value ?? 0);

    updatedData = setDataAtKeyInNestedObject(
      updatedData,
      'order_amount_details.balance_due',
      balanceDue
    ) as OrderDetailsType;

    // Update Order Details
    dispatch(
      updateOrderDetails({
        data: {
          ...updatedData,
        },
      })
    );
  };

  return (
    <OrderSummaryContainer>
      <SummaryHeaderContainer>
        <Button appearance="outlined" bgColor="var(--color-nightRider)" onClick={handleUpdateOrder}>
          {orderConfirmRequired ? `Save as draft` : 'Submit'}
        </Button>
        {orderConfirmRequired && (
          <Button trailingIcon={<RightArrowIcon />} onClick={handleConfirmOrder}>
            Confirm Order
          </Button>
        )}
      </SummaryHeaderContainer>
      <SummaryDetailsContainer>
        <div className="left-container">
          <div className="outfit-list">
            {order_items.map((itemObj, index) => {
              const currentOutfit = selected_outfits[itemObj.outfit_type];

              if (_isNil(currentOutfit)) {
                return null;
              }

              return (
                <OutfitChipContent
                  key={index}
                  isSelected={!_isNil(selectedItemId) && selectedItemId === itemObj.id}
                  onClick={() => setSelectedItemId(itemObj.id)}
                >
                  <img src={currentOutfit?.outfit_link ?? ''} alt={currentOutfit.outfit_name} />
                  <Text size="small" fontWeight={600} color="black">
                    {itemObj.outfit_alias}
                  </Text>
                </OutfitChipContent>
              );
            })}
          </div>
          {!_isNil(currentItemDetails) && (
            <div className="outfit-details-container">
              <MeasurementSummary
                customMeasurementDetails={
                  currentItemDetails.measurement_details?.inner_measurement_details ?? []
                }
                measurementImageLink={
                  currentItemDetails?.measurement_details?.measurement_image_link ?? ''
                }
                stitchOptions={currentItemDetails?.order_item_stitch_options ?? {}}
              />

              {!_isEmpty(currentItemDetails.special_instructions) && (
                <InputField
                  label="Special Instructions"
                  placeholder="Write Instructions given by customer"
                  type="textarea"
                  required={false}
                  value={currentItemDetails.special_instructions ?? ''}
                  disabled={true}
                />
              )}

              {!_isEmpty(currentItemDetails.audio_file_details) && (
                <AudioRecordField
                  label="Record Audio"
                  type="file"
                  required={false}
                  value={currentItemDetails.audio_file_details ?? []}
                  multiple={true}
                  maxUpload={5}
                  disabled={true}
                />
              )}

              {!_isEmpty(currentItemDetails.inspiration) && (
                <div>
                  <Text fontWeight={500}>Add Inspiration</Text>
                  <div
                    className="inspiration-text"
                    onClick={() => {
                      const link = currentItemDetails.inspiration.includes('https://')
                        ? currentItemDetails.inspiration
                        : `https://${currentItemDetails.inspiration}`;
                      window.open(link, '_blank');
                    }}
                  >
                    <Text color="primary" fontWeight={400}>
                      {currentItemDetails.inspiration ?? ''}
                    </Text>
                  </div>
                </div>
                // <InputField
                //   label="Add Inspiration"
                //   placeholder="https://www.google.com"
                //   type="textarea"
                //   required={false}
                //   value={currentItemDetails.inspiration ?? ''}
                //   disabled={true}
                // />
              )}

              {!_isEmpty(currentItemDetails.cloth_images) && (
                <BulkImageUploadField
                  label="Upload Cloth Images"
                  placeholder="Upload Cloth Images"
                  type="file"
                  required={false}
                  multiple={true}
                  maxUpload={10}
                  value={currentItemDetails.cloth_images ?? []}
                  disabled={true}
                />
              )}
            </div>
          )}
        </div>
        <div className="right-container">
          <div className="customer-box">
            <div className="box-item">
              <Text fontWeight={600}>Customer Name:</Text>
              <Text color="black" fontWeight={500}>
                {customer_details.customer_name}
              </Text>
            </div>
            <div className="box-item">
              <Text fontWeight={600}>Order Number:</Text>
              <Text color="black" fontWeight={500}>
                {boutique_order_id}
              </Text>
            </div>
            <div className="box-item">
              <Text fontWeight={600}>Trial Date:</Text>
              <Text color="black" fontWeight={500}>
                {!_isNil(currentItemDetails) &&
                !_isNil(currentItemDetails.trial_date) &&
                !_isEmpty(currentItemDetails.trial_date)
                  ? new Date(currentItemDetails.trial_date).toDateString()
                  : '-'}
              </Text>
            </div>
          </div>

          <div className="amount-summary-container">
            <div className="outfit-summary-amount-box">
              <Text size="large" fontWeight={600}>
                Order Summary
              </Text>
              <div className="outfit-price-list">
                {order_items.map((itemObj, index) => {
                  const total =
                    itemObj?.price_breakup?.reduce(
                      (sum, currPriceObj) =>
                        sum + (currPriceObj?.value ?? 0) * currPriceObj.component_quantity,
                      0
                    ) ?? 0;

                  return (
                    <div key={index}>
                      <div className="amount-item">
                        <Text color="black" fontWeight={600}>
                          {itemObj.outfit_alias}
                        </Text>
                        <Text color="black" fontWeight={600}>
                          {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                            total ?? 0
                          )}`}
                        </Text>
                      </div>

                      <div className="price-breakup-list">
                        {itemObj?.price_breakup?.map((priceObj, index) => (
                          <div key={index} className="amount-item">
                            <Text size="small" color="black" fontWeight={500}>
                              {priceObj.component}
                            </Text>
                            <Text size="small" color="black" fontWeight={500}>
                              {`${priceObj.component_quantity} x ${priceObj.value} = `}
                              {` ${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                                priceObj.component_quantity * (priceObj?.value ?? 0)
                              )}`}
                            </Text>
                          </div>
                        ))}
                      </div>

                      <Text size="small" fontWeight={500} className="date-field-style">
                        {`Delivery Date: ${new Date(itemObj.delivery_date).toDateString()}`}{' '}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>

            {!_isNil(order_amount_details) && (
              <>
                <div className="amount-box">
                  <div className="amount-item">
                    <Text color="black" fontWeight={600}>
                      Total:
                    </Text>
                    <Text color="black" fontWeight={600}>
                      {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                        order_amount_details?.total_amount ?? 0
                      )}`}
                    </Text>
                  </div>
                </div>

                <div className="advance-amount-box">
                  <Text color="black" fontWeight={600}>
                    Advance (if any):
                  </Text>
                  <InputField
                    type="text"
                    required={false}
                    value={order_amount_details.advance_received}
                    placeholder="0"
                    className="amount-field"
                    regex={positiveNumberRegex}
                    onChange={(value) =>
                      handleChange(value, 'order_amount_details.advance_received')
                    }
                  />
                </div>

                <div className="amount-box">
                  <div className="amount-item">
                    <Text color="black" fontWeight={600}>
                      Balance Due:
                    </Text>
                    <Text color="black" fontWeight={600}>
                      {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                        order_amount_details?.balance_due ?? 0
                      )}`}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SummaryDetailsContainer>

      <Loader showLoader={isLoading} />
    </OrderSummaryContainer>
  );
};

export default OrderSummary;
