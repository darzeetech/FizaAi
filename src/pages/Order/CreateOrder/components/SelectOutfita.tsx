import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';

import { RootState } from '../../../../store';
import { api } from '../../../../utils/apiRequest';
import { getInitailsOfName } from '../../../../utils/common';
import { Button, Loader, Text, toasts } from '../../../../ui-component';

//import OutfitCard from './OutfitCard';
//import { OutfitDetailsType } from '../type';
import { updateOrderDetails, updateOutfitList } from '../reducer';
import Measurements from './OrderDetails/components/Measurements';

import {
  SelectOutfitContainer,
  CustomerDetails,
  ActionContainer,
  OutfitListContainer,
  OutfitCardList,
} from './SelectOutfit/style';

const SelectOutfit = () => {
  const handleClick = () => {
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
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { createOrderReducer } = useSelector((state: RootState) => state);
  const { order_details, customer_details, outfit_list, selected_outfits } = createOrderReducer;
  // eslint-disable-next-line no-console
  console.log('nnn', outfit_list);

  const [outfit_no, setoutfitno] = useState(2);

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

  // const handleOutfitSelection = (value: boolean, outfit: OutfitDetailsType) => {
  //   if (value) {
  //     dispatch(
  //       updateSelectedOutfits({ data: { ...selected_outfits, [outfit.outfit_index]: outfit } })
  //     );
  //   } else {
  //     const updatedSelectedOutfits = structuredClone(selected_outfits);
  //     delete updatedSelectedOutfits[outfit.outfit_index];

  //     dispatch(updateSelectedOutfits({ data: updatedSelectedOutfits }));
  //   }
  // };

  const handleCancelButton = () => {
    //dispatch(clearAllCreateOrderReducer());
    //navigate(-1);
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

  const handleChange = () => {
    // Update the current Outfit ItemDetails
    // const currentIndex = i === -1 ? selectedOutfitChipIndex : i;
    // let updatedData = structuredClone(order_items[currentIndex]);
    // updatedData = setDataAtKeyInNestedObject(updatedData, key, value) as OrderItemType;
    // const updatedOrderItems = order_items.map((item, index) => {
    //   if (index === currentIndex) {
    //     return updatedData;
    //   }
    //   return item;
    // });
    // Update Order Details
    // dispatch(
    //   updateOrderDetails({
    //     data: {
    //       ...order_details,
    //       order_items: updatedOrderItems,
    //     },
    //   })
    // );
  };

  return (
    <SelectOutfitContainer>
      <div className=" hidden">
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
          <Button disabled={_isEmpty(selected_outfits)} onClick={handleClick}>
            Continue
          </Button>
          {!location.pathname.includes('selectcustomer') && (
            <Button disabled={_isEmpty(selected_outfits)} onClick={handleNextButton}>
              Next
            </Button>
          )}
        </ActionContainer>
      </div>
      <OutfitListContainer>
        <Text fontWeight={500}>Select Outfit Type :</Text>
        <OutfitCardList className="mb-[2rem]">
          {outfit_list.map((outfit) => (
            // <OutfitCard
            //   key={outfit.outfit_name}
            //   data={outfit}
            //   isSelected={outfit.outfit_index in selected_outfits}
            //   handleOutfitSelection={handleOutfitSelection}
            // />
            <div
              key={outfit.outfit_name}
              className={`
              w-[180px] 
              h-[150px] 
              flex 
              flex-col 
              justify-center 
              items-center 
              relative
              rounded-lg 
              bg-white 
              shadow-[0px_2px_14px_0px_rgba(193,199,216,0.6)] 
              cursor-pointer
              }
            `}
              onClick={() => {
                setoutfitno(outfit.outfit_index);
              }}
            >
              <div className="w-full h-full absolute bg-blac scroll-smooth overflow-y-hidden ">
                <Measurements
                  selectedOutfitChipIndex={outfit.outfit_index}
                  customer_id={customer_details.customer_id}
                  order_items={{
                    outfit_type: outfit_no,
                    outfit_alias: 'outfit',
                    order_type: 'stitching',
                    is_priority_order: false,
                    trial_date: '',
                    delivery_date: '',
                    inspiration: '',
                    special_instructions: '',
                    item_quantity: 1,
                    cloth_images: [],
                    audio_urls: [],
                    price_breakup: [],
                    order_item_stitch_options: {},
                  }}
                  handleChange={handleChange}
                />
              </div>

              <img className="w-[60px] h-[60px]" src={outfit.outfit_link} alt="" />
              <p className="font-[500] text-xs m-[.5rem]">{outfit.outfit_details_title}</p>
            </div>
          ))}
        </OutfitCardList>
      </OutfitListContainer>
      <Loader showLoader={isLoading} />
    </SelectOutfitContainer>
  );
};

export default SelectOutfit;
