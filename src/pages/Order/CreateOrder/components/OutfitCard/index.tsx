import CheckboxField from '../../../../../components/FormComponents/CheckboxField';
import { Text } from '../../../../../ui-component';

import { OutfitDetailsType } from '../../type';
import { OutfitCardContainer } from './style';

type OutfitCardProps = {
  data: OutfitDetailsType;
  isSelected: boolean;
  handleOutfitSelection: (value: boolean, outfit: OutfitDetailsType) => void;
};

const OutfitCard = (props: OutfitCardProps) => {
  const { data, handleOutfitSelection, isSelected } = props;

  const { outfit_link, outfit_details_title, outfit_name } = data;

  const onChange = (value: boolean) => {
    handleOutfitSelection(value, data);
  };

  return (
    <OutfitCardContainer isSelected={isSelected} onClick={() => onChange(!isSelected)}>
      <CheckboxField value={isSelected} className="outfit-selection-checkbox" />
      <img src={outfit_link} alt={outfit_name} loading="lazy" />
      <Text size="small" fontWeight={600}>
        {outfit_details_title}
      </Text>
    </OutfitCardContainer>
  );
};

export default OutfitCard;
