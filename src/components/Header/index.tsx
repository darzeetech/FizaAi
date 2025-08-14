import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _isNil from 'lodash/isNil';
import { IoChevronBackOutline } from 'react-icons/io5';
import { getValueFromLocalStorage } from '../../utils/common';

import { RootState } from '../../store';
import { routePathOptions } from '../../utils/contant';
import { IconWrapper, Text, toasts } from '../../ui-component';
import { api } from '../../utils/apiRequest';

import { Container, HeaderInfo, Circle } from './style';
interface FormData {
  admin_tailor_name: string;
  admin_tailor_profile_pic_url?: string;
  boutique_type?: string;
  boutique_name?: string;
  // ... other properties can be added as needed
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const { commonDataReducer } = useSelector((state: RootState) => state);
  //const { boutiqueData } = onboardingReducer;
  // eslint-disable-next-line no-console
  //console.log('nitish', boutiqueData);
  const { enableHeaderBackButton } = commonDataReducer.headerData;

  //const { admin_tailor_profile_pic_url = '' } = boutiqueData || {};

  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState<FormData | null>(null);

  useEffect(() => {
    const getListData = async () => {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      if (!_isNil(boutique_id)) {
        setIsLoading(true);
        try {
          const response = await api.getRequest(`boutique/${boutique_id}`);
          const { status, data } = response;

          if (status) {
            setListData(!_isNil(data) ? data : null);
          }
        } catch (err) {
          if (err instanceof Error) {
            toasts('error', 'Failed to fetch boutique data', 'error-boutique-data');
          }
        }
        setIsLoading(false);
      } else {
        toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
      }
    };
    getListData();
  }, []);

  // eslint-disable-next-line no-console
  //console.log('Data being passed:', listData);

  const getCurrentRoute = () => {
    return routePathOptions.filter((route) => {
      const currentPath = pathname.split('/')[1];

      if (route.path.includes(currentPath)) {
        return true;
      }

      return false;
    });
  };

  const getHeaderTitle = useMemo(() => {
    const currentRoute = getCurrentRoute();

    if (currentRoute.length > 0) {
      const searchParams = new URLSearchParams(search.substring(1));
      const pathFormType = searchParams.get('formType') ?? '';

      return !_isNil(currentRoute[0].formType) && !_isNil(currentRoute[0].formType[pathFormType])
        ? currentRoute[0].formType[pathFormType]
        : currentRoute[0].label;
    }

    return '';
  }, [pathname, search]);

  const currentRoute = getCurrentRoute();
  const showBack = currentRoute.length > 0 ? currentRoute[0].showBackIcon : false;

  return (
    <Container>
      <div className="title-container">
        {showBack && (
          <IconWrapper
            onClick={() => {
              if (enableHeaderBackButton) {
                navigate(-1);
              }
            }}
          >
            <IoChevronBackOutline id="header-back-icon" />
          </IconWrapper>
        )}
        <Text size="xl" fontWeight={700}>
          {getHeaderTitle}
        </Text>
      </div>
      {!isLoading && (
        <HeaderInfo className=" cursor-pointer" onClick={() => navigate('/editprofile')}>
          <Circle>
            <img src={listData?.admin_tailor_profile_pic_url} alt="profile-pic" />
          </Circle>
          <Text fontWeight={600}>{listData?.admin_tailor_name}</Text>
        </HeaderInfo>
      )}
    </Container>
  );
};

export default Header;
