import { createSlice } from '@reduxjs/toolkit';
import type { DashboardDetailsType } from '../type';

type DashboardReducerType = {
  dashboardDetails?: DashboardDetailsType;
};

const initialState: DashboardReducerType = {};

export const DashboardSlice = createSlice({
  name: 'Dashboard',
  initialState,
  reducers: {
    updateDashboardData: (state, action) => {
      const data = action?.payload?.data || {};
      state.dashboardDetails = data;
    },
  },
});

export const { updateDashboardData } = DashboardSlice.actions;
export default DashboardSlice.reducer;
