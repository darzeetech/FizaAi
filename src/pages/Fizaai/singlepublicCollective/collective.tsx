import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useParams } from 'react-router-dom';
import coins from '../../../assets/images/coins.png';
import Ai_refresh from '../../../assets/icons/Ai_Loader.gif';
import { api } from '../../../utils/apiRequest';
import circle from '../../../assets/icons/circle.png';
import like from '../../../assets/icons/lked.png';
import notlike from '../../../assets/icons/not-liked.png';
import femalelogo from '../../../assets/icons/ai-stylist-female.png';
import malelogo from '../../../assets/icons/ai-stylist-male.png';
import life from '../../../assets/icons/life.png';
import notfavorite from '../../../assets/icons/favorite.png';
import favorite from '../../../assets/icons/favoritselected.png';
import aiimage from '../../../assets/images/ai.png';
import lookbook from '../../../assets/images/Style.png';

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

// Timeline formatter (same as before)
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

const maxLength = 17;
const truncateText = (text: string, maxLength: number): string =>
  text.length > maxLength ? text.substring(0, maxLength) + '...' : text;

// Get designer profile image

const getProfilePic = (item: any) => {
  const profilePic = item.userInfo?.profilePicture?.trim();
  const userGender = item.dressInfo?.gender?.toLowerCase() || '';

  if (profilePic) {
    return profilePic;
  }

  if (userGender === 'female') {
    return femalelogo;
  }

  return malelogo;
};

