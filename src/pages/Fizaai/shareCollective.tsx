import React, { useEffect, useRef, useState } from 'react';
import CollectiveShareCard from './collectiveShareCard'; // Adjust the path
import { api } from '../../utils/apiRequest';

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

  // If you use react-router's useNavigate, replace below with actual
  // const navigate = useNavigate();
  // For this example, using a dummy:
  const [, setDummy] = useState(false);
  const navigate = (path: string) => {
    window.location.href = path;
    setDummy((v) => !v); // dummy state change to avoid unused warning
  };

  const fetchCollective = async (pageNo = 0, append = false) => {
    setLoading(true);
    try {
      const response = await api.getRequest(
        `fiza/collective/list_public?pageNo=${pageNo}&pageSize=10&sortBy=likeCount&sortDir=DESC`
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

  const handleSignup = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      {/* Header */}
      <header className="w-full flex justify-between items-center bg-white p-4 border-b border-gray-300 sticky top-0 z-10">
        <h1 className="text-xl font-semibold text-purple-700 select-none">Collective Gallery</h1>
        <button
          className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
          onClick={handleSignup}
          aria-label="Sign Up"
        >
          Sign Up
        </button>
      </header>

      {/* Scrollable list */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-6 space-y-10"
        style={{ width: '100vw' }}
      >
        {loading && data.length === 0 && (
          <div className="w-full flex justify-center py-12">Loading...</div>
        )}
        {!loading && data.length === 0 && (
          <div className="w-full text-center text-gray-500 py-12">No collective items yet.</div>
        )}
        {data.map((item) => (
          <CollectiveShareCard key={item.id} item={item} />
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

export default CollectivePublic;
