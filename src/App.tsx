import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { updateUserData } from './pages/signin/reducer';
import { updateBoutiqueData } from './pages/profile/reducer';

import { api } from './utils/apiRequest';
import { GA_ID } from './utils/contant';
import { getValueFromLocalStorage, installAIBot, installGA } from './utils/common';
import routes from './router';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateUserData({ data: getValueFromLocalStorage('userDetails') }));

    const token = getValueFromLocalStorage('token');

    if (!_isNil(token) && !_isEmpty(token)) {
      //get Boutique Details if boutique Id is present
      void getBoutiqueDetails();
    }
  }, []);

  const getBoutiqueDetails = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      const response = await api.getRequest(`boutique/${boutique_id}`);

      const { data, status } = response;

      if (status) {
        dispatch(updateBoutiqueData({ boutiqueData: data }));
      }
    }
  };

  useEffect(() => {
    const buildEnv = process.env.REACT_APP_BUILD_ENVIRONMENT;

    if (buildEnv === 'production' && !window.location.pathname.includes('order_tracking')) {
      installGA(GA_ID);
      installAIBot();
    }
  }, []);

  return <RouterProvider router={routes} />;
};

export default App;
