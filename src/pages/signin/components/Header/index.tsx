import { HeaderContainer, InfoContainer } from './style';
import darzeeLogo from '../../../../assets/images/darzeeLogo.svg';

const INFO_ITEMS = [
  {
    label: 'Home',
    url: 'https://www.darzeeapp.com/',
  },
  {
    label: 'About us',
    url: 'https://www.darzeeapp.com/about-us',
  },
  {
    label: 'Blog',
    url: 'https://www.darzeeapp.com/blog',
  },
  {
    label: 'Help Center',
    url: 'https://www.darzeeapp.com/help-center',
  },
];

const Header = () => {
  const handleItemClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <HeaderContainer>
      <img src={darzeeLogo} alt="Darzee Logo" />
      <InfoContainer>
        {INFO_ITEMS.map((item) => (
          <div className="item" key={item.label} onClick={() => handleItemClick(item.url)}>
            {item.label}
          </div>
        ))}
      </InfoContainer>
    </HeaderContainer>
  );
};

export default Header;
