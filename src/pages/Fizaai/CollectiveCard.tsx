import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import coins from '../../assets/images/coins.png'; // Coin icon example
import Ai_refresh from '../../assets/icons/Ai_Loader.gif';
import { api } from '../../utils/apiRequest';

export interface CollectiveItem {
  id: number;
  imageUrl: string;
  title: string;
  designerName: string;
  likeCount: number;
  profileInitial: string;
  data: string;
  createdAt: string;
  likedByCurrentUser: boolean;
  version: number;
} // Or wherever CollectiveItem interface is

interface CollectiveCardProps {
  item: CollectiveItem;
}

const formatTimeline = (createdAt: string): string => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) {
    return `Prompt Created - just now`;
  }

  if (diffDays < 1) {
    return `Prompt Created - ${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  }

  if (diffDays < 30) {
    return `Prompt Created - ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
  const diffMonths = Math.floor(diffDays / 30);

  return `Prompt Created - ${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
};

const CollectiveCard: React.FC<CollectiveCardProps> = ({ item }) => {
  let parsed: any = {};
  try {
    parsed = item.data ? JSON.parse(item.data) : {};
  } catch {
    // eslint-disable-next-line no-console
    console.error('Error parsing item data JSON', item.data);
  }

  const outfitName =
    parsed?.selectedOutfit?.replace(/_/g, ' ')?.replace(/\b\w/g, (c: string) => c.toUpperCase()) ||
    item.title;
  const [liked, setLiked] = useState(item.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('userToken') || '';
      const endpoint = liked
        ? `fiza/collective/dislike?id=${item.id}`
        : `fiza/collective/like?id=${item.id}`;

      const res = await api.putRequest(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Assuming response structure similar to fetch example
      const data = res.data;
      const updatedCount = Number(data.msg.replace(/[^0-9]/g, ''));
      setLikeCount(updatedCount);
      setLiked(!liked);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error toggling like', e);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row bg-white shadow-md transition-shadow hover:shadow-lg mx-auto"
      style={{
        width: '903px',
        height: '797px',
        borderRadius: '30px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#F3D7AC',
        padding: '32px',
      }}
    >
      {/* Left side */}
      <div className="flex flex-col">
        <div
          style={{
            width: '324px',
            height: '375px',
            borderRadius: '30px',
            borderWidth: '5px',
            borderStyle: 'solid',
            borderColor: '#FEF6EA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={item.imageUrl}
            alt={outfitName}
            style={{ width: '297px', height: '320px', objectFit: 'contain' }}
          />
        </div>
        <div className="flex items-center gap-2 mt-6 text-xl font-semibold">
          <span>{outfitName}</span>
          <span className="bg-purple-100 text-purple-700 text-xs font-bold rounded-full flex gap-0.5 w-12">
            <img src={Ai_refresh} alt="AI Refresh" className="h-5 md:h-6" />
            <span className="pt-1">AI</span>
          </span>
          <img src={coins} alt="Coin Icon" className="ml-1 h-5 md:h-6" />
          <span className="text-xs text-gray-500 ml-1">{item.version}</span>
        </div>
        <div className="flex items-center gap-5 mt-4">
          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={handleLikeToggle}
            className="flex items-center gap-1 text-red-600 focus:outline-none"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
            <span className="font-bold">{likeCount}</span>
          </button>
        </div>
      </div>
      {/* Right side */}
      <div className="flex-1 flex flex-col justify-start pl-32">
        <div className="flex flex-col gap-6">
          <div>
            <div className="font-semibold text-[11px] text-gray-500 tracking-wide">DESIGNED BY</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600">
                {item.profileInitial}
              </span>
              <span className="text-sm text-purple-700 font-medium cursor-pointer hover:underline">
                {(() => {
                  try {
                    const about = parsed.aboutYou || {};

                    const firstName = about.first_name || '';
                    const lastName = about.last_name || '';

                    return `${firstName} ${lastName}`.trim() || item.designerName;
                  } catch {
                    return item.designerName;
                  }
                })()}
              </span>
            </div>
          </div>
          <div>
            <div className="font-semibold text-[11px] text-gray-500 tracking-wide">TIMELINE</div>
            <div className="text-sm text-gray-700 mt-1 flex items-start gap-2">
              <span className="text-lg leading-none">•</span>
              <span>{formatTimeline(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectiveCard;
