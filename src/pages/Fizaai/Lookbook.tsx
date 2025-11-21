import React, { useEffect, useState, useRef } from 'react';
import './sidebar.css';
import location from '../../assets/images/location_on.png';
import person from '../../assets/images/Vector1.png';
import qr from '../../assets/images/qr_code_scanner.png';
import share from '../../assets/images/share.png';
import copy from '../../assets/images/content_copy.png';
import facebook from '../../assets/images/facebook.png';
import whatapp from '../../assets/images/whatsapp3.png';
import glove from '../../assets/images/Vector3.png';
import insta from '../../assets/images/Clip path group.png';
import upi from '../../assets/images/Frame 1000010260.png';
import map from '../../assets/images/google-maps.png';
import info1 from '../../assets/images/workflow1.png';
import info2 from '../../assets/images/workflow.png';
import portfolio from '../../assets/images/album1.png';
import portfolio1 from '../../assets/images/album.png';
import hexagon from '../../assets/images/hexagon.png';
import hexagonfinal from '../../assets/images/Property 1=Variant2.png';
import left_swap from '../../assets/images/left_swipe.gif';
import right_swap from '../../assets/images/right_swipe.gif';
import { FaTimes } from 'react-icons/fa';

import { api } from '../../utils/apiRequest';
import { TiArrowLeft } from 'react-icons/ti';
import { useSwipeable } from 'react-swipeable';

import QRCode from 'react-qr-code';

export type Portfolio = {
  id: number;
  profilePictureUrl?: string | null;
  coverPictureUrl?: string | null;
  userName: string;
  tailorName: string;
  city?: string | null;
  country?: string | null;
  genders?: string[];
  about?: string | null;
};

type PageInfo = {
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  lastPage?: boolean;
};

type Props = {
  portfolios: Portfolio[];
  loading?: boolean;
  loadingMore?: boolean;
  selected?: Portfolio | null;
  onSelect: (p: Portfolio) => void;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  searchTerm?: string;
  onSearchChange?: (v: string) => void;
  pageInfo?: PageInfo;
  className?: string;
};

