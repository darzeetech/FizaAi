import { ChangeEvent } from 'react';
import _isEmpty from 'lodash/isEmpty';

import { Options } from '../../components/FormComponents/type';
import Text from '../../ui-component/Text';

import { LabelContainer, OptionContainer, RadioContainer } from './style';

type RadioProps = {
  label: string;
  type: string;
  options?: Options[];
  defaultValue?: string;
  value?: string;
  checked?: boolean;
  appearance?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>, value: Options) => void;
};

const Radio = (props: RadioProps) => {
  const {
    label,
    required = false,
    disabled = false,
    appearance = 'horizontal',
    options = [],
    errorMessage,
    value,
    onChange,
  } = props;

  const hasError = !_isEmpty(errorMessage);

  return (
    <RadioContainer>
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

      <OptionContainer appearance={appearance}>
        {options.length > 0 &&
          options.map((item) => {
            return (
              <div className="radio-input-div" key={item.value}>
                <input
                  className="radio-input"
                  type="radio"
                  id={item.value}
                  disabled={disabled}
                  onChange={(e) => onChange(e, item)}
                  checked={value === item.value}
                />
                <label className="radio-label">
                  <span className="circle"></span>
                  {item.label}
                </label>
              </div>
            );
          })}
      </OptionContainer>

      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}
    </RadioContainer>
  );
};

export default Radio;
