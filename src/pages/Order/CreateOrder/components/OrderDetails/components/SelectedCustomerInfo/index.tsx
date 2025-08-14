import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import { getInitailsOfName } from '../../../../../../../utils/common';
import { ChevronLeftIcon, RightArrowIcon } from '../../../../../../../assets/icons';
import { Button, IconWrapper, Text } from '../../../../../../../ui-component';

import type { OrderItemType } from '../../../../type';

import { ActionContainer, CustomerDetails, SelectedCustomerContainer } from '../../../commonStyles';
import { useEffect, useState } from 'react';

type SelectedCustomerInfoProps = {
  customer_details: Record<string, any>;
  order_items: OrderItemType[];
  isItemUpdate: boolean;
  handleSaveOrder: () => void;
  handleContinueClick: () => void;
  handleUpdateItem: () => void;
  handleBackClick: () => void;
  isValidDetails: boolean;
  showOrderSummary?: boolean;
};

export const SelectedCustomerInfo = ({
  customer_details,
  order_items,
  isItemUpdate = false,
  handleSaveOrder,
  handleUpdateItem,
  handleContinueClick,
  handleBackClick,
  isValidDetails = false,
  showOrderSummary = false,
}: SelectedCustomerInfoProps) => {
  const [isContinueDisable, setIsContinueDisable] = useState(true);

  const { customer_name = '', phone_number = '', profile_pic_link = '' } = customer_details;
  // eslint-disable-next-line no-console
  //console.log(order_items);

  useEffect(() => {
    let isEnable = isValidDetails;

    order_items.forEach((item) => {
      // Validate delivery date
      if (_isNil(item.delivery_date) || _isEmpty(item.delivery_date)) {
        isEnable = false;

        return;
      }

      // Validate price breakup exists
      if (!item.price_breakup?.length) {
        isEnable = false;

        return;
      }

      // Validate stitching cost exists and has value
      const stitchingCost = item.price_breakup.find(
        (price) => price.component === 'Stitching Cost'
      );

      if (!stitchingCost?.value) {
        isEnable = false;

        return;
      }

      // Validate additional costs
      const additionalCosts = item.price_breakup.filter(
        (price) => price.component !== 'Stitching Cost'
      );
      const hasValidAdditionalCosts = additionalCosts.every(
        (price) =>
          price.component &&
          !_isEmpty(price.component) &&
          price.value &&
          !_isEmpty(price.value.toString())
      );

      if (!hasValidAdditionalCosts) {
        isEnable = false;
      }
    });

    setIsContinueDisable(!isEnable);
  }, [order_items, isValidDetails]);

  return (
    <SelectedCustomerContainer>
      {!showOrderSummary ? (
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
      ) : (
        <IconWrapper onClick={handleBackClick}>
          <ChevronLeftIcon />
        </IconWrapper>
      )}
      <ActionContainer>
        {!isItemUpdate && (
          <Button
            appearance="outlined"
            bgColor="var(--color-nightRider)"
            disabled={!isValidDetails}
            onClick={handleSaveOrder}
          >
            Save as draft
          </Button>
        )}
        {!isItemUpdate && (
          <Button
            trailingIcon={<RightArrowIcon />}
            disabled={isContinueDisable}
            onClick={handleContinueClick}
          >
            Save And Continue
          </Button>
        )}

        {isItemUpdate && (
          <Button disabled={isContinueDisable} onClick={() => handleUpdateItem()}>
            Save
          </Button>
        )}
      </ActionContainer>
    </SelectedCustomerContainer>
  );
};
