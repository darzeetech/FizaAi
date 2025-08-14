import { useState, useEffect } from 'react';
// import _isUndefined from 'lodash/isUndefined';
// import _isEmpty from 'lodash/isEmpty';

import { Dropdown, DropdownProps } from '../../../ui-component';

type DropdownFieldProps = DropdownProps & {
  placeholder?: string;
  //   value?: Options | Options[];
  onChange: (DropdownValue: any) => void;
  errorMsg?: string;
};

const DropdownField = (props: DropdownFieldProps) => {
  const { label = '', required = false, options = [], errorMsg = '', onChange, ...rest } = props;
  const [errorMessage, setErrorMessage] = useState(errorMsg);

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleDropdownChange = (selectedOption: any) => {
    // const value = e.target.value;
    onChange(selectedOption);

    // if (required) {
    //   if (value.length === 0) {
    //     setErrorMessage('This field is required');
    //   } else {
    //     setErrorMessage('');
    //   }
    // } else {
    //   setErrorMessage('');
    // }

    // if (!_isUndefined(regex) && !_isEmpty(value)) {
    //   const { valid, message } = validateValueWithRegex(value, regex);

    //   if (valid) {
    //     setErrorMessage('');
    //   } else {
    //     setErrorMessage(message);
    //   }
    // }
  };

  return (
    <Dropdown
      label={label}
      required={required}
      errorMessage={errorMessage}
      options={options}
      onChange={handleDropdownChange}
      {...rest}
    />
  );
};

export default DropdownField;
