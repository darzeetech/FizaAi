import Collective from './Collective';
import React, { useEffect, useState, useRef } from 'react';
import Lookbook, { Portfolio as LookbookPortfolio } from './portfoliofavourite';
import { api } from '../../../utils/apiRequest';

type Portfolio = LookbookPortfolio;

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

const Favourites: React.FC<CollectiveProps> = ({ data, loading, onLoadMore, pageInfo }) => {
  const [activeTab, setActiveTab] = useState<'designs' | 'collective'>('collective');
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [loadingPortfoliosMore, setLoadingPortfoliosMore] = useState(false);
  const [portfoliosPage, setPortfoliosPage] = useState<number>(0);
  const [portfoliosTotalPages, setPortfoliosTotalPages] = useState<number>(1);
  const [portfoliosLastPage, setPortfoliosLastPage] = useState<boolean>(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [locationData] = useState<{ lat?: number; lon?: number }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActiveTab('collective');
  }, []);

  const fetchPortfolios = async (pageNo = 0, append = false, query = '') => {
    try {
      if (append) {
        setLoadingPortfoliosMore(true);
      } else {
        setLoadingPortfolios(true);
      }

      // Get lat/lon
      let lat = locationData?.lat;
      let lon = locationData?.lon;

      if (lat === undefined || lon === undefined) {
        const ipapiRaw = localStorage.getItem('ipapidata');
        try {
          const ipapiData = ipapiRaw ? JSON.parse(ipapiRaw) : undefined;

          if (ipapiData?.latitude && ipapiData?.longitude) {
            lat = ipapiData.latitude;
            lon = ipapiData.longitude;
          }
        } catch {
          // eslint-disable-next-line no-console
          console.error('Failed to parse location data');
        }
      }

      // Compose URL dynamically
      let url = `portfolio/fav-list?pageNo=${pageNo}&pageSize=10`;

      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      }

      if (query) {
        url += `&query=${encodeURIComponent(query)}`;
      }

      // API call
      const res = await api.getRequest(url);

      if (res?.status && Array.isArray(res.data?.content)) {
        const content = res.data.content;
        const lastPage = Boolean(res.data.lastPage);
        const currentPage =
          typeof res.data.currentPage === 'number' ? res.data.currentPage : pageNo;
        const totalPages = typeof res.data.totalPages === 'number' ? res.data.totalPages : 1;

        if (append) {
          setPortfolios((prev) => [...prev, ...content]);
        } else {
          setPortfolios(content);
        }

        setSelectedPortfolio(content.length > 0 ? content[0] : null);
        setPortfoliosPage(currentPage);
        setPortfoliosTotalPages(totalPages);
        setPortfoliosLastPage(lastPage);
      } else if (!append) {
        setPortfolios([]);
        setSelectedPortfolio(null);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch portfolios:', err);

      if (!append) {
        setPortfolios([]);
        setSelectedPortfolio(null);
      }
    } finally {
      setLoadingPortfolios(false);
      setLoadingPortfoliosMore(false);
    }
  };

  useEffect(() => {
    fetchPortfolios(0, false);
  }, []);

  //const drawerOpen = localStorage.getItem('drawerOpen');

  const handleLoadMore = () => {
    if (loadingPortfolios || loadingPortfoliosMore || portfoliosLastPage) {
      return;
    }
    fetchPortfolios(portfoliosPage + 1, true);
  };

  return (
    <div
      className=" relative max-h-[calc(100vh-72px)] overflow-y-auto 
    w-full"
    >
      <div className="flex space-x-3  px-4 my-4">
        <button
          className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-colors ${
            activeTab === 'collective'
              ? 'bg-[#4F2945] text-white border-[#4F2945]'
              : 'bg-white text-[#4F2945] border-[#4F2945]'
          }`}
          onClick={() => setActiveTab('collective')}
        >
          Outfits
        </button>
        <button
          className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-base rounded-full border transition-colors ${
            activeTab === 'designs'
              ? 'bg-[#4F2945] text-white border-[#4F2945]'
              : 'bg-white text-[#4F2945] border-[#4F2945]'
          }`}
          onClick={() => setActiveTab('designs')}
        >
          Designer
        </button>
      </div>

      <div className="">
        {activeTab === 'designs' && (
          <Lookbook
            portfolios={portfolios}
            loading={loadingPortfolios}
            loadingMore={loadingPortfoliosMore}
            selected={selectedPortfolio}
            onSelect={setSelectedPortfolio}
            onRefresh={() => fetchPortfolios(0, false)}
            onLoadMore={handleLoadMore}
            searchTerm={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);

              if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
              }
              searchDebounceRef.current = setTimeout(() => {
                fetchPortfolios(0, false, v);
              }, 100);
            }}
            pageInfo={{
              currentPage: portfoliosPage,
              totalPages: portfoliosTotalPages,
              totalItems: portfolios.length,
              lastPage: portfoliosLastPage,
            }}
          />
        )}
        {activeTab === 'collective' && (
          <Collective data={data} loading={loading} onLoadMore={onLoadMore} pageInfo={pageInfo} />
        )}
      </div>
    </div>
  );
};

export default Favourites;
