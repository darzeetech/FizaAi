import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Favicon from 'react-favicon';

const FaviconController: React.FC = () => {
  const location = useLocation();
  const [faviconUrl, setFaviconUrl] = useState(`${process.env.PUBLIC_URL}/favicon.ico`);

  useEffect(() => {
    if (location.pathname === '/aifiza' || location.pathname === '/aifiza/') {
      setFaviconUrl(`${process.env.PUBLIC_URL}/faviconone.ico`);
      document.title = 'AI Fiza';
      // your alternate favicon
    } else {
      setFaviconUrl(`${process.env.PUBLIC_URL}/faviconone.ico`);
      document.title = 'AI Fiza'; // default favicon
    }
  }, [location.pathname]);

  return <Favicon url={faviconUrl} />;
};

const RootLayout: React.FC = () => (
  <>
    <FaviconController />
    <Outlet /> {/* renders the matched child route */}
  </>
);

export default RootLayout;
