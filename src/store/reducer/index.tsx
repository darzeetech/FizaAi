import { createSlice } from '@reduxjs/toolkit';

type CommonDataReducerType = {
  headerData: {
    enableHeaderBackButton: boolean;
  };
};

const initialState: CommonDataReducerType = {
  headerData: {
    enableHeaderBackButton: true,
  },
};

export const CommonDataSlice = createSlice({
  name: 'Onboading',
  initialState,
  reducers: {
    updateHeaderData: (state, action) => {
      const data = action?.payload?.data ?? {};
      state.headerData = data;
    },
  },
});

export const { updateHeaderData } = CommonDataSlice.actions;
export default CommonDataSlice.reducer;
