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

  // 🔹 On app load: restore user + fetch boutique if logged in
  useEffect(() => {
    // Restore user from localStorage
    dispatch(updateUserData({ data: getValueFromLocalStorage('userDetails') }));

    const token = getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token');

    if (!_isNil(token) && !_isEmpty(token)) {
      // get Boutique Details if boutique Id is present
      void getBoutiqueDetails();
    }
  }, [dispatch]);

  const getBoutiqueDetails = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id) && boutique_id !== '') {
      // 👇 Important:
      // - We now call "boutique/" (no ID in path)
      // - apiRequest will automatically:
      //   - attach Authorization: Bearer <token>
      //   - attach x-boutique-id: <boutique_id>
      const response = await api.getRequest('boutique/');

      const { data, status } = response;
      // console.log('boutique response:', response);

      if (status) {
        dispatch(updateBoutiqueData({ boutiqueData: data }));
      }
    }
  };

  // 🔹 GA + AI Bot for production only
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