const SingleCollectiveCardPage: React.FC = () => {
  const { hashedId } = useParams<{ hashedId: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [favorited, setFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<'studio' | 'lookbook'>('studio');

  useEffect(() => {
    if (!hashedId) {
      return;
    }
    setLoading(true);
    setFetchError('');
    api
      .getRequest(`collective_link_share/decode?hashedId=${hashedId}`)
      .then((data) => {
        // eslint-disable-next-line no-console
        console.log('✅ API Response:', data?.data);
        setItem(data?.data);
        setLiked(data?.data.likeByCurrentUser);
        setLikeCount(data?.data.likeCount ?? 0);
        setFavorited(data?.data.addedToFav ?? false);
        setFavCount(data?.data.favCount ?? 0);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Could not fetch card details. Please try again later.');
        setLoading(false);
      });
  }, [hashedId]);

  // Info overlay timer (mobile)
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showInfo) {
      timer = setTimeout(() => setShowInfo(false), 3000);
    }

    return () => clearTimeout(timer);
  }, [showInfo]);

  // Favorite handler (same as card)

  const handleFavoriteToggle = async () => {
    const token = 1;

    if (token == 1) {
      navigate('/');

      return;
    }

    try {
      const userToken = localStorage.getItem('userToken') || '';
      const endpoint = favorited
        ? `fiza/collective/remove_from_fav?elementId=${item.id}`
        : `fiza/collective/add_to_fav?elementId=${item.id}`;

      await api.putRequest(endpoint, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setFavCount((prev) => (favorited ? Math.max(prev - 1, 0) : prev + 1));
      setFavorited(!favorited);
    } catch (err) {
      /* handle error */
    }
  };

  // Like handler (same as card)
  const handleLikeToggle = async () => {
    const token = 1;

    if (token == 1) {
      navigate('/');

      return;
    }

    try {
      const userToken = localStorage.getItem('userToken') || '';
      const endpoint = liked
        ? `fiza/collective/unlike_feed?elementId=${item.id}`
        : `fiza/collective/like_feed?elementId=${item.id}`;

      await api.putRequest(endpoint, {
        headers: { Authorization: `Bearer ${userToken}` },
      });

      setLikeCount((prev) => (liked ? Math.max(prev - 1, 0) : prev + 1));
      setLiked(!liked);
    } catch (e) {
      /* handle error */
    }
  };

  // Image swipe handlers
  const totalImages = item?.images?.length || 0;
  const handlePrevImage = () =>
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  const handleNextImage = () =>
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  const handlers = useSwipeable({
    onSwipedLeft: handleNextImage,
    onSwipedRight: handlePrevImage,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (loading) {
    return <div className="text-xl font-semibold text-gray-500 p-10">Loading...</div>;
  }

  if (fetchError) {
    return <div className="text-xl text-red-500">{fetchError}</div>;
  }

  if (!item) {
    return null;
  }

  const outfitName = item.dressInfo?.selectedOutfit
    ? item.dressInfo.selectedOutfit
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase())
    : 'Outfit';

  const designerName = item.userInfo?.fullName?.trim()
    ? item.userInfo.fullName.trim()
    : 'Unknown Designer';

  const handleSingup = () => {
    navigate('/');
  };

  return (
    <div>
      <header className="w-full  md:px-6 px-4 py-2 border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between w-full mx-auto">
          {/* Left Section */}
          <div className="flex items-center justify-between gap-4 w-1/2">
            {/* Only show these if sidebar is NOT visible */}
            {
              <div className="flex items-center md:justify-between gap-2 md:gap-4  w-[15%] md:w-[40%]">
                <img
                  src="../img"
                  alt="Sidebar Toggle"
                  className="h-6 md:h-10 aspect-auto cursor-pointer hidden"
                />
                <div className="flex  w-[85%] md:w-[60%] md:pl-8 pl-4 ">
                  {/* Studio Tab */}
                  <div
                    onClick={() => {
                      setSelectedTab('studio');
                    }}
                    className={`flex  cursor-pointer pb-2 ${
                      selectedTab === 'studio' ? 'border-b-2 border-[#4F2945]' : ''
                    }`}
                  >
                    <img src={aiimage} alt="Studio Icon" className="h-6 md:h-7 aspect-auto" />
                    <h1
                      className={`text-[1rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                        selectedTab === 'studio' ? 'block' : 'hidden md:block'
                      }`}
                    >
                      Lookbook
                    </h1>
                  </div>

                  {/* Lookbook Tab */}
                  <div
                    onClick={() => setSelectedTab('lookbook')}
                    className={`fle items-center md:gap-2 gap-1 cursor-pointer pb-2 hidden ${
                      selectedTab === 'lookbook' ? 'border-b-2 border-[#4F2945]' : ''
                    }`}
                  >
                    <img src={lookbook} alt="Lookbook Icon" className="h-6 md:h-10 aspect-auto" />
                    <h1
                      className={`text-[.9rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                        selectedTab === 'lookbook' ? 'block' : 'hidden md:block'
                      }`}
                    >
                      Lookbook
                    </h1>
                  </div>
                </div>
              </div>
            }

            <div className="flex  w-[85%] md:w-[60%] ">
              {/* Studio Tab */}
              {/* <div
                        onClick={() => {
                          setSelectedTab('studio');
                        }}
                        className={`flex  cursor-pointer pb-2 ${
                          selectedTab === 'studio' ? 'border-b-2 border-[#4F2945]' : ''
                        }`}
                      >
                        <img src={aiimage} alt="Studio Icon" className="h-6 md:h-7 aspect-auto" />
                        <h1
                          className={`text-[1rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                            selectedTab === 'studio' ? 'block' : 'hidden md:block'
                          }`}
                        >
                          Studio
                        </h1>
                      </div> */}

              {/* Lookbook Tab */}
              {/* <div
                        onClick={() => setSelectedTab('lookbook')}
                        className={`fle items-center md:gap-2 gap-1 cursor-pointer pb-2 hidden ${
                          selectedTab === 'lookbook' ? 'border-b-2 border-[#4F2945]' : ''
                        }`}
                      >
                        <img src={lookbook} alt="Lookbook Icon" className="h-6 md:h-10 aspect-auto" />
                        <h1
                          className={`text-[.9rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                            selectedTab === 'lookbook' ? 'block' : 'hidden md:block'
                          }`}
                        >
                          Lookbook
                        </h1>
                      </div> */}
            </div>
          </div>

          {/* Right Section headar */}
          <div className="flex items-center justify-end gap-2 md:gap-4 w-1/2">
            <div className="flex items-center gap-2 md:gap-3 py-1.5 rounded-full cursor-pointer transition-all duration-300">
              <button
                onClick={() => handleSingup()}
                className="flex items-center bg-[#79539F]  text-white px-3 py-1 rounded-md text-[.8rem] md:text-[1rem] font-medium transition"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
      <div
        className={`relative flex flex-col md:flex-row bg-white shadow-md hover:shadow-lg mx-auto w-full max-w-[95%] md:mt-2
        ${showInfo ? ' bg-black bg-opacity-25' : ''}
        rounded-[30px] border-2 border-[#F3D7AC] p-0 sm:p-5 sm:mx-auto`}
      >
        {/* Mobile Info Overlay Button */}
        <button
          onClick={() => setShowInfo(true)}
          className="md:hidden absolute top-6 right-[30px] z-20"
        >
          <img src={circle} alt="Info" className="h-5 w-5" />
        </button>

        {/* Mobile Animated Overlay */}
        <AnimatePresence>
          {showInfo && (
            <>
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
                    src={getProfilePic(item)}
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
                className=" absolute top-[104px] right-[20px] -translate-x-1/2 text-white w-3/4  bg-[linear-gradient(90deg,rgba(179,156,122,0.67)_0%,rgba(179,156,122,0.268)_100%)] rounded-xl px-4 py-2 text-sm font-medium shadow-md md:hidden"
              >
                TIMELINE
                <div className="font-normal text-white">{formatTimeline(item.createdAt)}</div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Left side Main Image(s) */}
        <motion.div
          className="flex flex-col items-center md:items-start rounded-[30px] p-[10px]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div
            className="w-full h-[70vh] md:h-[60vh] flex items-start  justify-center overflow-hidden rounded-[30px] md:rounded-[30px]"
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
            {Array.isArray(item.images) && item.images.length > 0 ? (
              <img
                src={item.images[currentImageIndex] || item.images[0]}
                alt={`${outfitName} - Image ${currentImageIndex + 1}`}
                className="object-fill h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-[30px] text-gray-400 text-xl">
                No image available
              </div>
            )}

            {/* Mobile Image Dots */}
            {totalImages > 1 && (
              <div className="flex justify-center gap-3 md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-[30]">
                {item.images.map((_: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full
                    ${index === currentImageIndex ? 'bg-gray-500' : 'bg-gray-400'}`}
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
              className="flex items-center gap-1 text-black focus:outline-none"
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
              className="flex items-center gap-1 text-black focus:outline-none"
            >
              {favorited ? (
                <img src={favorite} alt="Favorited" className="h-5 w-auto" />
              ) : (
                <img src={notfavorite} alt="Not Favorited" className="h-5 w-auto" />
              )}
              <span className="font-medium">{favCount}</span>
            </button>
            {item.platForm === 'FIZA' && (
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

        {/* Right side (desktop) */}
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
                  src={getProfilePic(item)}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                />
                <span className="text-sm text-purple-700 font-medium cursor-pointer hover:underline">
                  {truncateText(designerName, maxLength)}
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
        <div className="md:hidden px-4 pb-3 bg-white rounded-b-[30px] shadow-md">
          <div className="flex items-center justify-between w-full px-2 text-sm">
            <span className="font-semibold text-base truncate">
              {truncateText(outfitName, maxLength)}
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {item.platForm === 'FIZA' && (
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
                className="flex items-center gap-1 text-black focus:outline-none"
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
                className="flex items-center gap-1 text-black focus:outline-none"
              >
                {favorited ? (
                  <img src={favorite} alt="Favorited" className="h-5 w-auto" />
                ) : (
                  <img src={notfavorite} alt="Not Favorited" className="h-5 w-auto" />
                )}
                <span className="font-medium">{favCount}</span>
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
      </div>
    </div>
  );
};

export default SingleCollectiveCardPage;
