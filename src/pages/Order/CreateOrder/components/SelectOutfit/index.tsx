import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';

import { RootState } from '../../../../../store';
import { api } from '../../../../../utils/apiRequest';
import { getInitailsOfName } from '../../../../../utils/common';
import { Button, Loader, Text, toasts } from '../../../../../ui-component';

import OutfitCard from '../OutfitCard';
import { OutfitDetailsType } from '../../type';
import {
  clearAllCreateOrderReducer,
  updateOrderDetails,
  updateOutfitList,
  updateSelectedOutfits,
} from '../../reducer';

import {
  SelectOutfitContainer,
  SelectedCustomerContainer,
  CustomerDetails,
  ActionContainer,
  OutfitListContainer,
  OutfitCardList,
} from './style';

const SelectOutfit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { order_details, customer_details, outfit_list, selected_outfits } = createOrderReducer;

  const {
    customer_name = '',
    phone_number = '',
    profile_pic_link = '',
    gender = '',
  } = customer_details;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void getAllOutfits();
  }, []);

  const getAllOutfits = async () => {
    try {
      setIsLoading(true);
      const response = await api.getRequest(`outfit/?gender=${gender}`);
      const { status, data } = response;

      if (status) {
        dispatch(updateOutfitList({ data }));
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-all-outfits-error');
      }
    }
    setIsLoading(false);
  };

  const handleOutfitSelection = (value: boolean, outfit: OutfitDetailsType) => {
    if (value) {
      dispatch(
        updateSelectedOutfits({ data: { ...selected_outfits, [outfit.outfit_index]: outfit } })
      );
    } else {
      const updatedSelectedOutfits = structuredClone(selected_outfits);
      delete updatedSelectedOutfits[outfit.outfit_index];

      dispatch(updateSelectedOutfits({ data: updatedSelectedOutfits }));
    }
  };

  const handleCancelButton = () => {
    dispatch(clearAllCreateOrderReducer());
    navigate(-1);
  };

  const handleNextButton = () => {
    const orderItems = Object.keys(selected_outfits).map((key) => {
      return {
        outfit_type: parseInt(key),
        outfit_alias: `${selected_outfits[key].outfit_details_title}`,
        order_type: 'stitching',
        // delivery_date: new Date().toISOString(),
      };
    });

    dispatch(
      updateOrderDetails({
        data: {
          ...order_details,
          order_items: orderItems,
        },
      })
    );

    // navigate(`/orders?formType=create`);

    if (location.pathname.includes('select-outfit')) {
      navigate(`/orders?formType=create`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/orders?formType=create`);
    }
  };

  return (
    <SelectOutfitContainer>
      <SelectedCustomerContainer>
        <CustomerDetails>
          <>
            {_isEmpty(profile_pic_link) ? (
              <div className="profile-pic">{getInitailsOfName(customer_name).toUpperCase()}</div>
            ) : (
              <img className="profile-pic" src={profile_pic_link} alt="profile-pic" />
            )}
          </>
          <div>
            <Text color="black" fontWeight={700}>
              {customer_name}
            </Text>
            <Text size="small" fontWeight={600}>
              {phone_number}
            </Text>
          </div>
        </CustomerDetails>
        <ActionContainer>
          <Button appearance="outlined" bgColor="black" onClick={handleCancelButton}>
            Cancel
          </Button>
          <Button disabled={_isEmpty(selected_outfits)} onClick={handleNextButton}>
            Next
          </Button>
        </ActionContainer>
      </SelectedCustomerContainer>
      <OutfitListContainer>
        <Text fontWeight={500}>Select Outfit Type :</Text>
        <OutfitCardList>
          {outfit_list.map((outfit) => (
            <OutfitCard
              key={outfit.outfit_name}
              data={outfit}
              isSelected={outfit.outfit_index in selected_outfits}
              handleOutfitSelection={handleOutfitSelection}
            />
          ))}
        </OutfitCardList>
      </OutfitListContainer>
      <Loader showLoader={isLoading} />
    </SelectOutfitContainer>
  );
};

export default SelectOutfit;
