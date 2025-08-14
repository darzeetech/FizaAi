import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import PhoneInput, { parsePhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { validateValueWithRegex } from '../../../../../utils/common';
import { integerRegex, mobileNumberRegex } from '../../../../../utils/regexValue';
import {
  BulkImageUploadField,
  InputField,
  RadioField,
} from '../../../../../components/FormComponents';
import { Text } from '../../../../../ui-component';
import type { CustomerDetailsErrorType, CustomerDetailsType } from '../../../types';

import { defaultErrorObj } from '../../constant';

import { GENDER_OPTION } from './constant';
import { DetailsStyled, FieldWrapper, PhoneFieldWrapper, RadioFieldWrapper } from './style';

type DetailsProps = {
  handleChange: (objList: Array<{ value: any; key: string }>) => void;
  setErrorData: (obj?: CustomerDetailsErrorType) => void;
  setIsloading: (data: boolean) => void;
  data?: CustomerDetailsType;
  errorData?: CustomerDetailsErrorType;
};

const Details = ({ data, errorData, setErrorData, handleChange, setIsloading }: DetailsProps) => {
  const handlePhoneNumberChange = (phone: string | undefined) => {
    if (!_isNil(phone)) {
      const parsedPhoneNumber = parsePhoneNumber(phone);

      if (!_isNil(parsedPhoneNumber)) {
        const countryCode = '+' + parsedPhoneNumber.countryCallingCode;
        const phoneNumber = parsedPhoneNumber.number.substring(countryCode.length);

        const list = [
          {
            key: 'country_code',
            value: countryCode,
          },
          {
            key: 'phone_number',
            value: phoneNumber,
          },
        ];

        handleChange(list);

        const { valid, message } = validateValueWithRegex(phoneNumber, mobileNumberRegex);

        if (!_isNil(errorData)) {
          setErrorData({
            ...errorData,
            phone_number: valid ? '' : message,
          });
        } else {
          setErrorData({
            ...defaultErrorObj,
            phone_number: valid ? '' : message,
          });
        }
      }
    }
  };

  const updateInfoInParent = (obj: Record<string, any>) => {
    if ('isLoading' in obj) {
      setIsloading(obj.isLoading);
    }
  };

  return (
    <DetailsStyled>
      <FieldWrapper>
        <InputField
          label="Name"
          placeholder="Enter Full Name"
          type="text"
          required={true}
          value={data?.name ?? ''}
          errorMsg={errorData?.name ?? ''}
          onChange={(value) => handleChange([{ value, key: 'name' }])}
        />

        <InputField
          label="Age"
          placeholder="Enter Age"
          type="text"
          required={false}
          value={data?.age ?? ''}
          errorMsg={errorData?.age ?? ''}
          regex={integerRegex}
          onChange={(value) => handleChange([{ value, key: 'age' }])}
        />
      </FieldWrapper>

      <PhoneFieldWrapper>
        <Text className="label" fontWeight={500}>
          Phone Number
        </Text>

        <PhoneInput
          international
          defaultCountry="IN"
          value={(data?.country_code ?? '') + (data?.phone_number ?? '')}
          onChange={handlePhoneNumberChange}
          className="phone-input"
        />

        {!_isNil(errorData?.phone_number) && !_isEmpty(errorData?.phone_number) && (
          <Text color="red" size="small">
            {errorData?.phone_number}
          </Text>
        )}
      </PhoneFieldWrapper>

      <RadioFieldWrapper>
        <RadioField
          label="Gender"
          type="radio"
          required={true}
          value={data?.gender ?? ''}
          errorMsg={errorData?.gender ?? ''}
          options={GENDER_OPTION}
          onChange={(value) => handleChange([{ value, key: 'gender' }])}
        />
      </RadioFieldWrapper>

      <BulkImageUploadField
        label="Photo"
        placeholder="Upload Photo"
        type="file"
        required={false}
        multiple={false}
        maxUpload={1}
        fileTypeRequired={false}
        value={data?.customer_image_urls}
        onChange={(value) => handleChange([{ value, key: 'customer_image_urls' }])}
        updateInfoInParent={updateInfoInParent}
      />
    </DetailsStyled>
  );
};

export default Details;
