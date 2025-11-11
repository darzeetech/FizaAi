import React, { useEffect, useRef, useState } from 'react';
import CollectiveCard from './CollectiveCard';
// Adjust this path

interface FavouriteItem {
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
    activeSuscription?: boolean;
  };
  address?: {
    id?: number;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    lat?: number | null;
    lon?: number | null;
  };
  portfolioUserName?: string;
  sharedViaWhatsApp?: string;
  socialMedia?: {
    whatsapp?: string;
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

const Collective: React.FC<CollectiveProps> = ({ data, loading, onLoadMore, pageInfo }) => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollDebounceRef = useRef<number | null>(null);
  const [isAnyInfoShown, setIsAnyInfoShown] = useState(false);
  const [items, setItems] = useState<FavouriteItem[]>(data);

  useEffect(() => {
    if (!data || data.length === 0) {
      return;
    }

    setItems((prev) => {
      // If it's the first page, reset. Otherwise append
      if (pageInfo?.currentPage === 1) {
        return data;
      }

      // Avoid duplicates if re-fetch happens
      const existingIds = new Set(prev.map((i) => i.id));
      const newItems = data.filter((d) => !existingIds.has(d.id));

      return [...prev, ...newItems];
    });
  }, [data, pageInfo?.currentPage]);

  const handleRemove = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

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
      // console.log(
      //   'scrollTop:',
      //   el.scrollTop,
      //   'scrollHeight:',
      //   el.scrollHeight,
      //   'clientHeight:',
      //   el.clientHeight
      // );

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

        {loading && items.length === 0 && (
          <div className="w-full flex justify-center py-12">Loading...</div>
        )}
        {!loading && items.length === 0 && (
          <div className="w-full text-center text-gray-500 py-12">No collective items yet.</div>
        )}
        {items.map((item) => (
          <CollectiveCard
            key={item.id}
            item={item}
            onShowInfoChange={handleShowInfoChange}
            onRemove={handleRemove}
          />
        ))}
        {loading && items.length > 0 && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            Loading more…
          </div>
        )}
      </div>
    </div>
  );
};

export default Collective;
