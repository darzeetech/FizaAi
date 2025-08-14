import { combineReducers } from 'redux';

import commonDataReducer from './reducer';
import signInReducer from '../pages/signin/reducer';
import onboardingReducer from '../pages/profile/reducer';
import dashboardReducer from '../pages/dashboard/reducer';
import createOrderReducer from '../pages/Order/CreateOrder/reducer';

const rootReducer = combineReducers({
  commonDataReducer,
  signInReducer,
  onboardingReducer,
  dashboardReducer,
  createOrderReducer,
});

export default rootReducer;
