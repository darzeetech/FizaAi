import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _isUndefined from 'lodash/isUndefined';

import { RootState } from '../../../../../store';
import { getValueFromLocalStorage } from '../../../../../utils/common';
import CustomerList from '../../../../Customer/CustomerList';
import { updateOrderDetails, updateSelectedOutfits } from '../../reducer';

const SelectCustomer = () => {
  const dispatch = useDispatch();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { customer_details } = createOrderReducer;

  useEffect(() => {
    dispatch(updateSelectedOutfits({ data: {} }));
    dispatch(
      updateOrderDetails({
        data: {
          order_items: [],
        },
      })
    );
  }, []);

  useEffect(() => {
    if (!_isUndefined(customer_details)) {
      const boutique_id = getValueFromLocalStorage('boutique_id');
      dispatch(
        updateOrderDetails({
          data: {
            // ...order_details,
            boutique_id,
            customer_id: customer_details.customer_id,
          },
        })
      );
    }
  }, [customer_details]);

  return <CustomerList />;
};

export default SelectCustomer;
