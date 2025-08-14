import { createSlice } from '@reduxjs/toolkit';

type SignInReducerType = {
  user: Record<string, any>;
};

const initialState: SignInReducerType = {
  user: {},
};

export const SignInSlice = createSlice({
  name: 'Sign In',
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      const data = action?.payload?.data ?? {};
      state.user = data;
    },
  },
});

export const { updateUserData } = SignInSlice.actions;
export default SignInSlice.reducer;
