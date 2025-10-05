import React, { useEffect, useRef, useState } from 'react';
import CollectiveShareCard from './collectiveShareCard'; // Adjust the path
import { api } from '../../../utils/apiRequest';

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

  // Extended/Optional fields
  platForm?: string;
  coinUsed?: number;
  addedToFav?: boolean;
  favCount?: number;
  originId?: number;
  dressInfo?: { selectedOutfit?: string; gender?: string | null };
  userInfo?: { fullName?: string | null; profilePicture?: string | null };
}

const CollectivePublic: React.FC = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollDebounceRef = useRef<number | null>(null);

  const [data, setData] = useState<CollectiveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<{
    currentPage: number;
    totalPages: number;
    lastPage: boolean;
    totalItems: number;
  }>({
    currentPage: 0,
    totalPages: 1,
    lastPage: false,
    totalItems: 0,
  });
  const [isAnyInfoShown, setIsAnyInfoShown] = useState(false);

  const handleShowInfoChange = (isShown: boolean) => {
    setIsAnyInfoShown(isShown);
  };

  // If you use react-router's useNavigate, replace below with actual
  // const navigate = useNavigate();

  const fetchCollective = async (pageNo = 0, append = false) => {
    setLoading(true);
    try {
      const response = await api.getRequest(
        `fiza/collective/public_feed?pageNo=${pageNo}&pageSize=5&sortBy=likeCount&sortDir=DESC`
      );

      if (response.status && response.data) {
        setData(append ? [...data, ...(response.data.content || [])] : response.data.content || []);
        setPageInfo({
          currentPage: response.data.currentPage ?? pageNo,
          totalPages: response.data.totalPages ?? 1,
          lastPage: Boolean(response.data.lastPage),
          totalItems: response.data.totalItems ?? 0,
        });
      } else {
        if (!append) {
          setData([]);
        }
      }
    } catch (e) {
      if (!append) {
        setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollective(0, false);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const el = listRef.current;

    if (!el) {
      return;
    }

    const handleScroll = () => {
      if (loading || pageInfo.lastPage) {
        return;
      }

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 150) {
        fetchCollective(pageInfo.currentPage + 1, true);
      }
    };
    const debounced = () => {
      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
      scrollDebounceRef.current = window.setTimeout(handleScroll, 120) as number;
    };
    el.addEventListener('scroll', debounced);

    return () => {
      el.removeEventListener('scroll', debounced);

      if (scrollDebounceRef.current) {
        clearTimeout(scrollDebounceRef.current);
      }
    };
  }, [loading, pageInfo.lastPage, pageInfo.currentPage]);

  return (
    // <div className="flex flex-col h-screen w-screen">
    // {/* Scrollable list */}
    <div
      ref={listRef}
      className="  relative max-h-[calc(100vh-72px)] overflow-y-auto 
    p-1 sm:px-6  w-full "
    >
      <div className=" flex flex-col gap-10 ">
        {/* Overlay covering whole page when info shown */}
        {isAnyInfoShown && (
          <div className="fixed inset-0 bg-black opacity-25 z-50 pointer-events-none" />
        )}

        {loading && data.length === 0 && (
          <div className="w-full flex justify-center py-12">Loading...</div>
        )}
        {!loading && data.length === 0 && (
          <div className="w-full text-center text-gray-500 py-12">No collective items yet.</div>
        )}
        {data.map((item) => (
          <CollectiveShareCard key={item.id} item={item} onShowInfoChange={handleShowInfoChange} />
        ))}
        {loading && data.length > 0 && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            Loading more…
          </div>
        )}
      </div>
    </div>
    // </div>
  );
};

export default CollectivePublic;
