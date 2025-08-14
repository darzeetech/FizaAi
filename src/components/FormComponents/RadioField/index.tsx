import { useState, type ChangeEvent, useEffect } from 'react';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { Radio } from '../../../ui-component';
import type { Options } from '../type';

type RadioFieldProps = {
  type: string;
  value: string;
  onChange?: (inputValue: string) => void;
  label?: string;
  options?: Options[];
  appearance?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  errorMsg?: string;
};

const RadioField = (props: RadioFieldProps) => {
  const { label = '', errorMsg = '', required = false, onChange } = props;
  const [errorMessage, setErrorMessage] = useState(errorMsg);

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>, value: Options) => {
    if (typeof onChange === 'function') {
      onChange(value.value);
    }

    if (required) {
      if (_isNil(value.value) || _isEmpty(value.value)) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  };

  return (
    <Radio {...props} label={label} errorMessage={errorMessage} onChange={handleRadioChange} />
  );
};

export default RadioField;
