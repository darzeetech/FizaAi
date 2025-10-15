// components/Layout.tsx
import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderWithSidedrawer from './Component/HeaderOutlet';
import SideDrawer from './Component/SIdedrawer';

const Layout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const navigate = useNavigate();
  //const location = useLocation();

  //const currentPage = location.pathname.includes('explore') ? 'explore' : 'collective';

  const handleNavigate = (page: 'collective' | 'explore') => {
    navigate(page === 'explore' ? '/explore' : '/collective');
  };

  const handleSignup = () => {
    window.location.href = '/';
  };

  const toggleDrawer = () => {
    if (drawerOpen) {
      setSidebarAnimating(true);
      setDrawerOpen(false);
    } else {
      setTimeout(() => {
        setDrawerOpen(true);
      }, 10);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <HeaderWithSidedrawer
        onNavigate={handleNavigate}
        onSignup={handleSignup}
        onToggleDrawer={toggleDrawer}
        drawerOpen={drawerOpen}
        onCloseDrawer={() => {
          setSidebarAnimating(true);
          setDrawerOpen(false);
        }}
      />

      {(drawerOpen || sidebarAnimating) && (
        <div
          className={`md:w-[300px] w-[280px] md:fixed md:left-0 md:top-0 absolute h-screen bg-[#F9F6F1] border-r shadow-md z-[100] transform transition-all duration-500 ease-in-out ${
            drawerOpen
              ? 'md:translate-x-0 translate-x-0 opacity-100'
              : 'md:-translate-x-full -translate-x-full opacity-0'
          }`}
          onTransitionEnd={() => {
            if (!drawerOpen) {
              setSidebarAnimating(false);
            }
          }}
        >
          <SideDrawer
            open={drawerOpen}
            onClose={() => {
              setSidebarAnimating(true);
              setDrawerOpen(false);
            }}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      <div
        onClick={() => {
          if (window.innerWidth < 768) {
            setSidebarAnimating(true);
            setDrawerOpen(false);
          }
        }}
        className={`flex-1 w-full transition-all duration-500 ease-in-out ${
          drawerOpen ? 'md:ml-[300px]' : 'md:ml-0'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
