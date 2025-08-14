import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { RootState } from '../../../../../store';
import { Loader, Modal, ModalMethods, Text, toasts } from '../../../../../ui-component';
import {
  getValueFromLocalStorage,
  setDataAtKeyInNestedObject,
  setValueInLocalStorage,
} from '../../../../../utils/common';
import { api } from '../../../../../utils/apiRequest';
import { InputField } from '../../../../../components/FormComponents';

import { updateHeaderData } from '../../../../../store/reducer';

import type { OrderItemType, OrderPriceBreakupType } from '../../type';
import { clearOrderDetailsReducer, updateOrderDetails, updateSelectedOutfits } from '../../reducer';
import OrderOutfits from './components/OrderOutfits';
import { SelectedCustomerInfo } from './components/SelectedCustomerInfo';
import PriceInfoContainer from './components/PriceInfo';
import OutfitDetails from './components/OutfitDetails';

import { calulateOrderAmount, formatOrderItemPayload, formatOrderpayload } from './helperFunction';
import {
  CloseModalBody,
  OrderDetailsContainer,
  OrderDetailsContent,
  OutfitDetailsContainer,
} from './style';

type OrderDetailsProps = {
  formType?: string;
};

const OrderDetails = ({ formType = '' }: OrderDetailsProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { itemId = '' } = params;
  const isItemUpdate = itemId !== '' && !_isNil(itemId);

  const closeModalRef = useRef<ModalMethods>(null);
  const deleteModalRef = useRef<ModalMethods>(null);

  const { createOrderReducer, commonDataReducer } = useSelector((state: RootState) => state);
  const { order_details, customer_details, selected_outfits, outfit_list } = createOrderReducer;
  // eslint-disable-next-line no-console
  //console.log('Data being passed:', customer_details);
  const { headerData } = commonDataReducer;

  const { order_items, order_id, order_amount_details } = order_details;

  const hasNotRecieveAdvance =
    _isNil(order_amount_details) ||
    _isNil(order_amount_details.advance_received) ||
    order_amount_details.advance_received === 0;

  const [isLoading, setIsLoading] = useState(false);
  const [selectedOutfitChipIndex, setSelectedOutfitChipIndex] = useState(0);
  const [outfitToDeleteIndex, setOutfitToDeleteIndex] = useState(-1);
  const [showOrderSummary, setShowOrderSUmmary] = useState(false);
  const [hasItemDetails, setHasItemDetails] = useState<Record<number, boolean>>({});

  const [isValidDetails, setIsValidDetails] = useState(true);

  const totalSelectedOutfits = Object.keys(selected_outfits).length;

  const ele = document.getElementById('header-back-icon');

  useEffect(() => {
    if (!_isNil(ele)) {
      dispatch(
        updateHeaderData({
          data: {
            ...headerData,
            enableHeaderBackButton: false,
          },
        })
      );

      ele.addEventListener('click', () => {
        closeModalRef.current?.show();
      });
    }
  }, [ele]);

  useEffect(() => {
    window.addEventListener('resize', () => {
      calculateHeight();
    });

    return () => {
      window.removeEventListener('resize', () => {});
      ele?.removeEventListener('click', () => {});

      dispatch(
        updateHeaderData({
          data: {
            ...headerData,
            enableHeaderBackButton: true,
          },
        })
      );

      dispatch(clearOrderDetailsReducer());

      setValueInLocalStorage('order_id', '');
    };
  }, []);

  useEffect(() => {
    calculateHeight();
  }, [totalSelectedOutfits]);

  useEffect(() => {
    if (formType === 'edit') {
      //To DO: Need to verify if similar thing is required on change of order_items length
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
    }
  }, [formType, order_items.length]);

  useEffect(() => {
    const id = order_items.length > 0 ? order_items[selectedOutfitChipIndex].id : null;

    if (formType === 'edit' && !_isNil(id) && !hasItemDetails[id]) {
      void handleGetOrderItem(id);
    }
  }, [selectedOutfitChipIndex, formType, JSON.stringify(hasItemDetails)]);

  const calculateHeight = () => {
    const addOutfitDiv = document.getElementById('add-outfit-container');
    const outfitDetailsDiv = document.getElementById('outfit-details-container');

    if (!_isNil(outfitDetailsDiv)) {
      const height = addOutfitDiv?.getBoundingClientRect().height ?? 80;

      outfitDetailsDiv.style.maxHeight = `calc(100vh - 120px - 12px - ${height}px)`;
      outfitDetailsDiv.style.height = `calc(100vh - 120px - 12px - ${height}px)`;
    }
  };

  const calculateOutfitAliasIndex = (currentOutfitInOrder: OrderItemType[]) => {
    // Define a regex pattern to extract numbers following words
    const regex = /[a-z]+\s*(\d*)$/i;

    const usedIndexList = currentOutfitInOrder
      .map((item) => {
        const match = item.outfit_alias.match(regex);

        // If there's a number, return it as an integer, otherwise return 0
        return match && match[1] ? parseInt(match[1], 10) : 0;
      })
      .sort((a, b) => a - b);

    let low = 0;
    let high = usedIndexList.length - 1;
    const start = usedIndexList[0];

    if (usedIndexList.length === 0 || usedIndexList[0] > 0) {
      return 0;
    } // If the usedIndexList does not start from 0, the missing number is 0.

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);

      if (usedIndexList[mid] !== mid + start) {
        if (mid === 0 || usedIndexList[mid - 1] === mid - 1 + start) {
          return mid + start;
        }
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    // If no number is missing within the sequence, return the next number after the last element
    return usedIndexList[0] + usedIndexList.length;
  };

  const handleAddNewOutfit = (outfitIndex: number) => {
    const outfit = outfit_list.filter((outfit) => outfit.outfit_index === outfitIndex);

    //Check and If New outfit is selected then update selected Outfits data;
    if (!(outfitIndex in selected_outfits)) {
      dispatch(updateSelectedOutfits({ data: { ...selected_outfits, [outfitIndex]: outfit[0] } }));
    }

    const currentOutfitInOrder = order_items.filter((item) => item.outfit_type === outfitIndex);

    const missingIndex = calculateOutfitAliasIndex(currentOutfitInOrder);

    //update Order Details
    const updatedOrderItem = [
      ...order_items,
      {
        outfit_type: outfitIndex,
        outfit_alias:
          missingIndex === 0
            ? `${outfit[0].outfit_details_title}`
            : `${outfit[0].outfit_details_title} ${missingIndex}`,
        order_type: 'stitching',
        // delivery_date: new Date().toISOString(),
      },
    ];

    dispatch(
      updateOrderDetails({
        data: {
          ...order_details,
          order_items: updatedOrderItem,
        },
      })
    );
  };

  const handleChange = (value: any, key: string, i = -1) => {
    if (key === 'delivery_date' || key === 'trial_date') {
      const updatedOrderItems = order_items.map((item) => ({
        ...item,
        [key]: value,
      }));

      dispatch(
        updateOrderDetails({
          data: {
            ...order_details,
            order_items: updatedOrderItems,
          },
        })
      );

      return;
    }
    // Update the current Outfit ItemDetails
    const currentIndex = i === -1 ? selectedOutfitChipIndex : i;
    let updatedData = structuredClone(order_items[currentIndex]);
    updatedData = setDataAtKeyInNestedObject(updatedData, key, value) as OrderItemType;

    const updatedOrderItems = order_items.map((item, index) => {
      if (index === currentIndex) {
        return updatedData;
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
  };

  const updateOutfitChipIndex = async (index: number) => {
    if (isValidDetails) {
      await updateOutfit();
      setSelectedOutfitChipIndex(index);
    } else {
      toasts('info', 'Some error in field, Please check', 'invalid-item-data');
    }
  };

  const updateOutfit = async (outfitToDelete?: OrderItemType) => {
    try {
      setIsLoading(true);
      const currentOutfit = order_items[selectedOutfitChipIndex];

      const itemIDExists = !_isNil(currentOutfit.id);

      if (!itemIDExists && _isNil(outfitToDelete)) {
        await handleCreateOrderItem();
      } else {
        // Update outfit API
        await handleUpdateOrderItem(outfitToDelete);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'format-outfit-data-error');
      }
    }

    setIsLoading(false);
  };

  const handleCreateOrderItem = async () => {
    try {
      const currentOutfit = order_items[selectedOutfitChipIndex];
      const currentOutfitPayload = formatOrderItemPayload(currentOutfit);

      const currentOrderDetails = {
        order_details: {
          ...order_details,
          order_amount_details: calulateOrderAmount(order_details),
          order_items: [currentOutfitPayload],
        },
      };

      const response = await api.postRequest('order_item/', currentOrderDetails);

      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        const { order_id, boutique_order_id } = data.order_summary;

        const { id, price_breakup } = data.order_summary.order_item_summary_list.filter(
          (obj: any) => obj.outfit_alias === currentOutfitPayload.outfit_alias
        )[0];

        const updatedCurrentOutfit = {
          ...currentOutfit,
          id: id,
          price_breakup: price_breakup.map((price: OrderPriceBreakupType) => ({
            ...price,
            value: _isNil(price.value) ? null : String(price.value),
          })),
        };

        const updatedOrderItems = order_items.map((item, index) => {
          if (index === selectedOutfitChipIndex) {
            return updatedCurrentOutfit;
          }

          return item;
        });

        // Update Order Details
        dispatch(
          updateOrderDetails({
            data: {
              ...order_details,

              order_id,
              boutique_order_id,
              order_items: updatedOrderItems,
            },
          })
        );

        setValueInLocalStorage('order_id', order_id);

        return {
          status: true,
        };
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'create-outfit-error');
      }

      return {
        status: false,
      };
    }

    return {
      status: true,
    };
  };

  const handleUpdateOrderItem = async (outfitToDelete?: OrderItemType) => {
    try {
      const currentOutfit = _isNil(outfitToDelete)
        ? order_items[selectedOutfitChipIndex]
        : outfitToDelete;

      //   if (!validateOrderItem(currentOutfit)) {
      //     toasts('info', 'Please fill mandatory fields', '');
      //   }

      const currentOutfitPayload = formatOrderItemPayload(currentOutfit);

      const response = await api.putRequest(`order_item/${currentOutfit.id}`, currentOutfitPayload);
      const { status, data } = response;

      if (status && isItemUpdate) {
        navigate(-1);
      } else if (status && !_isEmpty(data)) {
        const { order_id } = data;

        if (
          (_isNil(data.order_item_summary_list) || data.order_item_summary_list.length === 0) &&
          !_isNil(outfitToDelete)
        ) {
          toasts('success', 'Order deleted successfully', 'order-deletions');
          setTimeout(() => {
            navigate('/orders-list');
          }, 0);
        }
        const updatedOutfitListFromApi = data.order_item_summary_list.filter(
          (obj: any) => obj.id === currentOutfitPayload.id
        );

        // Verfiying if the outfit is Actually Deleted Or Not (if it is null then deleted)
        const updatedOutfitFromApi =
          updatedOutfitListFromApi.length > 0 ? updatedOutfitListFromApi[0] : null;

        const updatedCurrentOutfit = {
          ...currentOutfit,
          price_breakup:
            updatedOutfitFromApi?.price_breakup.map((price: OrderPriceBreakupType) => ({
              ...price,
              value: _isNil(price.value) ? null : String(price.value),
            })) ?? [],
        };

        const updatedOrderItems = order_items
          .map((item, index) => {
            if (index === selectedOutfitChipIndex && _isNil(outfitToDelete)) {
              return updatedCurrentOutfit;
            }

            return item;
          })
          .filter((item, index) => {
            if (
              index === outfitToDeleteIndex &&
              !_isNil(outfitToDelete) &&
              _isNil(updatedOutfitFromApi)
            ) {
              return false;
            }

            return true;
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

        setValueInLocalStorage('order_id', order_id);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'update-outfit-error');
      }
    }
  };

  const handleSaveOrder = async () => {
    try {
      setIsLoading(true);
      const orderPayload = formatOrderpayload(order_details);

      //   const hasId = !_isNil(orderPayload.order_details.order_id);

      const response = await api.postRequest('order/', orderPayload);

      const { status, data } = response;

      if (status && !_isEmpty(data)) {
        const { order_id, boutique_order_id } = data;

        const updatedOrderItems = order_items.map((item) => {
          const updatedItemFromApi = data.order_item_summary_list.filter(
            (outfit: OrderItemType) => outfit.outfit_alias === item.outfit_alias
          );

          return {
            ...item,
            id: updatedItemFromApi.length > 0 ? updatedItemFromApi[0].id : -1,
            price_breakup:
              updatedItemFromApi.length > 0
                ? updatedItemFromApi[0].price_breakup.map((price: OrderPriceBreakupType) => ({
                    ...price,
                    value: _isNil(price.value) ? null : String(price.value),
                  }))
                : [],
          };
        });

        // Update Order Details
        dispatch(
          updateOrderDetails({
            data: {
              ...order_details,
              order_id,
              boutique_order_id,
              order_items: updatedOrderItems,
              order_amount_details: orderPayload.order_details.order_amount_details,
            },
          })
        );

        setValueInLocalStorage('order_id', order_id);
        setIsLoading(false);

        return { status: true, order_id };
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'create-outfit-error');
      }
    }
    setIsLoading(false);

    return {
      status: false,
      order_id,
    };
  };

  const handleGetOrderItem = async (id: number) => {
    try {
      setIsLoading(true);
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
          measurement_revision_id: data?.measurement_details?.measurement_revision_id ?? undefined,
          //   trial_date:
          //     !_isNil(data.trial_date) && !_isEmpty(data.trial_date)
          //       ? new Date(data.trial_date).toUTCString()
          //       : null,
          //   delivery_date: new Date(data.delivery_date).toUTCString(),
        };
        const updatedOrderItems = order_items.map((item, index) => {
          if (index === selectedOutfitChipIndex) {
            return updatedCurrentOutfit;
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

        setHasItemDetails({
          ...hasItemDetails,
          [id]: true,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'get-order-item-error');
      }
    }
    setIsLoading(false);
  };

  const handleContinueClick = async () => {
    const { status, order_id } = await handleSaveOrder();

    if (status) {
      if (formType === 'create') {
        const boutique_id = getValueFromLocalStorage('boutique_id');

        dispatch(
          updateOrderDetails({
            data: {
              boutique_id,
            },
          })
        );
      }

      navigate(`/orders/${order_id}?formType=order-summary`);
    }
  };

  const handleBackClick = () => {
    setShowOrderSUmmary(false);
  };

  const handleModalClose = () => {
    closeModalRef.current?.hide();
    navigate('/orders-list');
  };

  const handleModalSuccess = async () => {
    if (isItemUpdate) {
      await updateOutfit();
    } else {
      await handleSaveOrder();
    }
    closeModalRef.current?.hide();
    navigate('/orders-list');
  };

  const handleDeleteOutfitClose = () => {
    setOutfitToDeleteIndex(-1);
    deleteModalRef.current?.hide();
  };

  const handleOutfitDelete = async () => {
    const currentOutfit = order_items[outfitToDeleteIndex];

    if (!_isNil(currentOutfit.id)) {
      await updateOutfit({
        ...currentOutfit,
        is_deleted: true,
      });
    } else {
      const updatedOrderItems = order_items.filter(
        (item) => item.outfit_alias !== currentOutfit.outfit_alias
      );

      dispatch(
        updateOrderDetails({
          data: {
            ...order_details,
            order_items: updatedOrderItems,
          },
        })
      );
    }

    if (selectedOutfitChipIndex >= outfitToDeleteIndex) {
      setSelectedOutfitChipIndex(selectedOutfitChipIndex > 0 ? selectedOutfitChipIndex - 1 : 0);
    }

    setOutfitToDeleteIndex(-1);
    deleteModalRef.current?.hide();
  };

  return (
    <OrderDetailsContainer>
      <SelectedCustomerInfo
        showOrderSummary={showOrderSummary}
        customer_details={customer_details}
        handleSaveOrder={handleSaveOrder}
        handleContinueClick={handleContinueClick}
        handleBackClick={handleBackClick}
        handleUpdateItem={updateOutfit}
        isItemUpdate={isItemUpdate}
        order_items={order_items}
        isValidDetails={isValidDetails}
      />
      {!showOrderSummary && (
        <OrderDetailsContent>
          <OrderOutfits
            order_details={order_details}
            selected_outfits={selected_outfits}
            outfit_list={outfit_list}
            selectedOutfitChipIndex={selectedOutfitChipIndex}
            handleAddNewOutfit={handleAddNewOutfit}
            updateOutfitChipIndex={updateOutfitChipIndex}
            deleteModalRef={deleteModalRef}
            setOutfitToDeleteIndex={setOutfitToDeleteIndex}
          />
          {order_items.length > 0 && (
            <OutfitDetailsContainer id="outfit-details-container">
              <OutfitDetails
                order_id={order_id}
                selected_outfits={selected_outfits}
                selectedOutfitChipIndex={selectedOutfitChipIndex}
                order_items={order_items[selectedOutfitChipIndex]}
                customer_id={order_details?.customer_id}
                handleChange={handleChange}
                setIsValidDetails={setIsValidDetails}
              />
              <PriceInfoContainer
                order_items={order_items[selectedOutfitChipIndex]}
                handleChange={handleChange}
                selectedOutfitChipIndex={selectedOutfitChipIndex}
                setIsValidDetails={setIsValidDetails}
              />
            </OutfitDetailsContainer>
          )}
        </OrderDetailsContent>
      )}

      <Modal
        ref={closeModalRef}
        size="small"
        saveButtonText={isItemUpdate ? 'Save' : 'Save draft'}
        closeButtonText="Go back without saving"
        showCloseIcon={true}
        onModalClose={handleModalClose}
        onModalSuccess={handleModalSuccess}
      >
        <CloseModalBody>
          <Text color="black" fontWeight={700}>
            Do you want to save your order to draft?
          </Text>
        </CloseModalBody>
      </Modal>

      <Modal
        ref={deleteModalRef}
        size="small"
        saveButtonText="Delete"
        closeButtonText="Back"
        showCloseIcon={true}
        onModalClose={handleDeleteOutfitClose}
        onModalSuccess={handleOutfitDelete}
        title={!hasNotRecieveAdvance ? 'Delete outfit ?' : undefined}
      >
        <CloseModalBody>
          {hasNotRecieveAdvance ? (
            <Text color="black" fontWeight={600}>
              Do you really want to delete this outfit?
            </Text>
          ) : (
            <InputField
              label="Refund advance amount"
              placeholder="0"
              type="text"
              required={false}
              value={order_items[selectedOutfitChipIndex]?.amount_refunded ?? ''}
              onChange={(value) => handleChange(value, 'amount_refunded')}
            />
          )}
        </CloseModalBody>
      </Modal>
      <Loader showLoader={isLoading} />
    </OrderDetailsContainer>
  );
};

export default OrderDetails;
