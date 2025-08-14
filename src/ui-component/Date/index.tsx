import { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import _isEmpty from 'lodash/isEmpty';
import _isUndefined from 'lodash/isUndefined';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';

import { CalenderIcon } from '../../assets/icons';
import Text from '../Text';

import { DateContainer, LabelContainer } from './style';

type DateProps = {
  label?: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: number | string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  dateFormat?: string;
  valueFormat?: string;
  errorMessage?: string;
  maxDate?: number;
  minDate?: number;
  showTimeSelect?: boolean;
  timeIntervals?: number;
  onChange: (selectedDate: Date) => void;
};

const SingleDate = (props: DateProps) => {
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
    showTimeSelect = false,
    timeIntervals = 30,
    onChange,
  } = props;

  const datePickerRef = useRef<DatePicker>(null);

  const [startDate, setStartDate] = useState<Date | null>();
  const hasError = !_isEmpty(errorMessage);

  useEffect(() => {
    const epoch = !_isUndefined(value) ? new Date(value) : null;

    setStartDate(epoch);
  }, [value]);

  const handleChange = (date: Date) => {
    onChange(date);
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
          autoComplete="off"
          showIcon={false}
          selected={startDate}
          placeholderText={placeholder}
          onChange={handleChange}
          showTimeSelect={showTimeSelect}
          timeFormat="HH:mm"
          timeIntervals={timeIntervals}
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

export default SingleDate;
