import React, { useEffect, useRef, useState } from 'react';
import { FaRegHeart, FaHeart, FaRegThumbsDown } from 'react-icons/fa'; // React Icons
import { GiTwoCoins } from 'react-icons/gi'; // Coin icon example

export interface CollectiveItem {
  id: number;
  imageUrl: string;
  title: string; // fallback
  designerName: string;
  madeBy?: string;
  artisans?: string[];
  timeline?: string;
  status?: string;
  likeCount: number;
  profileInitial: string;
  data?: string;
  createdAt: string;
  // ✅ raw JSON string from API
}

interface CollectiveProps {
  data: CollectiveItem[];
  loading: boolean;
  onLoadMore?: () => void;
  pageInfo?: {
    currentPage: number;
    totalPages: number;
    lastPage: boolean;
    totalItems: number;
  };
}

const Collective: React.FC<CollectiveProps> = ({ data, loading, onLoadMore, pageInfo }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollDebounceRef = useRef<number | null>(null);

  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const token = localStorage.getItem('userToken') || '';

  // Like API
  const handleLike = async () => {
    try {
      const res = await fetch(`https://backend.stage.darzeeapp.com/fiza/collective/like?id=${6}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setLikes(Number(data.msg.replace(/[^0-9]/g, '')));
      setHasLiked(true);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error liking the item', e);
    }
  };

  // Dislike API
  const handleDislike = async () => {
    try {
      const res = await fetch(
        `https://backend.stage.darzeeapp.com/fiza/collective/dislike?id=${7}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setLikes(Number(data.msg.replace(/[^0-9]/g, '')));
      setHasLiked(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Error liking the item', e);
    }
  };

  useEffect(() => {
    const el = listRef.current;

    if (!el || !onLoadMore) {
      return;
    }

    const handleScroll = () => {
      if (loading || !pageInfo || pageInfo.lastPage) {
        return;
      }

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 150) {
        onLoadMore();
      }
    };

    const debounced = () => {
      if (scrollDebounceRef.current) {
        window.clearTimeout(scrollDebounceRef.current);
      }
      scrollDebounceRef.current = window.setTimeout(handleScroll, 120) as unknown as number;
    };

    el.addEventListener('scroll', debounced);

    return () => {
      el.removeEventListener('scroll', debounced);

      if (scrollDebounceRef.current) {
        window.clearTimeout(scrollDebounceRef.current);
      }
    };
  }, [onLoadMore, loading, pageInfo?.lastPage]);

  const formatTimeline = (createdAt: string): string => {
    const createdDate = new Date(createdAt);
    const now = new Date();

    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `Prompt Created - ${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      const diffMonths = Math.floor(diffDays / 30);

      return `Prompt Created - ${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div
      ref={listRef}
      className="w-full flex flex-col gap-10 max-h-[calc(100vh-72px)] overflow-y-auto px-6 py-6"
    >
      {loading && data.length === 0 && (
        <div className="w-full flex justify-center py-12">Loading...</div>
      )}

      {!loading && data.length === 0 && (
        <div className="w-full text-center text-gray-500 py-12">No collective items yet.</div>
      )}

      {data.map((item) => {
        // ✅ Parse selectedOutfit from API data
        let parsed: any = {};
        try {
          parsed = item.data ? JSON.parse(item.data) : {};
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Invalid JSON in item.data', e);
        }
        const outfitName =
          parsed?.selectedOutfit
            ?.replace(/_/g, ' ')
            ?.replace(/\b\w/g, (c: string) => c.toUpperCase()) || item.title;

        return (
          <div
            key={item.id}
            className="flex flex-col md:flex-row bg-white shadow-md transition-shadow hover:shadow-lg mx-auto"
            style={{
              width: '1113px',
              height: '897px',
              borderRadius: '30px',
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: '#F3D7AC',
              padding: '32px',
            }}
          >
            <div className=" flex flex-col">
              {/* Left Image External Wrapper */}
              <div
                style={{
                  width: '424px',
                  height: '475px',
                  borderRadius: '30px',
                  borderWidth: '5px',
                  borderStyle: 'solid',
                  borderColor: '#FEF6EA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Actual Image */}
                <img
                  src={item.imageUrl}
                  alt={outfitName}
                  style={{
                    width: '397px',
                    height: '420px',
                    objectFit: 'contain',
                  }}
                />
              </div>
              <div className="flex items-center gap-2 mt-6 text-xl font-semibold">
                <span>{outfitName}</span>
                <span className="bg-purple-100 text-purple-700 text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                  AI
                </span>
                <GiTwoCoins className="text-yellow-700 text-lg ml-1" />
                <span className="text-xs text-gray-500 ml-1">2</span>
              </div>
              {/* Likes + Dislikes (React Icons) */}
              <div className="flex items-center gap-5 mt-4">
                <button
                  aria-label="like"
                  onClick={handleLike}
                  className="flex items-center gap-1 text-red-600"
                >
                  {hasLiked ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                  <span className="font-medium">{likes}</span>
                </button>
                <button
                  aria-label="dislike"
                  onClick={handleDislike}
                  className="flex items-center gap-1 text-gray-500"
                >
                  <FaRegThumbsDown className="text-xl" />
                </button>
              </div>
            </div>

            {/* Right: Info */}
            {/* Right: Info */}
            <div className="flex-1 flex flex-col justify-start pl-32">
              <div className="flex flex-col gap-6">
                {/* Designer */}
                <div>
                  <div className="font-semibold text-[11px] text-gray-500 tracking-wide">
                    DESIGNED BY
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {/* Small Avatar Circle */}
                    <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-gray-600">
                      {item.profileInitial}
                    </span>
                    <span className="text-sm text-purple-700 font-medium cursor-pointer hover:underline">
                      {(() => {
                        try {
                          const parsedData = item.data ? JSON.parse(item.data) : {};
                          const about = parsedData.aboutYou || {};
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

                {/* Timeline */}
                <div>
                  <div className="font-semibold text-[11px] text-gray-500 tracking-wide">
                    TIMELINE
                  </div>
                  <div className="text-sm text-gray-700 mt-1 flex items-start gap-2">
                    <span className="text-lg leading-none">•</span>
                    <span>{formatTimeline(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {loading && data.length > 0 && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          Loading more…
        </div>
      )}
    </div>
  );
};

export default Collective;
