import { ChangeEvent } from 'react';
import _isEmpty from 'lodash/isEmpty';

import Text from '../../ui-component/Text';

import { LabelContainer, CheckboxContainer } from './style';

type CheckboxProps = {
  label?: string;
  defaultValue?: string;
  value?: boolean;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox = (props: CheckboxProps) => {
  const {
    label,
    required = false,
    disabled = false,
    errorMessage,
    value,
    hasError = false,
    className = '',
    onChange,
  } = props;

  return (
    <CheckboxContainer className={className}>
      <div className="checkbox-input-div">
        <input
          className="checkbox-input"
          type="checkbox"
          disabled={disabled}
          onChange={onChange}
          checked={value}
        />
        {!_isEmpty(label) && (
          <LabelContainer>
            <Text color="black" fontWeight={500}>
              {label}
            </Text>
            {required && (
              <Text color="black" className="mandatory">
                *
              </Text>
            )}
          </LabelContainer>
        )}
      </div>

      {hasError && <Text color="red">{errorMessage}</Text>}
    </CheckboxContainer>
  );
};

export default Checkbox;
