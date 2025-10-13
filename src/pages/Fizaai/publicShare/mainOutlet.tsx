// CollectivePage.tsx
import React, { useState, useEffect } from 'react';
import HeaderWithSidedrawer from './Component/HeaderOutlet';
import SideDrawer from './Component/SIdedrawer'; // ensure correct path
import CollectivePublic from './CollectivePublic';
import { useNavigate } from 'react-router-dom';
import Lookbook, { Portfolio as LookbookPortfolio } from './portfolio';
import { api } from '../../../utils/apiRequest';

type Portfolio = LookbookPortfolio;

//const ExploreDesigners: React.FC = () => <div className="p-6">Explore Designers coming soon.</div>;

const CollectivePage: React.FC = () => {
  const [page, setPage] = useState<'collective' | 'explore'>('collective');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [loadingPortfoliosMore, setLoadingPortfoliosMore] = useState(false);
  const [portfoliosPage, setPortfoliosPage] = useState<number>(0);
  const [portfoliosTotalPages, setPortfoliosTotalPages] = useState<number>(1);
  const [portfoliosLastPage, setPortfoliosLastPage] = useState<boolean>(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [locationData, setLocationData] = useState<{ lat?: number; lon?: number }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Try to get from localStorage first
    let ipapiData: any = null;
    try {
      const stored = localStorage.getItem('ipapidata');

      if (stored) {
        ipapiData = JSON.parse(stored);
      }
    } catch (e) {
      ipapiData = null;
    }

    if (
      ipapiData &&
      typeof ipapiData.latitude === 'number' &&
      typeof ipapiData.longitude === 'number'
    ) {
      setLocationData({ lat: ipapiData.latitude, lon: ipapiData.longitude });
    } else {
      // Fallback to fetch from ipapi.co
      const fetchLocation = async () => {
        try {
          const ipRes = await fetch('https://ipapi.co/json/');

          if (ipRes.ok) {
            const ipData = await ipRes.json();
            setLocationData({ lat: ipData.latitude, lon: ipData.longitude });
          }
        } catch (e) {
          setLocationData({});
        }
      };
      fetchLocation();
    }
  }, []);

  const fetchPortfolios = async (pageNo = 0, append = false) => {
    try {
      if (append) {
        setLoadingPortfoliosMore(true);
      } else {
        setLoadingPortfolios(true);
      }
      //setError(null);
      const { lat, lon } = locationData;
      const res = await api.getRequest(
        `portfolio/fetch-all?pageNo=${pageNo}&pageSize=10${
          lat !== undefined && lon !== undefined ? `&lat=${lat}&lon=${lon}` : ''
        }`
      );

      if (res.status && res.data && Array.isArray(res.data.content)) {
        const content = res.data.content as Portfolio[];
        const lastPage = Boolean(res.data.lastPage);
        const currentPage =
          typeof res.data.currentPage === 'number' ? res.data.currentPage : pageNo;
        const totalPages = typeof res.data.totalPages === 'number' ? res.data.totalPages : 1;

        if (append) {
          setPortfolios((prev) => [...prev, ...content]);
        } else {
          setPortfolios(content);
          // set first item selected by default

          if (content.length > 0) {
            setSelectedPortfolio(content[0]);
          } else {
            setSelectedPortfolio(null);
          }
        }

        setPortfoliosPage(currentPage);
        setPortfoliosTotalPages(totalPages);
        setPortfoliosLastPage(lastPage);
      } else {
        if (!append) {
          setPortfolios([]);
          setSelectedPortfolio(null);
        }
      }
    } catch (err) {
      if (!append) {
        setPortfolios([]);
        setSelectedPortfolio(null);
      }
      // eslint-disable-next-line no-console
      console.error('Failed to fetch portfolios', err);
    } finally {
      setLoadingPortfolios(false);
      setLoadingPortfoliosMore(false);
    }
  };
  useEffect(() => {
    fetchPortfolios(0, false);
  }, []);

  const handleLoadMorePortfolios = () => {
    if (loadingPortfolios || loadingPortfoliosMore || portfoliosLastPage) {
      return;
    }

    const nextPage = portfoliosPage + 1;
    // guard: don't request beyond totalPages (if known)

    if (portfoliosTotalPages && nextPage >= portfoliosTotalPages && portfoliosLastPage) {
      return;
    }

    fetchPortfolios(nextPage, true);
  };

  const handleNavigate = (page: 'collective' | 'explore') => {
    setPage(page);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('fizaaiuser');

    if (storedUser) {
      navigate('/');
    }
  }, [navigate]);

  const handleSignup = () => {
    window.location.href = '/';
  };

  const toggleDrawer = () => {
    if (drawerOpen) {
      setSidebarAnimating(true);
      setDrawerOpen(false);
    } else {
      setTimeout(() => {
        setDrawerOpen(true);
      }, 10);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <HeaderWithSidedrawer
        currentPage={page}
        onNavigate={handleNavigate}
        onSignup={handleSignup}
        onToggleDrawer={toggleDrawer}
        drawerOpen={drawerOpen}
        onCloseDrawer={() => {
          setSidebarAnimating(true);
          setDrawerOpen(false);
        }}
      />

      {(drawerOpen || sidebarAnimating) && (
        <div
          className={`md:w-[300px] w-[280px] md:fixed md:left-0 md:top-0 absolute md:min-w-[260px] h-screen bg-[#F9F6F1] border-r shadow-md z-[100] transform transition-all duration-500 ease-in-out ${
            drawerOpen
              ? 'md:translate-x-0 translate-x-0 opacity-100'
              : 'md:-translate-x-full -translate-x-full opacity-0'
          }`}
          onTransitionEnd={() => {
            if (!drawerOpen) {
              setSidebarAnimating(false);
            }
          }}
        >
          <SideDrawer
            open={drawerOpen}
            onClose={() => {
              setSidebarAnimating(true);
              setDrawerOpen(false);
            }}
            currentPage={page}
            onNavigate={handleNavigate}
          />
        </div>
      )}

      <div
        onClick={() => {
          if (window.innerWidth < 768) {
            setSidebarAnimating(true);
            setDrawerOpen(false);
          }
        }}
        className={`w-full flex flex-col items-center justify-between flex-1 min-h-screen bg-white transition-all duration-500 ease-in-out ${
          drawerOpen ? 'md:ml-[300px]' : 'md:ml-0'
        }`}
      >
        {page === 'collective' && <CollectivePublic />}
        {page === 'explore' && (
          <Lookbook
            portfolios={portfolios}
            loading={loadingPortfolios}
            loadingMore={loadingPortfoliosMore}
            selected={selectedPortfolio}
            onSelect={(p) => setSelectedPortfolio(p)}
            onRefresh={() => fetchPortfolios(0, false)}
            onLoadMore={handleLoadMorePortfolios}
            searchTerm={searchTerm}
            onSearchChange={(v) => setSearchTerm(v)}
            pageInfo={{
              currentPage: portfoliosPage,
              totalPages: portfoliosTotalPages,
              totalItems: portfolios.length,
              lastPage: portfoliosLastPage,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CollectivePage;
