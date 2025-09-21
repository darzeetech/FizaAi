import React, { useEffect, useRef, useState } from 'react';
import CollectiveCard from './CollectiveCard'; // Adjust this path

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
  const [isAnyInfoShown, setIsAnyInfoShown] = useState(false);

  const handleShowInfoChange = (isShown: boolean) => {
    setIsAnyInfoShown(isShown);
  };

  useEffect(() => {
    const el = listRef.current;

    if (!el || !onLoadMore) {
      return;
    }

    const handleScroll = () => {
      // eslint-disable-next-line no-console
      console.log(
        'scrollTop:',
        el.scrollTop,
        'scrollHeight:',
        el.scrollHeight,
        'clientHeight:',
        el.clientHeight
      );

      if (loading || !pageInfo || pageInfo.lastPage) {
        return;
      }

      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
        // eslint-disable-next-line no-console
        console.log('Loading more triggered');

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
    // eslint-disable-next-line no-console
    console.log(isAnyInfoShown);

    return () => {
      el.removeEventListener('scroll', debounced);

      if (scrollDebounceRef.current) {
        window.clearTimeout(scrollDebounceRef.current);
      }
    };
  }, [onLoadMore, loading, pageInfo?.lastPage]);

  return (
    // <div className="relative max-h-[calc(100vh-72px)] overflow-y-auto px-6 py-6 w-full">
    //   {/* Overlay covering whole page when info shown */}
    //   {isAnyInfoShown && (
    //     <div className="fixed inset-0 bg-black opacity-25 z-50 pointer-events-none" />
    //   )}

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
          <CollectiveCard key={item.id} item={item} onShowInfoChange={handleShowInfoChange} />
        ))}
        {loading && data.length > 0 && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            Loading more…
          </div>
        )}
      </div>
    </div>
  );
};

export default Collective;
