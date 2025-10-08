import React, { useEffect, useState } from 'react';
import Collective from './Collective';

interface FavouriteItem {
  id: number;
  coinUsed: number;
  createdAt: string;
  likeCount: number;
  favCount: number;
  platForm: string;
  originId: number;
  images: string[];
  likeByCurrentUser: boolean;
  addedToFav: boolean;
  userInfo: {
    fullName: string;
    profilePicture: string | null;
  };
  dressInfo: {
    color: string;
    gender: string;
    selectedOutfit: string;
  };
}

interface CollectiveProps {
  data: FavouriteItem[];
  loading: boolean;
  onLoadMore?: () => void;
  pageInfo?: {
    currentPage: number;
    totalPages: number;
    lastPage: boolean;
    totalItems: number;
  };
}

const Favourites: React.FC<CollectiveProps> = ({ data, loading, onLoadMore, pageInfo }) => {
  const [activeTab, setActiveTab] = useState<'designs' | 'collective'>('collective');

  useEffect(() => {
    setActiveTab('collective');
  }, []);

  return (
    <div
      className=" relative max-h-[calc(100vh-72px)] overflow-y-auto 
    w-full"
    >
      <div className="flex space-x-3  px-4 my-4">
        <button
          className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-colors ${
            activeTab === 'designs'
              ? 'bg-[#4F2945] text-white border-[#4F2945]'
              : 'bg-white text-[#4F2945] border-[#4F2945]'
          }`}
          onClick={() => setActiveTab('designs')}
        >
          Designer
        </button>

        <button
          className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-colors ${
            activeTab === 'collective'
              ? 'bg-[#4F2945] text-white border-[#4F2945]'
              : 'bg-white text-[#4F2945] border-[#4F2945]'
          }`}
          onClick={() => setActiveTab('collective')}
        >
          Outfits
        </button>
      </div>

      <div className="">
        {activeTab === 'collective' && (
          <Collective data={data} loading={loading} onLoadMore={onLoadMore} pageInfo={pageInfo} />
        )}
        {/* {activeTab === "designs" && <Designs />} */}
      </div>
    </div>
  );
};

export default Favourites;
