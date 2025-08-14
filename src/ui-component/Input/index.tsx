import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';
import Text from '../Text';

import { HelpText, InputContainer, LabelContainer } from './style';
import { ChangeEvent, ReactNode } from 'react';

export type InputProps = {
  label: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  maxLength?: number;
  errorMessage?: string;
  leadingIcon?: ReactNode;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const Input = (props: InputProps) => {
  const {
    label,
    placeholder = '',
    className = '',
    type,
    rows = 4,
    // disabled = false,
    required = false,
    errorMessage = '',
    leadingIcon,
  } = props;

  const hasError = !_isEmpty(errorMessage);

  return (
    <InputContainer hasError={hasError} className={className}>
      {!_isEmpty(label) && (
        <>
          <LabelContainer>
            <Text fontWeight={500} color="black">
              {label}
              {required && (
                <Text color="black" className="mandatory">
                  *
                </Text>
              )}
            </Text>
          </LabelContainer>
          {!_isNil(props.maxLength) && (
            <HelpText size="small">{`You can write upto ${props.maxLength} characters.`}</HelpText>
          )}
        </>
      )}

      <div className="input-styled">
        {!_isNil(leadingIcon) && <div className="leading-icon">{leadingIcon}</div>}
        {type === 'textarea' ? (
          <textarea rows={rows} placeholder={placeholder} {...props} />
        ) : (
          <input placeholder={placeholder} {...props} />
        )}
      </div>

      {hasError && (
        <Text className="error-class" color="red" size="small">
          {errorMessage}
        </Text>
      )}
    </InputContainer>
  );
};

export default Input;
