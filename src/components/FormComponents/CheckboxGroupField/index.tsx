import { useState, useEffect } from 'react';

import { CheckboxGroupButton, CheckboxGroupProps } from '../../../ui-component';
import type { Options } from '../type';

type CheckboxGroupFieldProps = Omit<CheckboxGroupProps, 'onChange'> & {
  errorMsg?: string;
  onChange: (value: string[]) => void;
};

const CheckboxGroupField = (props: CheckboxGroupFieldProps) => {
  const { errorMsg = '', multiple = false, value, onChange } = props;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleCheckboxChange = (selectedOption: Options) => {
    const isPresent = value?.includes(selectedOption.value) ?? false;

    if (multiple) {
      const updatedValue = value?.filter((option: string) => option !== selectedOption.value) ?? [];

      onChange(isPresent ? updatedValue : [...updatedValue, selectedOption.value]);
    } else {
      onChange(isPresent ? [] : [selectedOption.value]);
    }
  };

  return (
    <CheckboxGroupButton {...props} errorMessage={errorMessage} onChange={handleCheckboxChange} />
  );
};

export default CheckboxGroupField;
