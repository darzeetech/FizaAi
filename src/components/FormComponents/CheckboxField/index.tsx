import { useState, type ChangeEvent, useEffect } from 'react';
import _isUndefined from 'lodash/isUndefined';

import { Checkbox } from '../../../ui-component';

type CheckboxFieldProps = {
  label?: string;
  value?: boolean;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: string;
  hasError?: boolean;
  errorMsg?: string;
  onChange?: (inputValue: boolean) => void;
};

const CheckboxField = (props: CheckboxFieldProps) => {
  const { errorMsg = '', onChange } = props;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!_isUndefined(onChange)) {
      onChange(e.target.checked);
    }
  };

  return <Checkbox {...props} errorMessage={errorMessage} onChange={handleCheckboxChange} />;
};

export default CheckboxField;
