import { useState, useEffect } from 'react';
import _isUndefined from 'lodash/isUndefined';

import { Counter } from '../../../ui-component';

type CounterFieldProps = {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  onChange?: (count: number) => void;
};

const CounterField = (props: CounterFieldProps) => {
  const { errorMsg = '', onChange } = props;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const handleCounterChange = (count: number) => {
    if (!_isUndefined(onChange)) {
      onChange(count);
    }
  };

  return <Counter {...props} errorMessage={errorMessage} onChange={handleCounterChange} />;
};

export default CounterField;
