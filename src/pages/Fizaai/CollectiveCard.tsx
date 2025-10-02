import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import coins from '../../assets/images/coins.png';
import Ai_refresh from '../../assets/icons/Ai_Loader.gif';
import { api } from '../../utils/apiRequest';
import circle from '../../assets/icons/circle.png';
import like from '../../assets/icons/lked.png';
import notlike from '../../assets/icons/not-liked.png';
import femalelogo from '../../assets/icons/ai-stylist-female.png';
import malelogo from '../../assets/icons/ai-stylist-male.png';
import life from '../../assets/icons/life.png';

export interface CollectiveItem {
  id: number;
  data: string;
  version: number;
  parentId: number | null;
  createdAt: string;
  images: string[];
  userId: number;
  children?: number | null;
  collective: boolean;
  likeCount: number | null;
  likeByCurrentUser: boolean;
  prof_pic: string;
  platForm?: string;
  coinUsed?: number;
  addedToFav?: boolean;
  favCount?: number;
  originId?: number;
  dressInfo?: { selectedOutfit?: string };
  userInfo?: {
    fullName?: string | null;
    profilePicture?: string | null;
    gender?: string | null;
  };
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
    return 'Prompt Created - just now';
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
  const outfitName = item.dressInfo?.selectedOutfit
    ? item.dressInfo.selectedOutfit.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Outfit';

  const designerName = item.userInfo?.fullName?.trim()
    ? item.userInfo.fullName.trim()
    : 'Unknown Designer';

  const gender = 'male';

  const getProfilePic = () => {
    if (item.userInfo?.gender && item.prof_pic.trim() !== '') {
      return item.prof_pic;
    }

    if (gender.toLowerCase() === 'female') {
      return femalelogo;
    }

    return malelogo;
  };

  const [liked, setLiked] = useState(item.likeByCurrentUser);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [showInfo, setShowInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const totalImages = item.images.length;

  useEffect(() => {
    setLiked(item.likeByCurrentUser);
    setLikeCount(item.likeCount ?? 0);
  }, [item.likeByCurrentUser, item.likeCount]);

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
        ? `fiza/collective/unlike_feed?elementId=${item.id}`
        : `fiza/collective/like_feed?elementId=${item.id}`;

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

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <motion.div
      className={`relative flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg mx-auto w-full max-w-[95%] md:mt-2 ${
        showInfo ? ' bg-black bg-opacity-25' : ''
      } rounded-[30px] border-2 border-[#F3D7AC] p-0 sm:p-5 sm:mx-auto`}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Image Section */}
      <motion.div
        className="relative w-full h-[70vh] md:h-[60vh] flex items-center justify-center overflow-hidden rounded-[30px] p-[10px]"
        {...(window.innerWidth < 768 ? handlers : {})}
      >
        {/* Circle Info Button (Mobile) */}
        <button
          onClick={() => setShowInfoAndNotify(true)}
          className="absolute top-4 right-4 z-20 md:hidden"
        >
          <img src={circle} alt="Info" className="h-8 w-8" />
        </button>

        {/* Slider Controls (Desktop) */}
        {totalImages > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous Image"
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
            >
              &#8249;
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next Image"
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 z-10"
            >
              &#8250;
            </button>
          </>
        )}

        <img
          src={item.images[currentImageIndex]}
          alt={`${outfitName} - Image ${currentImageIndex + 1}`}
          className="object-contain h-full w-full rounded-[30px]"
        />
        {/* Mobile Dots Above Image */}
        {totalImages > 1 && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-2 z-30 md:hidden">
            {item.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </motion.div>

      {/* Mobile Animated Overlay */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-6 right-[20px] -translate-x-1/2 text-white w-3/4 bg-[linear-gradient(90deg,rgba(179,156,122,0.67)_0%,rgba(179,156,122,0.268)_100%)] rounded-xl px-4 py-2 text-sm font-medium shadow-md md:hidden"
            >
              DESIGNED BY
              <div className="flex items-center gap-1 mt-1">
                <img
                  src={getProfilePic()}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <div className="font-semibold text-white">{designerName}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute top-[104px] right-[20px] -translate-x-1/2 text-white w-3/4 bg-[linear-gradient(90deg,rgba(179,156,122,0.67)_0%,rgba(179,156,122,0.268)_100%)] rounded-xl px-4 py-2 text-sm font-medium shadow-md md:hidden"
            >
              TIMELINE
              <div className="font-normal text-white">{formatTimeline(item.createdAt)}</div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Right side (Desktop Info) */}
      <motion.div
        className="hidden md:flex flex-1 flex-col justify-start mt-6 md:mt-0 md:pl-32"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6 md:mt-4">
          <div>
            <div className="font-semibold text-[10px] sm:text-[11px] text-gray-500 tracking-wide">
              DESIGNED BY
            </div>
            <div className="flex items-center gap-2 mt-1">
              <img
                src={getProfilePic()}
                alt="Profile"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
              />
              <span className="text-sm text-purple-700 font-medium cursor-pointer hover:underline">
                {designerName}
              </span>
            </div>
          </div>

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
      <div className="md:hidden px-4 pb-3 bg-white rounded-b-[30px] shadow-md">
        <div className="flex items-center justify-between w-full px-2 text-sm">
          <span className="font-semibold text-base truncate">{outfitName}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={coins} alt="Coin Icon" className="h-5 w-auto" />
              <span className="text-sm font-medium">{item.coinUsed}</span>
            </div>
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

        <div className="flex items-center gap-1 px-2">
          <span
            className={`${
              item.platForm === 'DARZEE'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
            } text-[10px] font-bold rounded-full flex items-center gap-1 px-2 py-0.5`}
          >
            {item.platForm === 'DARZEE' ? (
              <>
                <img src={life} alt="brought to life" className="h-4" />
                Brought to Life
              </>
            ) : (
              <>
                <img src={Ai_refresh} alt="AI Refresh" className="h-4" />
                AI
              </>
            )}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CollectiveCard;
