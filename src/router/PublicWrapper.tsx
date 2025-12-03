import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import _isNil from 'lodash/isNil';

import { getValueFromLocalStorage } from '../utils/common';
import Header from '../pages/signin/components/Header';

import { PublicWrapperContent } from './style';

type WrapperProps = {
  Content: React.ComponentType<any>; // Accept any component type
  showHeader?: boolean;
};

const PublicWrapper = ({ Content, showHeader = true }: WrapperProps) => {
  const navigate = useNavigate();
  const token = getValueFromLocalStorage('token');

  useEffect(() => {
    if (!_isNil(token) && token !== '') {
      navigate('/');
    }
  }, [token]);

  return (
    <>
      {showHeader && <Header />}
      <PublicWrapperContent>
        <Content />
      </PublicWrapperContent>
    </>
  );
};

export default PublicWrapper;
