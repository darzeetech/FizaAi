import React, { useEffect, useRef } from 'react';

export interface CollectiveItem {
  id: number;
  imageUrl: string;
  title: string;
  designerName: string;
  madeBy?: string;
  artisans?: string[];
  timeline?: string;
  status?: string; // e.g., "Brought to Life"
  likeCount: number;
  profileInitial: string;
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
      className="w-full flex flex-col gap-6 max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-2"
    >
      {loading && data.length === 0 && (
        <div className="w-full flex justify-center py-12">Loading...</div>
      )}

      {!loading && data.length === 0 && (
        <div className="w-full text-center text-gray-500 py-12">No collective items yet.</div>
      )}

      {data.map((item) => (
        <div
          key={item.id}
          className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          {/* Left: Image */}
          <div className="w-full md:w-28 h-28 flex-shrink-0">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-contain rounded"
            />
          </div>

          {/* Right: Info */}
          <div className="flex-1 flex flex-col justify-between gap-2">
            <div className="flex flex-col gap-1">
              <div className="font-bold text-lg">{item.title}</div>
              <div className="text-xs text-gray-400">
                <span className="font-semibold">DESIGNED BY:</span> {item.designerName}
              </div>
              {item.madeBy && (
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">MADE BY:</span> {item.madeBy}
                </div>
              )}
              {item.artisans && item.artisans.length > 0 && (
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">ARTISANS INVOLVED:</span>{' '}
                  {item.artisans.join(', ')}
                </div>
              )}
              {item.timeline && (
                <div className="text-xs text-gray-400">
                  <span className="font-semibold">TIMELINE:</span> {item.timeline}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-2">
              {item.status && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">
                  {item.status}
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-gray-600">
                  <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 18.343l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  {item.likeCount}
                </span>
                <span className="bg-purple-200 rounded-full w-7 h-7 flex items-center justify-center text-purple-800 font-bold">
                  {item.profileInitial}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {loading && data.length > 0 && (
        <div className="flex items-center justify-center py-4 text-sm text-gray-500">
          Loading more…
        </div>
      )}

      {/* fallback Load More button */}
      {onLoadMore &&
        pageInfo &&
        (pageInfo.currentPage ?? 0) < (pageInfo.totalPages ?? 1) &&
        !pageInfo.lastPage && (
          <div className="mt-3 text-center hidden">
            <button
              onClick={onLoadMore}
              className="px-4 py-2 bg-[#79539f] text-white rounded-md text-sm"
            >
              Load more
            </button>
          </div>
        )}
    </div>
  );
};

export default Collective;
