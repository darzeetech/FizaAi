import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import _isNil from 'lodash/isNil';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { auth } from '../firbase/index';
import { ContentContainer, PrivateContainer, RightContainer } from './style';
import { onAuthStateChanged } from 'firebase/auth';
import { Loader } from '../ui-component';

type PrivateWrapperProps = {
  Content: () => JSX.Element | null;
  sidebarRequired?: boolean;
};

const PrivateWrapper = ({ Content, sidebarRequired = true }: PrivateWrapperProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          if (!_isNil(token) && token !== '') {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userToken', token);
          } else {
            handleLogout();
          }
        } catch (error) {
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  if (isLoading) {
    return <Loader showLoader={isLoading} />;
  }

  if (!isAuthenticated) {
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