export default function Lookbook({
  portfolios,
  loading = false,
  loadingMore = false,
  selected = null,
  onSelect,
  onRefresh,
  onLoadMore,
  onSearchChange,
  pageInfo,
  searchTerm = '',
  className = '',
}: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);
  const scrollDebounceRef = useRef<number | null>(null);
  const [detail, setDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [lastFetchedUsername, setLastFetchedUsername] = useState<string | null>(null);

  const [viewStage, setViewStage] = useState<'INFO' | 'PORTFOLIO'>('INFO');

  // filters / store data state
  const [filtersData, setFiltersData] = useState<any | null>(null);

  const [selectedOutfits, setSelectedOutfits] = useState<number[]>([]);
  const [selectedSubOutfits, setSelectedSubOutfits] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const [selectedImageIndexes, setSelectedImageIndexes] = useState<{ [key: number]: number }>({});

  const [selectedOutfitsr, setSelectedOutfitsr] = useState<number[]>([]);

  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Store lat/lon from ipapi.co
  const [locationData, setLocationData] = useState<{ lat?: number; lon?: number }>({});

  const [currentDesignerIndex, setCurrentDesignerIndex] = useState(0);

  const [showSwapDiv, setShowSwapDiv] = useState(true);
  const [showqr, setShowqr] = useState(false);

  const ap = process.env.REACT_APP_BASE_AP_URL;

  type FilteredOutfit = {
    outfit_type: string;
    portfolio_outfits: {
      id: number;
      creation_time: string;
      title: string;
      sub_outfit_name: string;
      image_url: string[];
    }[];
  };

  type FilteredOutfitsResponse = {
    outfit_details: FilteredOutfit[];
  } | null;

  const [filteredOutfits, setFilteredOutfits] = useState<FilteredOutfitsResponse>(null);
  const [filteredOutfitsLoading, setFilteredOutfitsLoading] = useState(false);
  const [filteredOutfitsError, setFilteredOutfitsError] = useState<string | null>(null);

  // Fetch lat/lon only once on mount
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

  useEffect(() => {
    const el = listRef.current;

    if (!el || !onLoadMore) {
      return;
    }

    const handleScroll = () => {
      if (loading || loadingMore) {
        return;
      } // avoid duplicate calls

      if (!pageInfo || pageInfo.lastPage) {
        return;
      }

      // When user scrolls within 150px of bottom, request more
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 150) {
        onLoadMore();
      }
    };

    const debounced = () => {
      if (scrollDebounceRef.current) {
        window.clearTimeout(scrollDebounceRef.current);
      }
      // small debounce to avoid rapid calls
      scrollDebounceRef.current = window.setTimeout(handleScroll, 120) as unknown as number;
    };

    el.addEventListener('scroll', debounced);

    return () => {
      el.removeEventListener('scroll', debounced);

      if (scrollDebounceRef.current) {
        window.clearTimeout(scrollDebounceRef.current);
      }
    };
  }, [onLoadMore, loading, loadingMore, pageInfo?.lastPage]);

  // reset detail when a different portfolio is selected so user can fetch fresh data by clicking right pane
  useEffect(() => {
    const username = selected?.userName || '';
    setDetail(null);
    setDetailError(null);
    setDetailLoading(false);
    setLastFetchedUsername(null);

    if (!username) {
      return;
    }
    fetchByUsername(username);
  }, [selected?.userName]);

  useEffect(() => {
    const username = selected?.userName || '';
    const tailorId = detail?.tailor_id ?? undefined;
    setFiltersData(null);

    if (!username || !tailorId) {
      return;
    }
    fetchFiltersByUsername(username, tailorId);
  }, [detail]);

  useEffect(() => {
    if (detail && detail?.port_folio_id) {
      fetchFilteredOutfits(
        detail?.port_folio_id,
        selectedOutfits,
        selectedSubOutfits,
        selectedColors
      );
    }
  }, [detail]);
  useEffect(() => {
    setShowSwapDiv(true); // show the div when section loads
    const timer = setTimeout(() => {
      setShowSwapDiv(false); // hide after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // cleanup on unmount
  }, []);

  const fetchByUsername = async (username: string) => {
    if (!username) {
      return;
    }

    // avoid refetching same username repeatedly
    if (lastFetchedUsername === username) {
      return;
    }

    setDetailLoading(true);
    setDetailError(null);

    try {
      const { lat, lon } = locationData;
      const url = `portfolio/fetch-by-username?username=${encodeURIComponent(username)}${
        lat !== undefined && lon !== undefined ? `&lat=${lat}&lon=${lon}` : ''
      }`;
      const res = await api.getRequest(url);

      if (!res || !res.status) {
        throw new Error(res?.message || 'Failed to fetch profile');
      }

      setDetail(res.data);
      setLastFetchedUsername(username);
    } catch (err: any) {
      setDetailError(err?.message || 'Failed to load profile');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // fetch filters/store data when username changes
  const fetchFiltersByUsername = async (username: string, tailorId?: number | null) => {
    if (!username) {
      return;
    }

    try {
      const qs = `tailor_id=${encodeURIComponent(tailorId ?? 92)}&username=${encodeURIComponent(
        username
      )}`;
      const res = await api.getRequest(`portfolio/filters?${qs}`);

      if (!res || !res.status) {
        throw new Error(res?.message || 'Failed to fetch filters');
      }

      setFiltersData(res.data);
    } catch (err: any) {
      setFiltersData(null);
    }
  };

  const fetchFilteredOutfits = async (
    portfolioId: number,
    selectedOutfits: any[],
    selectedSubOutfits: any[],
    selectedColors: any[]
  ) => {
    setFilteredOutfitsLoading(true);
    setFilteredOutfitsError(null);
    setFilteredOutfits(null);
    try {
      const outfit_type = selectedOutfits.join(',');
      const sub_outfit = selectedSubOutfits.join(',');
      const color = selectedColors.join(',');
      const url = `portfolio/${portfolioId}/portfolio_outfit?outfit_type=${encodeURIComponent(
        outfit_type
      )}&sub_outfit=${encodeURIComponent(sub_outfit)}&color=${encodeURIComponent(color)}`;
      const res = await api.getRequest(url);

      if (!res || !res.status) {
        throw new Error(res?.message || 'Failed to fetch filtered outfits');
      }
      setFilteredOutfits(res.data);
    } catch (err: any) {
      setFilteredOutfitsError(err?.message || 'Failed to fetch filtered outfits');
    } finally {
      setFilteredOutfitsLoading(false);
    }
  };

  const handleMapClick = () => {
    // Optional chaining protects from null/undefined errors
    const lat = detail?.address_details?.address?.lat;
    const lon = detail?.address_details?.address?.lon;

    if (lat && lon) {
      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('Location details are not available.');
    }
  };

  const handleCopyClick = () => {
    const ap = process.env.REACT_APP_BASE_AP_URL;
    navigator.clipboard.writeText(`${ap}designer/${selected?.userName}`);
    alert('Link copied to clipboard!');
  };

  const handleShareClick = () => {
    const ap = process.env.REACT_APP_BASE_AP_URL;

    if (navigator.share) {
      navigator
        .share({
          title: 'Check Portfolio',
          url: `${ap}designer/${selected?.userName}`,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(`${ap}designer/${selected?.userName}`);
      alert('Link copied! Native share is not supported in this browser.');
    }
  };

  const handleUPIPayment = () => {
    const paymentLink = detail?.social_media_handlers?.upi;
    const upiPaymentLink = `http://www.upi.me/pay?pa=${paymentLink}`;
    // Try opening in new window first
    const paymentWindow = window.open(upiPaymentLink, '_blank');

    // Fallback to direct location change if window.open fails
    if (!paymentWindow) {
      window.location.href = upiPaymentLink;
    }
  };

  // eslint-disable-next-line no-console
  // console.log(filtersData, filtersError, selectedOutfits, selectedColors);

  // // eslint-disable-next-line no-console
  // console.log(selectedOutfits, selectedSubOutfits, selectedColors);

  // // eslint-disable-next-line no-console
  // console.log(filteredOutfits);

  const handleSwipeLeft = () => {
    const nextIndex = currentDesignerIndex < portfolios.length - 1 ? currentDesignerIndex + 1 : 0;
    setCurrentDesignerIndex(nextIndex);

    onSelect(portfolios[nextIndex]);
  };

  const handleSwipeRight = () => {
    const prevIndex = currentDesignerIndex > 0 ? currentDesignerIndex - 1 : portfolios.length - 1;
    setCurrentDesignerIndex(prevIndex);
    onSelect(portfolios[prevIndex]);
  };

  const SWIPE_MIN_DISTANCE = 50; // px – increase to make it even less sensitive
  const SWIPE_MAX_VERTICAL_DRIFT = 60; // px – allow some vertical movement, but not too much

  const handlers = useSwipeable({
    // We'll use a single onSwiped handler and decide left/right ourselves
    onSwiped: (eventData) => {
      const { dir, deltaX, absX, absY } = eventData;

      // 1) Require mostly horizontal gesture
      if (absX <= absY) {
        return; // vertical or diagonal swipe -> ignore
      }

      // 2) Require enough horizontal distance
      if (Math.abs(deltaX) < SWIPE_MIN_DISTANCE || absY > SWIPE_MAX_VERTICAL_DRIFT) {
        return; // too short or too vertical
      }

      // 3) Finally decide direction
      if (dir === 'Left') {
        handleSwipeLeft();
      } else if (dir === 'Right') {
        handleSwipeRight();
      }
    },

    // Make it *less* sensitive overall
    delta: SWIPE_MIN_DISTANCE, // minimum px before considering a swipe
    swipeDuration: 300, // max time in ms for a swipe
    rotationAngle: 25, // ignore more diagonal gestures

    // Only care about touch (mobile), not mouse
    trackTouch: true,
    trackMouse: false,

    // Let the page scroll vertically as usual
    preventScrollOnSwipe: false,
  });

  return (
    <div className={`w-full flex gap-2 md:px-1 p-1 ${className}`}>
      <aside
        ref={listRef}
        className={`${
          showMobilePreview ? 'hidden md:block md:w-[30%]' : 'md:w-[30%] w-full'
        }  w-full max-h-[calc(100vh-72px)] custom-scrollbar overflow-y-auto border rounded-lg md:p-3 p-2 bg-white`}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Designers</h3>
          <div className="fle items-center gap-2 hidden">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="text-sm px-2 py-1 bg-gray-100 rounded"
                title="Refresh"
              >
                Refresh
              </button>
            )}
          </div>
        </div>
        <div className="relative mb-3">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-black">🔍</span>
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search designers"
            className="w-full text-black pl-10 pr-3 py-2 rounded-full bg-[#c8bda5] text-base font-[400] placeholder-black"
          />
        </div>

        {loading && portfolios.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-[#79539f] rounded-full" />
          </div>
        ) : portfolios.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No portfolios found</div>
        ) : (
          <div className="space-y-3">
            {portfolios.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelect(p);
                  setShowMobilePreview(true);
                }}
                className={`w-full text-left flex flex-col items-start gap-3 p-3 border border-[#0000001A] rounded-lg transition-shadow ${
                  selected?.id === p.id ? 'ring-2 ring-[#79539f]' : 'shadow-sm hover:shadow'
                }`}
              >
                <div className="flex items-center justify-start gap-3 w-full">
                  {p.profilePictureUrl ? (
                    <img
                      src={p.profilePictureUrl}
                      alt={p.tailorName}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">
                        {(p.tailorName && p.tailorName.charAt(0).toUpperCase()) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-[600] font-inter text-[.9rem]">{p.tailorName}</div>
                    <div className="text-[.8rem] text-[#41423C] font-[600] font-inter">
                      {p.userName}
                    </div>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 font-semibold">{p.about}</p>

                  <div className="text-xs flex items-center text-gray-400 mt-2 gap-2">
                    <img src={location} alt="location" className="h-5 md:h-5 aspect-auto" />
                    {p.city || p.country ? (
                      <span className="text-[#41423C] font-inter">
                        {p.city || ''} {p.city && p.country ? ', ' : ''} {p.country || ''}
                      </span>
                    ) : (
                      <span>Location not provided</span>
                    )}

                    <div className="flex gap-2 flex-wrap ml-2">
                      {p.genders && p.genders.length > 0 ? (
                        p.genders.map((g) => (
                          <span
                            key={g}
                            className={`text-xs flex items-center gap-2 px-3 py-1 rounded-full text-gray-700 ${
                              g === 'MALE'
                                ? 'bg-[#BDCFFF]'
                                : g === 'FEMALE'
                                  ? 'bg-[#D8C9E6]'
                                  : 'bg-gray-100'
                            }`}
                          >
                            <img src={person} alt="person" className="h-3 md:h-4 aspect-auto" />
                            {g === 'MALE' ? 'Men' : g === 'FEMALE' ? 'Women' : g}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full hidden bg-gray-100 text-gray-700"></span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* show loading more indicator when appending */}
        {loadingMore && portfolios.length > 0 && (
          <div className="flex items-center justify-center py-3">
            <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-[#79539f] rounded-full" />
            <div className="ml-2 text-sm text-gray-600">Loading more...</div>
          </div>
        )}

        {/* Manual load more fallback */}
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

        <div className="w-full h-[80px] md:hidden block"></div>
      </aside>

      <section
        className={`${
          showMobilePreview ? 'w-full ' : ' md:block hidden'
        } flex-1 border rounded-lg md:p-4 p- bg-white h-fit md:max-h-[calc(100vh-72px)]`}
      >
        {!selected ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a portfolio on the left to view details
          </div>
        ) : (
          <div
            className="w-full h-screen flex flex-col md:flex-row md:gap-8 gap-1 relative md:custom-scrollbar overflow-y-scroll scrollbar-hide"
            {...(showMobilePreview && window.innerWidth < 768 ? handlers : {})}
          >
            {/* Left: owner & meta */}
            <div className="md:w-[40%] h-fit w-full flex flex-col gap-4 ">
              {showMobilePreview && window.innerWidth < 768 && (
                <button
                  className="flex items-center font-semibold"
                  onClick={() => setShowMobilePreview(false)}
                >
                  <TiArrowLeft
                    onClick={() => {
                      setShowMobilePreview(false);
                    }}
                    className={`${showMobilePreview ? ' block' : ' hidden'} size-8 cursor-pointer`}
                  />{' '}
                  Designers
                </button>
              )}

              <div className="flex flex-col w-full items-center   relative ">
                <div className="w-full h-[300px] md:hidden block">
                  <img
                    src={detail?.base_info?.cover_picture_url}
                    alt={`${selected.tailorName} cover`}
                    className="w-full h-full object-cover rounded-b-lg"
                  />
                </div>
                <div className="w-full md:relative absolute borde rounded-lg bg-gray-50 opacity-90  bg-[#9a9b9700 shadow   shadow-[#00000040] md:bottom-0 bottom-0 p-4">
                  <div className="flex items-center gap-3 w-full  ">
                    {detail?.base_info?.profile_picture_url ? (
                      <img
                        src={detail?.base_info?.profile_picture_url}
                        alt="profile"
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <span className="text-md font-semibold text-gray-700">
                          {(selected.tailorName && selected.tailorName.charAt(0).toUpperCase()) ||
                            '?'}
                        </span>
                      </div>
                    )}
                    <div className=" w-full flex  items-center justify-between   ">
                      <div className="w-[60%] flex flex-col">
                        <div className="font-semibold w-full break-words leading-5">
                          {selected.tailorName}
                        </div>
                        <div className="text-sm text-gray-500 break-words">{selected.userName}</div>
                      </div>

                      <div className="w-[40%] flex items-center gap-4">
                        <img
                          src={copy}
                          alt="copy"
                          className="h-5 md:h-4 aspect-auto cursor-pointer"
                          onClick={handleCopyClick}
                        />
                        <img
                          src={share}
                          alt="share"
                          className="h-5 md:h-4 aspect-auto cursor-pointer"
                          onClick={handleShareClick}
                        />

                        <img
                          src={qr}
                          alt="qr"
                          className="h-5 md:h-4 aspect-auto cursor-pointer"
                          onClick={() => setShowqr(true)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full justify-center my-1 md:py-1 ">
                    {/* Social media icons with links */}
                    {detail?.social_media_handlers?.facebook && (
                      <img
                        src={facebook}
                        alt="facebook"
                        className="h-5 md:h-5 aspect-auto cursor-pointer"
                        onClick={() => window.open(detail.social_media_handlers.facebook, '_blank')}
                      />
                    )}
                    {detail?.social_media_handlers?.instagram && (
                      <img
                        src={insta}
                        alt="instagram"
                        className="h-5 md:h-5 aspect-auto cursor-pointer"
                        onClick={() =>
                          window.open(detail.social_media_handlers.instagram, '_blank')
                        }
                      />
                    )}
                    {detail?.social_media_handlers?.whatsapp && (
                      <img
                        src={whatapp}
                        alt="whatsapp"
                        className="h-5 md:h-5 aspect-auto cursor-pointer"
                        onClick={() => {
                          let phoneNumber = detail?.social_media_handlers?.whatsapp;
                          // Remove any non-digit characters first
                          phoneNumber = phoneNumber.replace(/\D/g, '');
                          // If 10 digits, prepend '91'

                          if (phoneNumber.length === 10) {
                            phoneNumber = '+91' + phoneNumber;
                          }
                          const message = encodeURIComponent(
                            'Hi, I saw your portfolio on fizaai.com by Darzee.'
                          );
                          const url = `https://wa.me/${phoneNumber}?text=${message}`;
                          window.open(url, '_blank');
                        }}
                      />
                    )}

                    {detail?.port_folio_link && (
                      <img
                        src={glove}
                        alt="whatsapp"
                        className="h-5 md:h-5 aspect-auto cursor-pointer"
                        onClick={() => {
                          const link = detail?.port_folio_link.startsWith('http')
                            ? detail?.port_folio_link
                            : 'https://' + detail?.port_folio_link;
                          window.open(link, '_blank');
                        }}
                      />
                    )}
                    {detail?.social_media_handlers?.upi && (
                      <img
                        src={upi}
                        alt="copy"
                        className="h-5 md:h-5 aspect-auto cursor-pointer"
                        onClick={handleUPIPayment}
                      />
                    )}

                    <img
                      src={map}
                      alt="copy"
                      className="h-5 md:h-5 aspect-auto cursor-pointer"
                      onClick={handleMapClick}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full px-2 flex flex-col gap-3">
                {/* stage toggle buttons */}
                <div className="flex items-center justify-between gap-3 md:mb-4 mb-2 w-full  ">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => setViewStage('INFO')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                          viewStage === 'INFO'
                            ? 'bg-[#111827] text-white shadow'
                            : 'bg-white border-2 border-gray-200 text-[#333333B2]'
                        }`}
                        title="Info"
                      >
                        {viewStage === 'INFO' ? (
                          <img src={info1} alt="info" className="h-6 md:h-7 aspect-auto" />
                        ) : (
                          <img src={info2} alt="info" className="h-6 md:h-7 aspect-auto" />
                        )}
                      </button>
                      <p
                        className={`text-sm font-semibold  ${
                          viewStage === 'INFO' ? ' text-[#000000] ' : ' text-[#333333B2]'
                        }`}
                      >
                        Info
                      </p>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <button
                        onClick={() => setViewStage('PORTFOLIO')}
                        className={`flex items-center gap-2 px-3 py-2 rounded-2xl transition ${
                          viewStage === 'PORTFOLIO'
                            ? 'bg-[#111827] text-white shadow'
                            : 'bg-white border-2 border-gray-200 text-[#333333B2]'
                        }`}
                        title="Portfolio"
                      >
                        {viewStage === 'INFO' ? (
                          <img
                            src={portfolio1}
                            alt="portfolio"
                            className="h-6 md:h-7 aspect-auto"
                          />
                        ) : (
                          <img src={portfolio} alt="portfolio" className="h-6 md:h-7 aspect-auto" />
                        )}
                      </button>
                      <p
                        className={`text-sm font-semibold  ${
                          viewStage === 'PORTFOLIO' ? ' text-[#000000] ' : ' text-[#333333B2]'
                        }`}
                      >
                        Portfolio
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:pr-2 pr-6">
                    {detail?.fav ? (
                      <img
                        src={hexagonfinal}
                        alt="Remove from favorite"
                        className="h-9 md:h-10 aspect-auto cursor-pointer"
                        onClick={async () => {
                          if (detail && detail.port_folio_id) {
                            try {
                              await api.putRequest(
                                `portfolio/remove-from-fav?portfolioId=${detail.port_folio_id}`,
                                {},
                                false
                              );
                              // Update local state to reflect change
                              setDetail((prev: any) => ({
                                ...prev,
                                fav: false,
                              }));
                            } catch (e) {
                              // Optionally handle error
                            }
                          }
                        }}
                      />
                    ) : (
                      <img
                        src={hexagon}
                        alt="Add to favorite"
                        className="h-9 md:h-10 aspect-auto cursor-pointer"
                        onClick={async () => {
                          if (detail && detail.port_folio_id) {
                            try {
                              await api.putRequest(
                                `portfolio/add-to-fav?portfolioId=${detail.port_folio_id}`,
                                {},
                                false
                              );
                              // Update local state to reflect change
                              setDetail((prev: any) => ({
                                ...prev,
                                fav: true,
                              }));
                            } catch (e) {
                              // Optionally handle error
                            }
                          }
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* About */}
                {detail?.info?.about && viewStage === 'INFO' && (
                  <div>
                    <div className="text-xs text-[#323232B2] mb-1 font-semibold">About</div>
                    <div className="text-sm text-[#41423C] font-semibold">
                      {detail?.info?.about}
                    </div>
                  </div>
                )}
                {viewStage === 'INFO' ? (
                  <>
                    {/* Type */}
                    <div className="">
                      <div className="flex gap-2 mt-2">
                        {detail?.info?.genders && detail?.info?.genders?.length > 0 ? (
                          detail?.info?.genders?.map((g: string) => (
                            <span
                              key={g}
                              className={`text-xs flex items-center gap-2 px-3 py-1 rounded-full text-gray-700 ${
                                g === 'MALE'
                                  ? 'bg-[#BDCFFF]'
                                  : g === 'FEMALE'
                                    ? 'bg-[#D8C9E6]'
                                    : 'bg-gray-100'
                              }`}
                            >
                              <img src={person} alt="person" className="h-3 md:h-4 aspect-auto" />
                              {g === 'MALE'
                                ? 'Male Outfits'
                                : g === 'FEMALE'
                                  ? 'Female Outfits'
                                  : g}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs px-2 py-1 rounded-full hidden bg-gray-100 text-gray-700"></span>
                        )}
                      </div>
                    </div>
                    {/* Location & distance */}
                    <div>
                      <div className="text-xs text-[#323232B2] mb-1 font-semibold flex items-center gap-2">
                        <img src={location} alt="location" className="h-4 md:h-4 aspect-auto" />
                        Location
                      </div>
                      <div className="text-[.8rem] text-[#51524e] font-medium">
                        {detail?.address_details?.address ? (
                          <>
                            {detail?.address_details?.address?.addressLine1
                              ? detail?.address_details?.address?.addressLine1 + ', '
                              : ''}
                            {detail?.address_details?.address?.addressLine2
                              ? detail?.address_details?.address?.addressLine2 + ', '
                              : ''}
                            {detail?.address_details?.address?.city
                              ? detail?.address_details?.address?.city + ', '
                              : ''}
                            {detail?.address_details.address.state
                              ? detail.address_details.address.state + ', '
                              : ''}
                            {detail?.address_details.address.country || ''}
                          </>
                        ) : (
                          'Location not provided'
                        )}
                      </div>
                      {typeof detail?.address_details?.distance === 'number' && (
                        <div className="text-[.9rem] text-[#41423CCC] mt-1">
                          {detail.address_details.distance} Km Away
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      {filtersData?.outfit_filter && (
                        <div className=" w-full mb-6 py-4 bg-white md:block hidden ">
                          {/* Outfit type */}
                          <div>
                            <div className="font-semibold text-[.9rem] mb-2 flex items-center justify-between">
                              Outfit type
                            </div>
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {filtersData?.outfit_filter.map((outfit: any) => (
                                <label
                                  key={outfit.index}
                                  className="flex items-center text-[#323232] text-[.8rem] font-[500] gap-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    className="accent-[#4D7AFF]"
                                    checked={selectedOutfits.includes(outfit.index)}
                                    onChange={() => {
                                      setSelectedOutfits((prev) =>
                                        prev.includes(outfit.index)
                                          ? prev.filter((i) => i !== outfit.index)
                                          : [...prev, outfit.index]
                                      );
                                      // Reset suboutfits if outfit is deselected

                                      if (selectedOutfits.includes(outfit.index)) {
                                        setSelectedSubOutfits((prev) =>
                                          prev.filter(
                                            (subIdx) =>
                                              !Object.keys(outfit.sub_outfits)
                                                .map(Number)
                                                .includes(subIdx)
                                          )
                                        );
                                      }
                                    }}
                                  />
                                  {outfit.name}
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* Sub Outfit type */}
                          {(() => {
                            // Gather all sub outfits from all selected outfits and show in a single section
                            const allSubOutfits: { subIdx: number; subName: string }[] = [];
                            filtersData?.outfit_filter
                              .filter((outfit: any) => selectedOutfits.includes(outfit.index))
                              .forEach((outfit: any) => {
                                Object.entries(outfit.sub_outfits).forEach(([subIdx, subName]) => {
                                  allSubOutfits.push({
                                    subIdx: Number(subIdx),
                                    subName: subName as string,
                                  });
                                });
                              });

                            // Remove duplicates by subIdx
                            const uniqueSubOutfits = Array.from(
                              new Map(allSubOutfits.map((item) => [item.subIdx, item])).values()
                            );

                            if (uniqueSubOutfits.length === 0) {
                              return null;
                            }

                            return (
                              <div className="mb-2">
                                <div className="font-semibold text-[.9rem] mb-2 flex items-center justify-between">
                                  Sub Outfit type
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {uniqueSubOutfits.map(({ subIdx, subName }) => (
                                    <label
                                      key={subIdx}
                                      className="flex items-center text-[#323232] text-[.8rem] font-[500]  gap-2 cursor-pointer p-[.1rem]"
                                    >
                                      <input
                                        type="checkbox"
                                        className="accent-[#4D7AFF]"
                                        checked={selectedSubOutfits.includes(subIdx)}
                                        onChange={() => {
                                          setSelectedSubOutfits((prev) =>
                                            prev.includes(subIdx)
                                              ? prev.filter((i) => i !== subIdx)
                                              : [...prev, subIdx]
                                          );
                                        }}
                                      />
                                      {subName}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            );
                          })()}

                          {/* Color filter */}
                          <div className="mt-4">
                            <div className=" mb-2 font-semibold text-[.9rem] flex items-center justify-between">
                              Select Colors
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {filtersData.color_filter &&
                                Object.entries(filtersData.color_filter).map(
                                  ([colorCode, colorName]) => (
                                    <button
                                      key={colorCode}
                                      type="button"
                                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                                        selectedColors.includes(colorCode)
                                          ? 'border-[#79539f]'
                                          : 'border-gray-200'
                                      }`}
                                      style={{ backgroundColor: `#${colorCode}` }}
                                      title={colorName as string}
                                      onClick={() => {
                                        setSelectedColors((prev) =>
                                          prev.includes(colorCode)
                                            ? prev.filter((c) => c !== colorCode)
                                            : [...prev, colorCode]
                                        );
                                      }}
                                    >
                                      {selectedColors.includes(colorCode) && (
                                        <span className="text-white text-xs">&#10003;</span>
                                      )}
                                    </button>
                                  )
                                )}
                            </div>
                          </div>

                          <button
                            className="mt-4 w-full bg-[#79539f] text-white rounded-md py-2 font-semibold"
                            onClick={() => {
                              if (detail && detail.port_folio_id) {
                                fetchFilteredOutfits(
                                  detail.port_folio_id,
                                  selectedOutfits,
                                  selectedSubOutfits,
                                  selectedColors
                                );
                              }
                            }}
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Right: gallery + fetchable backend details */}
            {viewStage === 'INFO' ? (
              <>
                <div className="md:w-[60%] w-full h-full md:pb-[2rem] pb-[3rem] ">
                  <div className="w-full h-64 md:h-[350px] bg-gray-100 rounded-lg overflow-hidden md:block hidden">
                    {detailLoading && (
                      <div className="text-sm text-gray-500 w-full flex items-center justify-center">
                        Loading full profile…
                      </div>
                    )}

                    {detailError && (
                      <div className="text-sm text-red-500">
                        Error loading profile: {detailError}
                      </div>
                    )}

                    {detail?.base_info ? (
                      <img
                        src={detail?.base_info?.cover_picture_url}
                        alt={`${selected.tailorName} cover`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        {!detailLoading && (
                          <div className="text-sm text-gray-400 mt-3">
                            Click this panel to load full profile from backend
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* images (if any) */}
                  {detail?.images && Array.isArray(detail?.images) && detail?.images.length > 0 && (
                    <div>
                      {/* <div className="text-xs text-gray-500 mb-1">Gallery</div> */}
                      <div className="grid grid-cols-3 gap-3 mt-[1rem]">
                        {detail?.images.map((imgUrl: string, idx: number) => (
                          <img
                            key={idx}
                            src={imgUrl}
                            className="w-full h-[8rem] object-cover rounded-md"
                            alt=""
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="w-full h-[80px] md:hidde block text-white">ni</div>
                </div>
              </>
            ) : (
              <>
                <div className="md:w-[60%] w-full h-full ">
                  <div className=" w-full custom-scrollbar md:overflow-y-auto h-full md:max-h-[calc(100vh-1px)] ">
                    <div className="w-full h-fit rounded-lg md:overflow-hidden p-2">
                      {/* Outfit Type Filter Buttons */}
                      <div className="flex gap-2 mb-6 flex-wrap">
                        {/* All button first */}
                        <button
                          className={`px-4 py-2 rounded-full font-semibold text-sm transition-all focus:outline-none
                          ${
                            selectedOutfitsr.length === 0
                              ? 'bg-gray-700 text-white shadow'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                          onClick={() => {
                            // const allOutfits = filtersData.outfit_filter.map((o: any) => o.index);
                            setSelectedOutfitsr([]);
                            fetchFilteredOutfits(
                              detail.port_folio_id,
                              [],
                              selectedSubOutfits,
                              selectedColors
                            );
                          }}
                        >
                          All
                        </button>
                        {/* Individual outfit type buttons */}
                        {filtersData?.outfit_filter?.map((outfit: any) => (
                          <button
                            key={outfit.index}
                            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all focus:outline-none
                            ${
                              selectedOutfitsr.includes(outfit.index)
                                ? 'bg-gray-700 text-white shadow'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            onClick={() => {
                              setSelectedOutfitsr((prev: number[]) => {
                                if (prev.includes(outfit.index)) {
                                  // Deselect and remove from array, change color, and call API
                                  const updated = prev.filter((i) => i !== outfit.index);

                                  if (detail && detail.port_folio_id) {
                                    fetchFilteredOutfits(
                                      detail.port_folio_id,
                                      updated,
                                      selectedSubOutfits,
                                      selectedColors
                                    );
                                  }

                                  return updated;
                                } else {
                                  // Select and call API
                                  const updated = [outfit.index];

                                  if (detail && detail.port_folio_id) {
                                    fetchFilteredOutfits(
                                      detail.port_folio_id,
                                      updated,
                                      selectedSubOutfits,
                                      selectedColors
                                    );
                                  }

                                  return updated;
                                }
                              });
                            }}
                          >
                            {outfit.name}
                          </button>
                        ))}
                      </div>
                      {/* End Outfit Type Filter Buttons */}
                      {filteredOutfitsLoading && (
                        <div className="text-sm text-gray-500 w-full flex items-center justify-center">
                          Loading full profile…
                        </div>
                      )}

                      {filteredOutfitsError && (
                        <div className="text-sm text-red-500">
                          Error loading profile: {filteredOutfitsError}
                        </div>
                      )}

                      {filteredOutfits?.outfit_details &&
                      filteredOutfits?.outfit_details.length > 0 ? (
                        filteredOutfits?.outfit_details.map((outfit) => (
                          <div key={outfit.outfit_type} className="mb-6">
                            <h4 className="font-semibold mb-2">{outfit.outfit_type}</h4>

                            <div className=" flex flex-col w-full gap-4">
                              {outfit?.portfolio_outfits.map((item) => (
                                <div key={item.id} className="mb-4 w-full">
                                  <div className="mt-1 text-[.9rem] font-medium">{item.title}</div>
                                  <div className="text-xs text-[#525252] mb-2">
                                    {item.creation_time}
                                  </div>
                                  {/* First image */}
                                  <div className="w-full h-[60vh] md:h-[55vh] flex items-start  justify-center overflow-hidden rounded-[20px] md:rounded-[10px]">
                                    {item.image_url && item.image_url.length > 0 && (
                                      <img
                                        src={item.image_url[selectedImageIndexes[item.id] ?? 0]}
                                        alt={item.title}
                                        className=" object-fill h-full"
                                      />
                                    )}
                                  </div>

                                  {/* More images (if any) */}
                                  {item.image_url && item.image_url.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 mt-[1rem]">
                                      {item.image_url?.map((img, idx) => (
                                        <img
                                          key={idx}
                                          src={img}
                                          alt={`${item.title} extra ${idx + 1}`}
                                          className={`w-full h-[8rem] object-fill rounded-md cursor-pointer ${
                                            (selectedImageIndexes[item.id] ?? 0) === idx
                                              ? 'ring-2 ring-[#79539f]'
                                              : ''
                                          }`}
                                          onClick={() => {
                                            setSelectedImageIndexes((prev) => ({
                                              ...prev,
                                              [item.id]: idx,
                                            }));
                                          }}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-center py-8">
                          No filtered outfits found.
                        </div>
                      )}

                      <div className="w-full h-[80px] md:hidde block text-white">ni</div>
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* {showMobilePreview && window.innerWidth < 768 && (
              <div className="absolute left-0 right-0 bottom-4 flex justify-center items-center gap-2 z-10">
                {portfolios.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      idx === currentDesignerIndex ? 'bg-[#79539f]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )} */}

            {showSwapDiv && (
              <div className="md:hidden block absolute top-[150px] left-0 right-0 flex items-center justify-between px-4 ">
                <img
                  src={left_swap}
                  alt="Left Swap"
                  className="w-[150px] aspect-auto cursor-pointer"
                />
                <img
                  src={right_swap}
                  alt="Right Swap"
                  className="w-[150px] aspect-auto cursor-pointer"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {/* YouTube Modal */}
      {showqr && (
        <div className="fixed w-screen h-[100vh] inset-0 bg-[#0000009a] bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg   max-h-[90vh] overflow-hidden relative p-6">
            <button
              onClick={() => setShowqr(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black z-10 bg-white rounded-full p-2 shadow-lg"
            >
              <FaTimes size={20} />
            </button>
            <QRCode
              size={260}
              bgColor="white"
              fgColor="black"
              value={`${ap}designer/${selected?.userName}` || ''}
            />
            <p className="mx-auto text-center font-semibold text-[1.2rem] mt-4"> QR Portfolio</p>
          </div>
        </div>
      )}
    </div>
  );
}
