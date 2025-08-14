import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import { RootState } from '../../../store';
import { getValueFromLocalStorage, setValueInLocalStorage } from '../../../utils/common';
import { Loader, toasts } from '../../../ui-component';
import { api } from '../../../utils/apiRequest';

import {
  clearAllCreateOrderReducer,
  updateCustomerDetails,
  updateOrderDetails,
  updateOutfitList,
  updateSelectedOutfits,
} from './reducer';
import SelectCustomer from './components/SelectCustomer';
import SelectOutfit from './components/SelectOutfit/index';
import OrderDetails from './components/OrderDetails';
import OrderSummary from './components/OrderSummary';
import type { OrderDetailsType, OutfitDetailsType } from './type';

const CreateOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();

  const [formType, setFormType] = useState('');
  const [pathType, setPathType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { order_details } = createOrderReducer;

  //eslint-disable-next-line
  const { id = '', itemId = '' } = params;

  const orderIdFromLocalStorage = getValueFromLocalStorage('order_id');

  useEffect(() => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    dispatch(
      updateOrderDetails({
        data: {
          ...order_details,
          boutique_id,
        },
      })
    );

    const searchParams = new URLSearchParams(location.search.substring(1));
    const currentFormType =
      searchParams.get('formType') === 'order-summary' ? 'order-summary' : 'edit';

    if (!_isNil(orderIdFromLocalStorage) && orderIdFromLocalStorage !== '') {
      navigate(`/orders/${orderIdFromLocalStorage}?formType=${currentFormType}`);
    } else if (!_isNil(order_details) && id == '') {
      if (_isNil(order_details.customer_id)) {
        navigate('/select-customer');
      } else if (_isNil(order_details.order_items) || order_details.order_items.length === 0) {
        navigate(`/select-outfit`);
      }
    }

    return () => {
      dispatch(clearAllCreateOrderReducer());

      setValueInLocalStorage('order_id', '');
    };
  }, []);

  useEffect(() => {
    setOrderId(id);
  }, [id]);

  useEffect(() => {
    if (!_isNil(orderId) && orderId !== '') {
      void getOrderDetails();
    }
  }, [orderId]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search.substring(1));

    setFormType(searchParams.get('formType') ?? 'create');
  }, [location.search]);

  useEffect(() => {
    const currentPathName = location.pathname.split('/');

    if (currentPathName.length > 1) {
      setPathType(currentPathName[1]);
    }
  }, [location.pathname]);

  const getOrderDetails = async () => {
    try {
      setIsLoading(true);
      const boutique_id = getValueFromLocalStorage('boutique_id');
      const orderResponse = await api.getRequest(`order/${id}?boutique_id=${boutique_id}`);

      const { status: orderApiStatus, data: orderApiData } = orderResponse;

      let updated_order_details: OrderDetailsType = {
        boutique_id,
        order_items: [],
      };

      if (orderApiStatus && !_isEmpty(orderApiData)) {
        dispatch(updateCustomerDetails({ data: orderApiData.customer_details ?? {} }));

        updated_order_details = {
          ...updated_order_details,
          //   ...orderApiData,
          customer_id: orderApiData?.customer_details?.customer_id ?? undefined,
          order_id: orderApiData?.order_id ?? undefined,
          boutique_order_id: orderApiData?.boutique_order_id ?? undefined,
          order_amount_details: orderApiData?.order_amount_details,
          order_status: orderApiData.order_status,
        };
      }

      const order_items_response = await api.getRequest(`order_item?order_id=${id}`);

      const { status: itemsApiStatus, data: itemApiData } = order_items_response;

      if (itemsApiStatus && !_isEmpty(itemApiData)) {
        // const order_items = itemApiData.data.map((obj: any) => {
        //   return {
        //     id:
        //   };
        // });

        updated_order_details = {
          ...updated_order_details,
          order_items:
            _isNil(itemId) || itemId === ''
              ? itemApiData.data.map((itemObj: any) => {
                  return {
                    outfit_type: itemObj.outfit_type_index,
                    outfit_alias: itemObj.outfit_alias,
                    delivery_date: itemObj.delivery_date,
                    price_breakup:
                      itemObj.price_breakup_summary_list ?? itemObj.price_breakup ?? [],
                    id: itemObj.id,
                  };
                })
              : itemApiData.data
                  .filter((itemObj: any) => itemObj.id == itemId)
                  .map((itemObj: any) => {
                    return {
                      //   ...itemObj,
                      outfit_type: itemObj.outfit_type_index,
                      outfit_alias: itemObj.outfit_alias,
                      delivery_date: itemObj.delivery_date,
                      price_breakup:
                        itemObj.price_breakup_summary_list ?? itemObj.price_breakup ?? [],
                      id: itemObj.id,
                    };
                  }),
        };

        void getAllOutfits(orderApiData.customer_details.gender, itemApiData.data);
      }

      dispatch(
        updateOrderDetails({
          data: {
            ...order_details,
            ...updated_order_details,
            customer_id: orderApiData?.customer_details?.customer_id ?? undefined,
          },
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'get-order-details-error');
      }
    }
    setIsLoading(false);
  };

  const getAllOutfits = async (gender: string, itemsList: any[]) => {
    if (!_isNil(gender) && !_isEmpty(gender)) {
      try {
        const response = await api.getRequest(`outfit/?gender=${gender}`);
        const { status, data } = response;

        if (status) {
          dispatch(updateOutfitList({ data }));
        }

        const selected_outfits = itemsList.reduce(
          (acc: Record<string, OutfitDetailsType>, currItem) => {
            return {
              ...acc,
              [currItem.outfit_type_index]: data.find(
                (outfitObj: OutfitDetailsType) =>
                  outfitObj.outfit_index === currItem.outfit_type_index
              ),
            };
          },
          {}
        );

        dispatch(updateSelectedOutfits({ data: selected_outfits }));
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', err.message, 'get-all-outfits-error');
        }
      }
    }
  };

  const getComponent = useCallback(() => {
    if (
      _isUndefined(order_details) ||
      pathType === 'select-customer' ||
      (_isUndefined(order_details.customer_id) && _isEmpty(id))
    ) {
      return <SelectCustomer />;
    } else if (
      (!_isUndefined(order_details.order_items) &&
        order_details.order_items.length === 0 &&
        _isEmpty(id)) ||
      pathType === 'select-outfit'
    ) {
      return <SelectOutfit />;
    } else if (
      !_isUndefined(order_details.order_items) &&
      //   order_details.order_items.length > 0 &&
      pathType === 'orders' &&
      (formType === 'create' || formType === 'edit')
    ) {
      return <OrderDetails formType={formType} />;
    } else if (
      formType === 'order-summary' &&
      !_isUndefined(order_details.order_items) &&
      order_details.order_items.length > 0
    ) {
      return <OrderSummary />;
    }

    return null;
  }, [order_details, formType, pathType, id]);

  if (formType === '') {
    return null;
  }

  return (
    <>
      {getComponent()}
      <Loader showLoader={isLoading} />
    </>
  );
};

export default CreateOrder;
