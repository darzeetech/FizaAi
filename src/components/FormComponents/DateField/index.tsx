import { useEffect, useState } from 'react';
import _isNil from 'lodash/isNil';
import { SingleDate } from '../../../ui-component';

export type ValueFormatType = 'epoch' | 'isoString' | 'utcString';

type SingleDateFieldProps = {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: number | string;
  dateFormat?: string;
  valueFormat?: ValueFormatType;
  onChange: (selectedDate: number | string) => void;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: any;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  maxDate?: number;
  minDate?: number;
  errorMsg?: string;
};

const SingleDateField = (props: SingleDateFieldProps) => {
  const { required = false, valueFormat = 'epoch', errorMsg = '', onChange } = props;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const getDateBasedOnValueFormat = (date: Date) => {
    switch (valueFormat) {
      case 'isoString':
        return date.toISOString();
      case 'utcString':
        return date.toUTCString();
      default:
        //expected epoch format
        return new Date(date).getTime();
    }
  };

  const handleDateChange = (date: Date) => {
    onChange(getDateBasedOnValueFormat(date));

    if (required) {
      if (_isNil(date)) {
        setErrorMessage('This field is required');
      } else {
        setErrorMessage('');
      }
    }
  };

  return <SingleDate {...props} errorMessage={errorMessage} onChange={handleDateChange} />;
};

export default SingleDateField;
