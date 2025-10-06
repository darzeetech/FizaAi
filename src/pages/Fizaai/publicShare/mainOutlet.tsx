// CollectivePage.tsx
import React, { useState, useEffect } from 'react';
import HeaderWithSidedrawer from './Component/HeaderOutlet';
import SideDrawer from './Component/SIdedrawer'; // ensure correct path
import CollectivePublic from './CollectivePublic';
import { useNavigate } from 'react-router-dom';

const ExploreDesigners: React.FC = () => <div className="p-6">Explore Designers coming soon.</div>;

const CollectivePage: React.FC = () => {
  const [page, setPage] = useState<'collective' | 'explore'>('collective');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (page: 'collective' | 'explore') => {
    setPage(page);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('fizaaiuser');

    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

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
        currentPage={page}
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
          className={`md:w-[300px] w-[280px] md:fixed md:left-0 md:top-0 absolute md:min-w-[260px] h-screen bg-[#F9F6F1] border-r shadow-md z-[100] transform transition-all duration-500 ease-in-out ${
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
            currentPage={page}
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
        className={`w-full flex flex-col items-center justify-between flex-1 min-h-screen bg-white transition-all duration-500 ease-in-out ${
          drawerOpen ? 'md:ml-[300px]' : 'md:ml-0'
        }`}
      >
        {page === 'collective' && <CollectivePublic />}
        {page === 'explore' && <ExploreDesigners />}
      </div>
    </div>
  );
};

export default CollectivePage;
