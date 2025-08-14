import { useEffect } from 'react';
import _isNil from 'lodash/isNil';

import { positiveNumberRegex } from '../../../../../../../utils/regexValue';
import { DeleteIcon, PlusIcon } from '../../../../../../../assets/icons';
import { moneyFormatSigns } from '../../../../../../../utils/contant';
import { InputField } from '../../../../../../../components/FormComponents';
import { Counter, DashedLine, IconWrapper, Text } from '../../../../../../../ui-component';
import type { OrderItemType } from '../../../../type';

import {
  AddAdditionalCostContainer,
  AdditionalPriceContainer,
  PriceInfoContainer,
  PriceSummary,
} from './style';

type PriceInfoProps = {
  selectedOutfitChipIndex: number;
  order_items: OrderItemType;
  handleChange: (value: any, key: string) => void;
  setIsValidDetails: (data: boolean) => void;
};

const PriceInfo = ({
  selectedOutfitChipIndex,
  order_items,
  handleChange,
  setIsValidDetails,
}: PriceInfoProps) => {
  const stitchingPrice =
    order_items?.price_breakup?.filter((price) => price.component === 'Stitching Cost') ?? [];

  const otherPrice =
    order_items?.price_breakup?.filter((price) => price.component !== 'Stitching Cost') ?? [];

  const totalPrice =
    order_items?.price_breakup
      ?.filter((priceObj) => !priceObj.is_deleted)
      ?.reduce(
        (sum, priceInfo) => sum + priceInfo.component_quantity * (priceInfo?.value ?? 0),
        0
      ) ?? 0;

  useEffect(() => {
    if (stitchingPrice.length === 0) {
      const defaultStitchingPrice = {
        component: 'Stitching Cost',
        value: null,
        component_quantity: 1,
      };

      handleChange([defaultStitchingPrice, ...otherPrice], 'price_breakup');
    }
  }, [selectedOutfitChipIndex]);

  const updateStitchingPrice = (value: number | string, key: string, errorMsg?: string) => {
    const updatedStitchingPrice =
      stitchingPrice.length > 0
        ? {
            ...stitchingPrice[0],
            [key]: typeof value === 'number' ? value : value !== '' && value !== '0' ? value : null,
          }
        : { component: 'Stitching Cost', value: 0, component_quantity: 0, [key]: value };

    handleChange([updatedStitchingPrice, ...otherPrice], 'price_breakup');

    setIsValidDetails(_isNil(errorMsg) || errorMsg == '');
  };

  const updateAdditionalPrice = (value: any, key: string, index: number, errorMsg?: string) => {
    const updatedOtherPrice = otherPrice.map((price, currIndex) => {
      if (currIndex === index) {
        return {
          ...price,
          [key]: key === 'component' ? value : value !== '' && value !== '0' ? value : null,
        };
      }

      return price;
    });

    handleChange([...stitchingPrice, ...updatedOtherPrice], 'price_breakup');
    setIsValidDetails(_isNil(errorMsg) || errorMsg == '');
  };

  const handleAddAdditionalCost = () => {
    const updatedOtherPrice = [...otherPrice];
    updatedOtherPrice.push({
      component: '',
      value: null,
      component_quantity: 1,
    });

    handleChange([...stitchingPrice, ...updatedOtherPrice], 'price_breakup');
  };

  return (
    <PriceInfoContainer id="outfit-price-info">
      <div className="counter-container">
        <Counter
          label="Quantity"
          min_value={0}
          value={stitchingPrice.length > 0 ? stitchingPrice[0].component_quantity : 0}
          onChange={(count) => updateStitchingPrice(count, 'component_quantity')}
        />
      </div>

      <InputField
        label="Stitching Price"
        placeholder="0"
        type="text"
        required={true}
        regex={positiveNumberRegex}
        value={stitchingPrice.length > 0 ? stitchingPrice[0].value ?? '' : ''}
        leadingIcon={<Text fontWeight={700}>&#8377;</Text>}
        onChange={(value, errorMsg) => updateStitchingPrice(value, 'value', errorMsg)}
      />

      {otherPrice.map((priceComponent, index) => {
        if (priceComponent.is_deleted) {
          return null;
        }

        return (
          <AdditionalPriceContainer key={index}>
            <InputField
              placeholder="Name"
              type="text"
              required={true}
              value={otherPrice[index].component}
              onChange={(value, errorMsg) =>
                updateAdditionalPrice(value, 'component', index, errorMsg)
              }
            />
            <InputField
              placeholder="0"
              type="text"
              required={false}
              regex={positiveNumberRegex}
              value={otherPrice[index].value}
              leadingIcon={<Text fontWeight={700}>&#8377;</Text>}
              onChange={(value, errorMsg) => updateAdditionalPrice(value, 'value', index, errorMsg)}
            />
            <IconWrapper onClick={() => updateAdditionalPrice(true, 'is_deleted', index)}>
              <DeleteIcon />
            </IconWrapper>
          </AdditionalPriceContainer>
        );
      })}

      <AddAdditionalCostContainer onClick={handleAddAdditionalCost}>
        <PlusIcon color="var(--color-primary)" />
        <Text color="var(--color-primary)">Add Additional Cost</Text>
      </AddAdditionalCostContainer>

      <DashedLine />

      <PriceSummary>
        <div className="header">
          <Text color="black" fontWeight={700} size="large">
            Price Breakup
          </Text>
        </div>
        <div className="price-breakup-container">
          {stitchingPrice.map((priceInfo, index) => (
            <div key={index} className="price-breakup">
              <Text>{priceInfo.component}</Text>
              <Text>
                {`${priceInfo.component_quantity} x ${priceInfo.value ?? 0} = 
                ${moneyFormatSigns.rupee} ${priceInfo.component_quantity * (priceInfo.value ?? 0)}`}
              </Text>
            </div>
          ))}

          {otherPrice
            .filter((priceInfo) => priceInfo.component !== '' && !priceInfo.is_deleted)
            .map((priceInfo, index) => (
              <div key={index} className="price-breakup">
                <Text>{priceInfo.component}</Text>
                <Text>{`${moneyFormatSigns.rupee} ${
                  priceInfo.component_quantity * (priceInfo.value ?? 0)
                }`}</Text>
              </div>
            ))}
        </div>

        <DashedLine />

        <div className="total-price">
          <Text color="black" fontWeight={500}>
            Total:
          </Text>
          <Text color="black" fontWeight={500}>{`${moneyFormatSigns.rupee} ${totalPrice}`}</Text>
        </div>
      </PriceSummary>
    </PriceInfoContainer>
  );
};

export default PriceInfo;
