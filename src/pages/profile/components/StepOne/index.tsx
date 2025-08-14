import { useSelector } from 'react-redux';
import {
  InputField,
  BulkImageUploadField,
  RadioField,
} from '../../../../components/FormComponents';
import { Text } from '../../../../ui-component';

import type { RootState } from '../../../../store';

import ProfilePicUpload from '../ProfilePicUpload';
import { TAILOR_OPTIONS } from '../../contant';

type StepOneProps = {
  handleChange: (value: any, key: string) => void;
};

const StepOne = (props: StepOneProps) => {
  const { handleChange } = props;

  const { onboardingReducer } = useSelector((state: RootState) => state);
  const { profileData } = onboardingReducer;

  return (
    <div className="w-full mt-[2rem] flex flex-col gap-2">
      <Text size="xxxl" color="black" fontWeight={800}>
        Enter your details
      </Text>

      <ProfilePicUpload
        value={profileData?.profile_pic_url ?? {}}
        onChange={(value) => handleChange(value, 'profile_pic_url')}
      />

      <InputField
        label="Enter Your Full Name"
        placeholder="Enter Your Full Name"
        type="text"
        required={true}
        value={profileData?.tailor_name ?? ''}
        onChange={(value) => handleChange(value, 'tailor_name')}
      />

      <InputField
        label="Enter Your Shop Name"
        placeholder="Enter Your Shop Name"
        type="text"
        required={true}
        value={profileData?.boutique_details?.boutique_name ?? ''}
        onChange={(value) => handleChange(value, 'boutique_details.boutique_name')}
      />

      <RadioField
        label="Type of Tailor"
        type="radio"
        required={true}
        value={profileData?.boutique_details?.boutique_type ?? ''}
        options={TAILOR_OPTIONS}
        onChange={(value) => handleChange(value, 'boutique_details.boutique_type')}
      />

      <BulkImageUploadField
        label="Upload Shop Picture"
        placeholder="Upload Shop Picture"
        type="file"
        required={false}
        multiple={true}
        maxUpload={3}
        fileTypeRequired={false}
        value={profileData?.boutique_details?.shop_image_urls ?? []}
        onChange={(value) => handleChange(value, 'boutique_details.shop_image_urls')}
      />
    </div>
  );
};

export default StepOne;
