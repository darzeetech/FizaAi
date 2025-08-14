import _isEmpty from 'lodash/isEmpty';
import { Text } from '../../ui-component';

import darzeeLogoWhite from '../../assets/images/darzeeLogoWhite.svg';
import { LogoutIcon } from '../../assets/icons';

import { logoutRequest } from '../../utils/api';

import { SIDEBAR_ITEMS } from './constant';
import {
  Container,
  LogoContainer,
  IconContainer,
  ListContainer,
  ListItem,
  LogoutContainer,
} from './style';
import { useLocation, useNavigate } from 'react-router';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentActiveListItem = (paths: string[]) => {
    for (const currentPath of paths) {
      if (_isEmpty(currentPath)) {
        return false;
      } else if (location.pathname.includes(currentPath)) {
        return true;
      }
    }

    return false;
  };

  const handleLogout = () => {
    logoutRequest();
    navigate('/login');
  };

  return (
    <Container>
      <LogoContainer>
        <img
          onClick={() => navigate('/dashboard')}
          src={darzeeLogoWhite}
          alt="Darzee Logo"
          className="img-container"
        />
      </LogoContainer>

      <ListContainer>
        {SIDEBAR_ITEMS.filter((item) => item.visible).map((item) => (
          <ListItem
            key={item.value}
            isActive={getCurrentActiveListItem(item.activePathList ?? [item.path])}
            onClick={() => {
              if (!_isEmpty(item.link)) {
                window.open(item.link, '_blank');
              } else {
                navigate(item.path);
              }
            }}
          >
            <IconContainer>
              <item.icon color={'var(--color-white)'} size={24} />
            </IconContainer>
            <Text color="white">{item.label}</Text>
          </ListItem>
        ))}
      </ListContainer>

      <LogoutContainer onClick={handleLogout}>
        <IconContainer>
          <LogoutIcon />
        </IconContainer>
        <Text color="white">Logout</Text>
      </LogoutContainer>
    </Container>
  );
};

export default Sidebar;
