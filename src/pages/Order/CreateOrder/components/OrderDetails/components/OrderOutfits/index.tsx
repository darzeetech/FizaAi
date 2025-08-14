import { RefObject, useRef } from 'react';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';
import { useLocation } from 'react-router-dom';

import { CrossIcon, PlusIcon } from '../../../../../../../assets/icons';
import { ModalMethods, Popover, PopoverMethods, Text } from '../../../../../../../ui-component';
import { OrderDetailsType, OutfitDetailsType } from '../../../../../CreateOrder/type';

import {
  OrderOutfitsContainer,
  AddNewOutfit,
  OutfitMenu,
  SearchOutfitContainer,
  OutfitChip,
} from './style';

type OrderOutfitsProps = {
  order_details: OrderDetailsType;
  selected_outfits: Record<string, OutfitDetailsType>;
  outfit_list: OutfitDetailsType[];
  selectedOutfitChipIndex: number;
  handleAddNewOutfit: (outfitIndex: number) => void;
  updateOutfitChipIndex: (chipIndex: number) => void;
  deleteModalRef: RefObject<ModalMethods>;
  setOutfitToDeleteIndex: (index: number) => void;
};

const OrderOutfits = ({
  order_details,
  selected_outfits,
  outfit_list,
  selectedOutfitChipIndex,
  handleAddNewOutfit,
  updateOutfitChipIndex,
  deleteModalRef,
  setOutfitToDeleteIndex,
}: OrderOutfitsProps) => {
  const ref = useRef<PopoverMethods>(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const formType = searchParams.get('formType');

  const { order_items } = order_details;

  const handleOutfitClick = (outfitIndex: number) => {
    handleAddNewOutfit(outfitIndex);
    ref.current?.hide();
  };

  const laucher = (
    <AddNewOutfit>
      <PlusIcon color="var(--color-primary)" />
      <Text size="small" fontWeight={600} color="var(--color-primary)">
        Add Outfit
      </Text>
    </AddNewOutfit>
  );

  //   if (_isNil(selected_outfits) || _isEmpty(selected_outfits)) {
  //     return null;
  //   }

  return (
    <OrderOutfitsContainer id="add-outfit-container">
      <Text fontWeight={500}>Add Outfit Details:</Text>

      {formType !== 'edit' && (
        <Popover ref={ref} laucher={laucher}>
          <OutfitMenu>
            <SearchOutfitContainer>
              <Text color="black" fontWeight={500}>
                Select Outfits
              </Text>
            </SearchOutfitContainer>
            <div>
              {outfit_list.map((outfit) => (
                <div
                  key={outfit.outfit_index}
                  onClick={() => handleOutfitClick(outfit.outfit_index)}
                >
                  <Text color="black" fontWeight={500} className="outfit-list-item">
                    {outfit.outfit_details_title}
                  </Text>
                </div>
              ))}
            </div>
          </OutfitMenu>
        </Popover>
      )}

      {order_items.map((item, index) => {
        const currentOutfit =
          !_isNil(selected_outfits) && !_isEmpty(selected_outfits)
            ? selected_outfits[item.outfit_type]
            : null;

        if (_isNil(currentOutfit)) {
          return null;
        }

        return (
          <OutfitChip
            key={index}
            isSelected={index === selectedOutfitChipIndex}
            onClick={() => updateOutfitChipIndex(index)}
          >
            {/* {index === selectedOutfitChipIndex && <RadioIcon />} */}
            <img src={currentOutfit?.outfit_link ?? ''} alt={currentOutfit.outfit_name} />
            <Text size="small" fontWeight={600} color="black">
              {item.outfit_alias ?? currentOutfit.outfit_details_title}
            </Text>
            <div
              className="cross-icon"
              onClick={(e) => {
                e.stopPropagation();
                setOutfitToDeleteIndex(index);
                deleteModalRef.current?.show();
              }}
            >
              <CrossIcon />
            </div>
          </OutfitChip>
        );
      })}
    </OrderOutfitsContainer>
  );
};

export default OrderOutfits;
