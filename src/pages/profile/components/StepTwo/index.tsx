import { useSelector } from 'react-redux';
import { InputField } from '../../../../components/FormComponents';
import { Text } from '../../../../ui-component';

import type { RootState } from '../../../../store';

type StepTwoProps = {
  handleChange: (value: any, key: string) => void;
};

const StepTwo = (props: StepTwoProps) => {
  const { handleChange } = props;

  const { onboardingReducer } = useSelector((state: RootState) => state);
  const { profileData } = onboardingReducer;

  return (
    <div className="w-full h-full flex flex-col gap-4 mt-[2rem]">
      <Text size="xxxl" color="black" fontWeight={800}>
        How many people work in your boutique?
      </Text>

      <InputField
        label="This will help us provide you better customized experience."
        placeholder="This will help us provide you better customized experience."
        type="text"
        required={true}
        value={profileData?.tailor_count ?? ''}
        onChange={(value) => handleChange(value, 'tailor_count')}
      />
    </div>
  );
};

export default StepTwo;
