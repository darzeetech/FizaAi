import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _isNil from 'lodash/isNil';

import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { ContentContainer, PrivateContainer, RightContainer } from './style';
import { Loader } from '../ui-component';
import { getValueFromLocalStorage } from '../utils/common';

type PrivateWrapperProps = {
  Content: () => JSX.Element | null;
  sidebarRequired?: boolean;
};

const PrivateWrapper = ({ Content, sidebarRequired = true }: PrivateWrapperProps) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedFlag = localStorage.getItem('isAuthenticated') === 'true';
    const token = getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token');

    return storedFlag && !_isNil(token) && token !== '';
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedFlag = localStorage.getItem('isAuthenticated') === 'true';
    const token = getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token');

    if (storedFlag && !_isNil(token) && token !== '') {
      setIsAuthenticated(true);
    } else {
      handleLogout();
    }

    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // No dedicated /login route now → go to home (FizaAI)
    navigate('/');
  };

  if (isLoading) {
    return <Loader showLoader={isLoading} />;
  }

  if (!isAuthenticated) {
    // Optionally redirect immediately
    navigate('/');

    return null;
  }

  return (
    <PrivateContainer sidebarRequired={sidebarRequired}>
      {sidebarRequired ? (
        <>
          <Sidebar />
          <RightContainer>
            <Header />
            <ContentContainer>
              <Content />
            </ContentContainer>
          </RightContainer>
        </>
      ) : (
        <ContentContainer hasHeader={true}>
          <Content />
        </ContentContainer>
      )}
    </PrivateContainer>
  );
};

export default PrivateWrapper;
