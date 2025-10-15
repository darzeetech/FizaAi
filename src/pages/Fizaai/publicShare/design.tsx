// pages/ExplorePage.tsx
import React, { useEffect, useState } from 'react';
import Lookbook, { Portfolio as LookbookPortfolio } from './portfolio';
import { api } from '../../../utils/apiRequest';
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
  const [locationData, setLocationData] = useState<{ lat?: number; lon?: number }>({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('ipapidata');
    try {
      if (stored) {
        const ipData = JSON.parse(stored);
        setLocationData({ lat: ipData.latitude, lon: ipData.longitude });
      }
    } catch (e) {
      // fallback
    }
  }, []);

  const fetchPortfolios = async (pageNo = 0, append = false) => {
    try {
      if (append) {
        setLoadingPortfoliosMore(true);
      } else {
        setLoadingPortfolios(true);
      }

      const { lat, lon } = locationData;
      const res = await api.getRequest(
        `portfolio/fetch-all?pageNo=${pageNo}&pageSize=10${
          lat !== undefined && lon !== undefined ? `&lat=${lat}&lon=${lon}` : ''
        }`
      );

      if (res.status && Array.isArray(res.data.content)) {
        const content = res.data.content;

        if (append) {
          setPortfolios((prev) => [...prev, ...content]);
        } else {
          setPortfolios(content);
          setSelectedPortfolio(content[0] || null);
        }

        setPortfoliosPage(res.data.currentPage);
        setPortfoliosTotalPages(res.data.totalPages);
        setPortfoliosLastPage(res.data.lastPage);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
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
