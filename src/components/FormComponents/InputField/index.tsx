import { useState, type ChangeEvent, useEffect, ReactNode } from 'react';
import _isUndefined from 'lodash/isUndefined';
import _isEmpty from 'lodash/isEmpty';

import { RegexObj } from '../../../utils/regexValue';
import { validateValueWithRegex } from '../../../utils/common';
import { Input } from '../../../ui-component';
import isUndefined from 'lodash/isUndefined';

type InputFieldProps = {
  placeholder?: string;
  type: string;
  value: any;
  onChange?: (inputValue: string, errMsg?: string) => void;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: any;
  rows?: number;
  maxLength?: number;
  errorMsg?: string;
  leadingIcon?: ReactNode;
  regex?: RegexObj;
  className?: string;
};

const InputField = (props: InputFieldProps) => {
  const { label = '', required = false, regex, errorMsg = '', onChange } = props;
  const [errorMessage, setErrorMessage] = useState(errorMsg);

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;

    let currMessage = '';

    if (required) {
      if (value.length === 0) {
        setErrorMessage('This field is required');
        currMessage = 'This field is required';
      } else {
        setErrorMessage('');
        currMessage = '';
      }
    } else {
      setErrorMessage('');
      currMessage = '';
    }

    if (!_isUndefined(regex) && !_isEmpty(value)) {
      const { valid, message } = validateValueWithRegex(value, regex);

      if (valid) {
        setErrorMessage('');
        currMessage = '';
      } else {
        setErrorMessage(message);
        currMessage = message;
      }
    }

    if (!isUndefined(onChange)) {
      onChange(value, currMessage);
    }
  };

  return (
    <Input {...props} label={label} errorMessage={errorMessage} onChange={handleInputChange} />
  );
};

export default InputField;
