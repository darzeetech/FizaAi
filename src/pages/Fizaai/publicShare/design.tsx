// pages/ExplorePage.tsx
import React, { useEffect, useState } from 'react';
import Lookbook, { Portfolio as LookbookPortfolio } from './portfolio';
import { api } from '../../../utils/apiRequest';
import { useNavigate } from 'react-router-dom';

// import { getTime } from 'date-fns';

type Portfolio = LookbookPortfolio;

const ExplorePage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [loadingPortfoliosMore, setLoadingPortfoliosMore] = useState(false);
  const [portfoliosPage, setPortfoliosPage] = useState<number>(0);
  const [portfoliosTotalPages, setPortfoliosTotalPages] = useState<number>(1);
  const [portfoliosLastPage, setPortfoliosLastPage] = useState<boolean>(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [locationData] = useState<{ lat?: number; lon?: number }>({});
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLocation = async () => {
    try {
      const ipRes = await fetch('https://ipapi.co/json/');

      if (ipRes.ok) {
        const ipData = await ipRes.json();

        // Save full response or just coordinates to localStorage
        localStorage.setItem('ipapidata', JSON.stringify(ipData));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch location', e);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('fizaaiuser');

    if (user) {
      navigate('/'); // redirect to home if user exists
    }
  }, [navigate]);
  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchPortfolios = async (pageNo = 0, append = false) => {
    try {
      if (append) {
        setLoadingPortfoliosMore(true);
      } else {
        setLoadingPortfolios(true);
      }
      //setError(null);

      // Try to get lat/lon from localStorage if not present in locationData
      let lat = locationData?.lat;
      let lon = locationData?.lon;

      if (lat === undefined || lon === undefined) {
        const ipapiRaw = localStorage.getItem('ipapidata');

        if (ipapiRaw) {
          try {
            const ipapiData = JSON.parse(ipapiRaw);

            if (ipapiData.latitude !== undefined && ipapiData.longitude !== undefined) {
              lat = ipapiData.latitude;
              lon = ipapiData.longitude;
            }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Failed to parse ipapidata from localStorage', error);
          }
        }
      }

      const res = await api.getRequest(
        `portfolio/fetch-all?pageNo=${pageNo}&pageSize=10${
          lat !== undefined && lon !== undefined ? `&lat=${lat}&lon=${lon}` : ''
        }`
      );

      if (res.status && res.data && Array.isArray(res.data.content)) {
        const content = res.data.content;
        const lastPage = Boolean(res.data.lastPage);
        const currentPage =
          typeof res.data.currentPage === 'number' ? res.data.currentPage : pageNo;
        const totalPages = typeof res.data.totalPages === 'number' ? res.data.totalPages : 1;

        if (append) {
          setPortfolios((prev) => [...prev, ...content]);
        } else {
          setPortfolios(content);

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

  //const drawerOpen = localStorage.getItem('drawerOpen');

  const handleLoadMore = () => {
    if (loadingPortfolios || loadingPortfoliosMore || portfoliosLastPage) {
      return;
    }
    fetchPortfolios(portfoliosPage + 1, true);
  };

  //const drawerOpen = true;

  return (
    <div
    //   className={`flex-1 w-full transition-all duration-500 ease-in-out ${
    //     drawerOpen ? 'md:ml-[300px]' : 'md:ml-0'
    //   }`}
    >
      <Lookbook
        portfolios={portfolios}
        loading={loadingPortfolios}
        loadingMore={loadingPortfoliosMore}
        selected={selectedPortfolio}
        onSelect={setSelectedPortfolio}
        onRefresh={() => fetchPortfolios(0, false)}
        onLoadMore={handleLoadMore}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        pageInfo={{
          currentPage: portfoliosPage,
          totalPages: portfoliosTotalPages,
          totalItems: portfolios.length,
          lastPage: portfoliosLastPage,
        }}
      />
    </div>
  );
};

export default ExplorePage;
