import React, { useState, useEffect } from 'react';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import coins from '../../assets/images/coins.png';
import Ai_refresh from '../../assets/icons/Ai_Loader.gif';
import { api } from '../../utils/apiRequest';
import circle from '../../assets/icons/circle.png';
import like from '../../assets/icons/lked.png';
import notlike from '../../assets/icons/not-liked.png';

export interface CollectiveItem {
  id: number;
  data: string;
  version: number;
  parentId: number | null;
  createdAt: string;
  imageUrl: string;
  userId: number;
  children?: number | null;
  collective: boolean;
  likeCount: number | null;
  likedByCurrentUser: boolean;
  prof_pic: string;
}

interface CollectiveCardProps {
  item: CollectiveItem;
  onShowInfoChange?: (isShown: boolean) => void;
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

const CollectiveCard: React.FC<CollectiveCardProps> = ({ item, onShowInfoChange }) => {
  // eslint-disable-next-line no-console
  console.log('CollectiveCard item:', item);
  let parsed: any = {};
  try {
    parsed = item.data ? JSON.parse(item.data) : {};
  } catch {
    // eslint-disable-next-line no-console
    console.error('Error parsing item data JSON', item.data);
  }

  const outfitName = parsed?.selectedOutfit
    ?.replace(/_/g, ' ')
    ?.replace(/\b\w/g, (c: string) => c.toUpperCase());

  const [liked, setLiked] = useState(item.likedByCurrentUser);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    setLiked(item.likedByCurrentUser);
    setLikeCount(item.likeCount ?? 0);
  }, [item.likedByCurrentUser, item.likeCount]);

  // Inside CollectiveCard component
  const setShowInfoAndNotify = (val: boolean) => {
    setShowInfo(val);
    onShowInfoChange?.(val);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showInfo) {
      timer = setTimeout(() => setShowInfoAndNotify(false), 3000);
    }

    return () => clearTimeout(timer);
  }, [showInfo]);

  const handleLikeToggle = async () => {
    try {
      const token = localStorage.getItem('userToken') || '';
      const endpoint = liked
        ? `fiza/collective/dislike?id=${item.id}`
        : `fiza/collective/like?id=${item.id}`;

      const res = await api.putRequest(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
    <motion.div
      className={`relative flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg mx-auto w-full max-w-[95%] md:mt-2 ${
        showInfo ? ' bg-black bg-opacity-25' : ''
      } rounded-[30px] border-2 border-[#F3D7AC] p-0 sm:p-5 sm:mx-auto`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Circle Button only visible on phone */}
      <button
        onClick={() => setShowInfoAndNotify(true)}
        className="md:hidden absolute top-6 right-[30px] z-20"
      >
        <img src={circle} alt="Info" className="h-5 w-5" />
      </button>

      {/* Mobile Animated Overlay */}
      <AnimatePresence>
        {showInfo && (
          <>
            {/* Designed By */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-6 right-[20px] -translate-x-1/2 text-white w-3/4  bg-[linear-gradient(90deg,rgba(179,156,122,0.67)_0%,rgba(179,156,122,0.268)_100%)] rounded-xl px-4 py-2  text-sm font-medium shadow-md md:hidden"
            >
              DESIGNED BY
              <div className="flex items-center gap-1 mt-1">
                <img
                  src={item.prof_pic}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <div className="font-semibold text-white">
                  {(() => {
                    try {
                      const about = parsed.aboutYou || {};
                      const firstName = about.first_name || '';
                      const lastName = about.last_name || '';

                      return `${firstName} ${lastName}`.trim();
                    } catch {
                      return 'Unknown Designer';
                    }
                  })()}
                </div>
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className=" absolute top-[104px] right-[20px] -translate-x-1/2 text-white w-3/4  bg-[linear-gradient(90deg,rgba(179,156,122,0.67)_0%,rgba(179,156,122,0.268)_100%)] rounded-xl px-4 py-2 text-sm font-medium shadow-md md:hidden"
            >
              TIMELINE{' '}
              <div className="font-normal text-white">{formatTimeline(item.createdAt)}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Left side */}
      <motion.div
        className="flex flex-col items-center md:items-start rounded-[30px] p-[10px]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="w-full h-[60vh] md:h-[60vh] flex items-start  justify-center overflow-hidden rounded-[30px] md:rounded-[30px]  ">
          <img src={item.imageUrl} alt={outfitName} className=" object-fill h-full" />
        </div>

        <div className="hidden md:flex items-center gap-2 mt-4 text-base sm:text-lg md:text-xl font-semibold">
          <span>{outfitName}</span>
          <span className="bg-purple-100 text-purple-700 text-[10px] sm:text-xs font-bold rounded-full flex items-center gap-1 px-2 py-0.5">
            <img src={Ai_refresh} alt="AI Refresh" className="h-4 sm:h-5 md:h-6" />
            <span>AI</span>
          </span>
          <img src={coins} alt="Coin Icon" className="ml-1 h-4 sm:h-5 md:h-6" />
          <span className="text-xs text-gray-500 ml-1">{item.version}</span>
        </div>

        <motion.div className="md:flex items-center gap-5 mt-3 hidden " whileTap={{ scale: 0.9 }}>
          <button
            type="button"
            aria-label={liked ? 'Unlike' : 'Like'}
            onClick={handleLikeToggle}
            className="flex items-center gap-1 text-red-600 focus:outline-none"
          >
            {liked ? (
              <img src={like} alt="Like Icon" className="h-5 w-auto" />
            ) : (
              <img src={notlike} alt="Unlike Icon" className="h-5 w-auto" />
            )}
            <span className="font-bold hidden md:block">{likeCount}</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Right side (only desktop) */}
      <motion.div
        className="hidden md:flex flex-1 flex-col justify-start mt-6 md:mt-0 md:pl-32"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6">
          {/* Designer */}
          <div>
            <div className="font-semibold text-[10px] sm:text-[11px] text-gray-500 tracking-wide">
              DESIGNED BY
            </div>
            <div className="flex items-center gap-2 mt-1">
              <img
                src={item.prof_pic}
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />

              <span className="text-sm text-purple-700 font-medium cursor-pointer hover:underline">
                {(() => {
                  try {
                    const about = parsed.aboutYou || {};

                    const firstName = about.first_name || '';
                    const lastName = about.last_name || '';

                    return `${firstName} ${lastName}`.trim();
                  } catch {
                    return 'Unknown Designer';
                  }
                })()}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <div className="font-semibold text-[10px] sm:text-[11px] text-gray-500 tracking-wide">
              TIMELINE
            </div>
            <div className="text-xs sm:text-sm text-gray-700 mt-1 flex items-start gap-2">
              <span className="text-lg leading-none">•</span>
              <span>{formatTimeline(item.createdAt)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Bottom Bar */}

      {/* Mobile Bottom Bar */}
      <div className="md:hidden  px-4 pb-3 bg-white rounded-b-[30px] shadow-md">
        {/* Row 1: Outfit Name + Coins + Likes */}
        <div className="flex items-center justify-between w-full px-2 text-sm">
          {/* Outfit Name */}
          <span className="font-semibold text-base truncate">{outfitName}</span>

          <div className="flex items-center gap-3">
            {/* Coins */}
            <div className="flex items-center gap-2">
              <img src={coins} alt="Coin Icon" className="h-5 w-auto" />
              <span className="text-sm font-medium">{item.version}</span>
            </div>

            {/* Likes */}
            <button
              type="button"
              aria-label={liked ? 'Unlike' : 'Like'}
              onClick={handleLikeToggle}
              className="flex items-center gap-1 text-red-600 focus:outline-none"
            >
              {liked ? (
                <img src={like} alt="Like Icon" className="h-5 w-auto" />
              ) : (
                <img src={notlike} alt="Unlike Icon" className="h-5 w-auto" />
              )}
              <span className="font-medium">{likeCount}</span>
            </button>
          </div>
        </div>

        {/* Row 2: AI Badge */}
        <div className="flex items-center gap-1  px-2">
          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold rounded-full flex items-center gap-1 px-2 py-0.5">
            <img src={Ai_refresh} alt="AI Refresh" className="h-4" />
            AI
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectiveCard;
