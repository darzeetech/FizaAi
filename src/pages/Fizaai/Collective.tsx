import React, { useEffect, useRef } from 'react';
import CollectiveCard from './CollectiveCard'; // Adjust this path

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
      {data.map((item) => (
        <CollectiveCard key={item.id} item={item} />
      ))}
      {loading && data.length > 0 && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          Loading more…
        </div>
      )}
    </div>
  );
};

export default Collective;
