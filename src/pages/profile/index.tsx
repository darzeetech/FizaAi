import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _isNil from 'lodash/isNil';

import type { RootState } from '../../store';

import { PageContainer } from '../../components';
import {
  getValueFromLocalStorage,
  setDataAtKeyInNestedObject,
  setValueInLocalStorage,
} from '../../utils/common';
import { api } from '../../utils/apiRequest';

import { Text } from '../../ui-component';
import { RightArrowIcon } from '../../assets/icons';

import { updateBoutiqueData, updateProfileData } from './reducer';
import type { ProfileType } from './type';

import {
  Container,
  DetailsContainer,
  EmptyContainer,
  FieldsContainer,
  NextStepContainer,
} from './style';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';

const Profile = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const stepNum = searchParams.get('step') ?? '1';

  const { onboardingReducer, signInReducer } = useSelector((state: RootState) => state);
  const { profileData } = onboardingReducer;
  const { user } = signInReducer;

  const handleChange = (value: any, key: string) => {
    let updatedProfileData = structuredClone(profileData);

    updatedProfileData = setDataAtKeyInNestedObject(updatedProfileData, key, value) as ProfileType;

    dispatch(
      updateProfileData({
        profileData: updatedProfileData,
      })
    );
  };

  const handleNextButtonClick = async () => {
    if (stepNum === '1') {
      const shopImagesObj = profileData.boutique_details.shop_image_urls;
      const shop_image_urls = !_isNil(shopImagesObj)
        ? shopImagesObj.map((obj: Record<string, string>) => obj.reference_id)
        : [];

      const payload = {
        ...profileData,
        profile_pic_url: profileData.profile_pic_url.reference_id ?? '',
        boutique_details: {
          ...profileData.boutique_details,
          shop_image_urls,
        },
        extension: user.extension,
        phone_number: user.phone_number,
      };
      const response = await api.postRequest('tailor/signup', payload);

      const { data, status } = response;

      if (status) {
        if (!_isNil(data) && !_isEmpty(data)) {
          setValueInLocalStorage('token', data.token);
          setValueInLocalStorage('boutique_id', data.boutique_id);

          dispatch(updateBoutiqueData({ boutiqueData: data }));
        }
        navigate('/onboarding?step=2');
      }
    } else if (stepNum === '2') {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      if (!_isNil(boutique_id) && boutique_id != '') {
        const response = await api.putRequest(`boutique/${boutique_id}`, {
          tailor_count: profileData.tailor_count,
        });

        const { data, status } = response;

        if (status) {
          if (!_isNil(data) && !_isEmpty(data)) {
            dispatch(updateBoutiqueData({ boutiqueData: data }));
          }

          navigate('/dashboard');
        }
      }
    }
  };

  const isNextButtonDisabled = useMemo(() => {
    let isDisable = false;

    if (stepNum === '1') {
      if (_isNil(profileData.tailor_name) || _isEmpty(profileData.tailor_name)) {
        isDisable = true;
      }

      if (
        _isNil(profileData.boutique_details?.boutique_name) ||
        _isEmpty(profileData.boutique_details.boutique_name)
      ) {
        isDisable = true;
      }

      if (
        _isNil(profileData.boutique_details?.boutique_type) ||
        _isEmpty(profileData.boutique_details.boutique_type)
      ) {
        isDisable = true;
      }
    } else if (stepNum === '2') {
      if (_isNil(profileData.tailor_count) || _isEmpty(profileData.tailor_count)) {
        isDisable = true;
      }
    }

    return isDisable;
  }, [profileData, stepNum]);

  return (
    <Container as={PageContainer}>
      <EmptyContainer />
      <DetailsContainer>
        <FieldsContainer>
          {stepNum === '1' && <StepOne handleChange={handleChange} />}
          {stepNum === '2' && <StepTwo handleChange={handleChange} />}
        </FieldsContainer>
      </DetailsContainer>

      <EmptyContainer>
        <NextStepContainer disabled={isNextButtonDisabled} onClick={handleNextButtonClick}>
          <Text size="large" color="white" fontWeight={600}>
            Next
          </Text>
          <RightArrowIcon height="20" />
        </NextStepContainer>
      </EmptyContainer>
    </Container>
  );
};

export default Profile;
