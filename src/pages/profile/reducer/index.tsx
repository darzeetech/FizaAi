import { createSlice } from '@reduxjs/toolkit';
import type { BoutiqueDetailsType, ProfileType } from '../type';

type OnboardingReducerType = {
  profileData: ProfileType;
  boutiqueData?: BoutiqueDetailsType;
};

const initialState: OnboardingReducerType = {
  profileData: {
    tailor_name: '',
    tailor_count: 0,
    // extension: '',
    // phone_number: '',
    profile_pic_url: {},
    boutique_details: {},
  },
};

export const OnboardingSlice = createSlice({
  name: 'Onboading',
  initialState,
  reducers: {
    updateProfileData: (state, action) => {
      const data = action?.payload?.profileData ?? {};
      state.profileData = data;
    },
    updateBoutiqueData: (state, action) => {
      const data = action?.payload?.boutiqueData ?? {};
      state.boutiqueData = data;
    },
  },
});

export const { updateProfileData, updateBoutiqueData } = OnboardingSlice.actions;
export default OnboardingSlice.reducer;
