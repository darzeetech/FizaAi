import { useEffect, useState } from 'react';
import { DateRange, DateRangeProps } from '../../../ui-component';

export type ValueFormatType = 'epoch' | 'isoString';

type DateRangeFieldProps = Omit<DateRangeProps, 'onChange'> & {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: {
    startDate: string | number;
    endDate: string | number;
  };
  dateFormat?: string;
  valueFormat?: ValueFormatType;
  onChange: (startDate: string | number, endDate: string | number) => void;
  disabled?: boolean;
  required?: boolean;
  defaultValue?: any;
  maxDate?: number;
  minDate?: number;
  errorMsg?: string;
};

const DateRangeField = (props: DateRangeFieldProps) => {
  const { required = false, valueFormat = 'epoch', errorMsg = '', onChange } = props;
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setErrorMessage(errorMsg);
  }, [errorMsg]);

  const getDateBasedOnValueFormat = (date: Date) => {
    switch (valueFormat) {
      case 'isoString':
        return new Date(date).toISOString().slice(0, 19);
      default:
        //expected epoch format
        return new Date(date).getTime();
    }
  };

  const handleDateChange = (startDate: Date, endDate: Date) => {
    onChange(getDateBasedOnValueFormat(startDate), getDateBasedOnValueFormat(endDate));

    if (required) {
      //   if (_isNil(date)) {
      //     setErrorMessage('This field is required');
      //   } else {
      //     setErrorMessage('');
      //   }
    }
  };

  return <DateRange {...props} errorMessage={errorMessage} onChange={handleDateChange} />;
};

export default DateRangeField;
