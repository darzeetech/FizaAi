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
import notfavorite from '../../assets/icons/favorite.png';
import favorite from '../../assets/icons/favoritselected.png';

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
  dressInfo?: { selectedOutfit?: string; gender?: string | null };
  userInfo?: {
    fullName?: string | null;
    profilePicture?: string | null;
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

  const getProfilePic = () => {
    const profilePic = item.userInfo?.profilePicture?.trim();
    const userGender = item.dressInfo?.gender?.toLowerCase() || '';

    if (profilePic) {
      return profilePic;
    }

    if (userGender === 'female') {
      return femalelogo;
    }

    if (userGender === 'male') {
      return malelogo;
    }

    // fallback if gender unknown
    return malelogo;
  };

  const [liked, setLiked] = useState(item.likeByCurrentUser);
  const [likeCount, setLikeCount] = useState(item.likeCount ?? 0);
  const [showInfo, setShowInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorited, setFavorited] = useState(item.addedToFav ?? false);
  const [favCount, setFavCount] = useState(item.favCount ?? 0);

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

  const handleFavoriteToggle = async () => {
    try {
      const token = localStorage.getItem('userToken') || '';
      let endpoint = '';

      if (favorited) {
        // Remove from fav
        endpoint = `fiza/collective/remove_from_fav?elementId=${item.id}`;
      } else {
        // Add to fav (assuming you have a similar endpoint, e.g. `add_to_fav`)
        endpoint = `fiza/collective/add_to_fav?elementId=${item.id}`;
      }
      const res = await api.putRequest(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Assuming response contains updated fav count
      const data = res.data;
      const updatedCount = Number(data.msg?.replace(/[^0-9]/g, '') ?? favCount);
      setFavCount(updatedCount);
      setFavorited(!favorited);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error toggling favorite', err);
    }
  };

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
                  src={getProfilePic()}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <div className="font-semibold text-white">{designerName}</div>
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
        <div
          className="w-full h-[70vh] md:h-[60vh] flex items-start  justify-center overflow-hidden rounded-[30px] md:rounded-[30px]  "
          {...(window.innerWidth < 768 ? handlers : {})}
        >
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
            className="object-fill h-full"
          />
          {/* Mobile Dots Above Image */}
          {totalImages > 1 && (
            <div className="flex justify-center gap-3 md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[100]">
              {item.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? 'bg-black' : 'bg-red-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 mt-4 text-base sm:text-lg md:text-xl font-semibold">
          <span>{outfitName}</span>
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
          <button
            type="button"
            aria-label={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
            onClick={handleFavoriteToggle}
            className="flex items-center gap-1 text-yellow-500 focus:outline-none"
          >
            {favorited ? (
              <img src={favorite} alt="Favorited" className="h-5 w-auto" />
            ) : (
              <img src={notfavorite} alt="Not Favorited" className="h-5 w-auto" />
            )}
            <span className="font-medium ">{favCount}</span>
          </button>
          {item.platForm == 'FIZA' && (
            <>
              <img src={coins} alt="Coin Icon" className="h-5 w-auto" />
              <span className="text-sm font-medium">{item.coinUsed}</span>
            </>
          )}
        </div>

        <div className="md:flex items-center gap-5 mt-3 hidden ">
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
      </motion.div>

      {/* Right side (only desktop) */}
      <motion.div
        className="hidden md:flex flex-1 flex-col justify-start mt-6 md:mt-0 md:pl-32"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-6 md:mt-4">
          {/* Designer */}
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
      <div className="md:hidden px-4 pb-3 bg-white rounded-b-[30px] shadow-md">
        <div className="flex items-center justify-between w-full px-2 text-sm">
          <span className="font-semibold text-base truncate">{outfitName}</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {item.platForm == 'FIZA' && (
                <>
                  <img src={coins} alt="Coin Icon" className="h-5 w-auto" />
                  <span className="text-sm font-medium">{item.coinUsed}</span>
                </>
              )}
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
            <button
              type="button"
              aria-label={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
              onClick={handleFavoriteToggle}
              className="flex items-center gap-1 text-yellow-500 focus:outline-none"
            >
              {favorited ? (
                <img src={favorite} alt="Favorited" className="h-5 w-auto" />
              ) : (
                <img src={notfavorite} alt="Not Favorited" className="h-5 w-auto" />
              )}
              <span className="font-medium ">{favCount}</span>
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
