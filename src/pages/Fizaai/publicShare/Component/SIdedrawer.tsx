import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import sidebar from '../../../../assets/images/view_sidebar.png';
import explore from '../../../../assets/images/Frame 1000010742.png';
import collective from '../../../../assets/images/collective.png';

interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: 'collective' | 'explore') => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ open, onClose, onNavigate }) => {
  const location = useLocation();

  // Determine current page from URL
  const currentPage: 'collective' | 'explore' = location.pathname.includes('explore')
    ? 'explore'
    : 'collective';

  // Use state to track selected tab, initialized from currentPage
  const [selectlookbook, setSelectlookbook] = useState<
    'Explore Designers' | 'Outfits' | 'Collective'
  >(currentPage === 'explore' ? 'Explore Designers' : 'Collective');

  // Sync selectlookbook state whenever URL changes
  useEffect(() => {
    setSelectlookbook(currentPage === 'explore' ? 'Explore Designers' : 'Collective');
  }, [currentPage]);

  const handleLookbookTabChange = (tab: typeof selectlookbook) => {
    setSelectlookbook(tab);

    if (tab === 'Collective') {
      onNavigate('collective');
    } else if (tab === 'Explore Designers') {
      onNavigate('explore');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className="w-[300px] min-w-[260px] h-[100dvh] bg-[#F9F6F1] border-r shadow-md fixed left-0 top-0 z-40 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#F9F6F1] px-4 pt-4 pb-2 flex justify-between items-center">
        <img src={sidebar} alt="Sidebar" className="h-6 md:h-10 cursor-pointer" onClick={onClose} />
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-full justify-between w-full">
        <div className="flex flex-col">
          <div
            onClick={() => handleLookbookTabChange('Explore Designers')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectlookbook === 'Explore Designers' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={explore} alt="Explore Designers" className="w-[4rem] rounded-xl h-8 ml-2" />
            <span className="ml-3 text-[.9rem] font-semibold">Explore Designers</span>
          </div>

          {/* Uncomment if you want the 'Outfits' tab back */}
          {/* <div
            onClick={() => handleLookbookTabChange('Outfits')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectlookbook === 'Outfits' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={clothes} alt="Outfits" className="w-[1.2rem] rounded-xl ml-6" />
            <span className="ml-3 text-[.9rem] font-semibold">Outfits</span>
          </div> */}

          <div
            onClick={() => handleLookbookTabChange('Collective')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectlookbook === 'Collective' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={collective} alt="Collective" className="w-[1.2rem] rounded-xl ml-6" />
            <span className="ml-3 text-[.9rem] font-semibold">Collective</span>
          </div>
        </div>

        {/* Footer */}
      </div>
    </div>
  );
};

export default SideDrawer;
