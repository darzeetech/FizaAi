import React from 'react';
import SideDrawer from './SIdedrawer';
import sidebar from '../../../../assets/images/view_sidebar.png';

interface HeaderWithSidedrawerProps {
  currentPage: 'collective' | 'explore';
  onNavigate: (page: 'collective' | 'explore') => void;
  onSignup: () => void;
  onToggleDrawer: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void; // add this prop for closing drawer
}

const HeaderWithSidedrawer: React.FC<HeaderWithSidedrawerProps> = ({
  onNavigate,
  currentPage,
  onSignup,
  onToggleDrawer,
  drawerOpen,
  onCloseDrawer,
}) => {
  return (
    <>
      <header className="w-full flex justify-between items-center bg-white p-4 border-b border-gray-300 sticky top-0 z-20">
        <img
          src={sidebar}
          alt="Sidebar"
          className="h-6 md:h-10 cursor-pointer"
          onClick={onToggleDrawer}
        />
        <h1 className="text-xl font-semibold text-purple-700 select-none">Collective Gallery</h1>
        <button
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
          onClick={onSignup}
          aria-label="Sign Up"
        >
          Sign Up
        </button>
      </header>

      <SideDrawer
        open={drawerOpen}
        onClose={onCloseDrawer}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default HeaderWithSidedrawer;
