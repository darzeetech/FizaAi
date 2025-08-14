import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

import type { Options } from '../../components/FormComponents/type';
import { Text, Button } from '../../ui-component';

import { LabelContainer, CheckboxGroupBtnContainer, OptionContainer } from './style';

export type CheckboxGroupProps = {
  id: number;
  label?: string;
  type?: string;
  options?: Options[];
  defaultValue?: string;
  value?: string[];
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  errorMessage?: string;
  onChange: (value: Options) => void;
};

const CheckboxGroupButton = (props: CheckboxGroupProps) => {
  const { label, required = false, options = [], errorMessage, value, onChange } = props;

  const hasError = !_isEmpty(errorMessage);

  return (
    <CheckboxGroupBtnContainer>
      {!_isUndefined(label) && label !== '' && (
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

      <OptionContainer>
        {options.length > 0 &&
          options.map((item) => {
            const isSelected = value?.includes(item.value) ?? false;

            return (
              <div className="checkbox-input-div" key={item.value}>
                <Button
                  appearance={isSelected ? 'filled' : 'outlined'}
                  color={isSelected ? 'white' : 'transparent'}
                  bgColor={isSelected ? 'primary' : 'var(--color-nightRider)'}
                  onClick={() => onChange(item)}
                >
                  {item.label}
                </Button>
              </div>
            );
          })}
      </OptionContainer>

      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}
    </CheckboxGroupBtnContainer>
  );
};

export default CheckboxGroupButton;
