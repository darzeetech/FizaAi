import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

import { PlusIcon, MinusIcon } from '../../assets/icons';
import { Text } from '../';

import { CounterStyled, LabelContainer, IconContainer } from './style';

type CounterProps = {
  label?: string;
  value: number;
  min_value?: number;
  max_value?: number;
  errorMessage?: string;
  onChange: (count: number) => void;
};

const Counter = ({ label, value, min_value, max_value, onChange }: CounterProps) => {
  const isMinusIconEnable = _isUndefined(min_value) || value > min_value;
  const isPlusIconEnable = _isUndefined(max_value) || value < max_value;

  const decreaseCount = () => {
    if (isMinusIconEnable) {
      onChange(value - 1);
    }
  };

  const increaseCount = () => {
    if (isPlusIconEnable) {
      onChange(value + 1);
    }
  };

  return (
    <div>
      {!_isEmpty(label) && (
        <LabelContainer>
          <Text color="black" fontWeight={500}>
            {label}
          </Text>
        </LabelContainer>
      )}
      <CounterStyled>
        <IconContainer isEnable={isMinusIconEnable} onClick={decreaseCount}>
          <MinusIcon
            color={isMinusIconEnable ? 'var(--color-nightRider)' : 'var(--color-disabled)'}
          />
        </IconContainer>

        <Text color="primary" size="large" fontWeight={700}>
          {value}
        </Text>

        <IconContainer isEnable={isPlusIconEnable} onClick={increaseCount}>
          <PlusIcon
            color={isPlusIconEnable ? 'var(--color-nightRider)' : 'var(--color-disabled)'}
          />
        </IconContainer>
      </CounterStyled>
    </div>
  );
};

export default Counter;
