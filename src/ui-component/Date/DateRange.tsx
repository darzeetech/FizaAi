import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';

import { CalenderIcon } from '../../assets/icons';
import Text from '../Text';

import { DateContainer, LabelContainer } from './style';

export type DateRangeProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: {
    startDate: string | number;
    endDate: string | number;
  };
  className?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  valueFormat?: string;
  errorMessage?: string;
  maxDate?: number;
  minDate?: number;
  onChange: (startDate: Date, endDate: Date) => void;
};

const DateRange = (props: DateRangeProps) => {
  const {
    label,
    placeholder,
    className = '',
    dateFormat = 'MM/dd/yyyy',
    value,
    required = false,
    errorMessage = '',
    maxDate,
    minDate,
    onChange,
  } = props;

  const datePickerRef = useRef<DatePicker>(null);

  const [startDate, setStartDate] = useState<Date | null>();
  const [endDate, setEndDate] = useState<Date | null>();

  const hasError = !_isEmpty(errorMessage);

  useEffect(() => {
    if (!_isUndefined(value)) {
      const { startDate, endDate } = value;

      if (startDate) {
        setStartDate(new Date(startDate));
      }

      if (endDate) {
        setEndDate(new Date(endDate));
      }
    }
  }, [value]);

  const handleChange = (dates: [Date, Date]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    // if (!end) {
    //   setError('End Date is mandatory');
    // } else {
    //   setError('');
    // }

    if (start && end) {
      onChange(start, end);
    }
  };

  const openDatePicker = () => {
    if (datePickerRef.current) {
      datePickerRef.current.setOpen(true);
    }
  };

  return (
    <DateContainer className={className}>
      {!_isEmpty(label) && (
        <LabelContainer>
          <Text color="black" fontWeight={500}>
            {label}
            {required && (
              <Text color="black" className="mandatory">
                *
              </Text>
            )}
          </Text>
        </LabelContainer>
      )}

      <div className="date-picker-container">
        <DatePicker
          ref={datePickerRef}
          showIcon={false}
          selectsRange
          selected={startDate}
          startDate={startDate}
          endDate={endDate}
          placeholderText={placeholder}
          onChange={handleChange}
          name={label}
          dateFormat={dateFormat}
          showMonthYearPicker={dateFormat === 'MM/yy'}
          maxDate={!_isUndefined(maxDate) ? new Date(maxDate) : undefined}
          minDate={!_isUndefined(minDate) ? new Date(minDate) : undefined}
        />
        <div className="icon" onClick={openDatePicker}>
          <CalenderIcon />
        </div>
      </div>
      {hasError && (
        <Text color="red" size="small">
          {errorMessage}
        </Text>
      )}
    </DateContainer>
  );
};

export default DateRange;
