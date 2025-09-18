import React, { useEffect, useState, useRef } from 'react';
import './sidebar.css';
import location from '../../assets/images/location_on.png';
import person from '../../assets/images/Vector1.png';
import male from '../../assets/images/male.png';
import qr from '../../assets/images/qr_code_scanner.png';
import share from '../../assets/images/share.png';
import copy from '../../assets/images/content_copy.png';
import female from '../../assets/images/Group.png';
import facebook from '../../assets/images/facebook.png';
import whatapp from '../../assets/images/whatsapp3.png';
import glove from '../../assets/images/Vector3.png';
import insta from '../../assets/images/Clip path group.png';
import upi from '../../assets/images/Frame 1000010260.png';
import map from '../../assets/images/google-maps.png';
import info from '../../assets/images/workflow.png';
import portfolio from '../../assets/images/album.png';

import { api } from '../../utils/apiRequest';

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
  const [filtersError, setFiltersError] = useState<string | null>(null);

  const [selectedOutfits, setSelectedOutfits] = useState<number[]>([]);
  const [selectedSubOutfits, setSelectedSubOutfits] = useState<number[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

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
    const tailorId = detail?.tailor_id ?? undefined;

    setDetail(null);
    setDetailError(null);
    setDetailLoading(false);
    setLastFetchedUsername(null);

    setFiltersData(null);
    setFiltersError(null);

    if (!username) {
      return;
    }

    // fetch profile and filters (can be parallel)
    fetchByUsername(username);
    fetchFiltersByUsername(username, tailorId);
  }, [selected?.userName]);

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
      const res = await api.getRequest(
        `portfolio/fetch-by-username?username=${encodeURIComponent(username)}`
      );

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

    setFiltersError(null);

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
      setFiltersError(err?.message || 'Failed to load filters');
      setFiltersData(null);
    }
  };

  // eslint-disable-next-line no-console
  console.log(filtersData, filtersError);

  return (
    <div className={`w-full flex gap-2 md:px-1 p-1 ${className}`}>
      <aside
        ref={listRef}
        className="md:w-1/3 w-full max-h-[calc(100vh-72px)] custom-scrollbar overflow-y-auto border rounded-lg p-3 bg-white"
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
          <input
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search designers"
            className="w-full px-3 py-2 rounded-md bg-gray-100 text-sm"
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
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
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
                            className="text-xs flex items-center gap-2 px-2 py-1 rounded-full bg-gray-100 text-gray-700"
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
      </aside>

      <section className="flex-1 border rounded-lg p-4 bg-white max-h-[calc(100vh-72px)] custom-scrollbar overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a portfolio on the left to view details
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row gap-8">
            {/* Left: owner & meta */}
            <div className="md:w-[40%] w-full flex flex-col gap-4">
              <div className="flex flex-col w-full items-center gap-3 p-3 borde rounded-lg bg-gray-50 shadow shadow-[#00000040]">
                <div className="flex items-center gap-3 w-full ">
                  {detail?.base_info?.profile_picture_url ? (
                    <img
                      src={detail?.base_info?.profile_picture_url}
                      alt="profile"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-700">
                        {(selected.tailorName && selected.tailorName.charAt(0).toUpperCase()) ||
                          '?'}
                      </span>
                    </div>
                  )}
                  <div className=" w-full flex  items-center justify-between   ">
                    <div>
                      <div className="font-semibold text-nowrap">{selected.tailorName}</div>
                      <div className="text-sm text-gray-500">{selected.userName}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <img src={copy} alt="copy" className="h-3 md:h-4 aspect-auto" />
                      <img src={share} alt="share" className="h-3 md:h-4 aspect-auto" />
                      <img src={qr} alt="qr" className="h-3 md:h-4 aspect-auto" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full justify-center">
                  <img src={facebook} alt="copy" className="h-4 md:h-5 aspect-auto" />
                  <img src={insta} alt="copy" className="h-4 md:h-5 aspect-auto" />
                  <img src={glove} alt="copy" className="h-4 md:h-5 aspect-auto" />
                  <img src={whatapp} alt="copy" className="h-4 md:h-5 aspect-auto" />
                  <img src={upi} alt="copy" className="h-4 md:h-5 aspect-auto" />
                  <img src={map} alt="copy" className="h-4 md:h-5 aspect-auto" />
                </div>
              </div>

              {/* stage toggle buttons */}
              <div className="flex items-center gap-3 mb-4 w-full ">
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
                    <img src={info} alt="info" className="h-6 md:h-7 aspect-auto" />
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
                    <div>
                      <img src={portfolio} alt="portfolio" className="h-6 md:h-7 aspect-auto" />
                    </div>
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

              {/* About */}
              {detail?.info?.about && (
                <div>
                  <div className="text-xs text-[#323232B2] mb-1 font-semibold">About</div>
                  <div className="text-sm text-[#41423C] font-semibold">{detail?.info?.about}</div>
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
                            className="text-xs px-2 py-1 rounded-full bg-[#4D7AFF4A] text-[#525252]"
                          >
                            {g === 'MALE' ? 'Male Outfits' : g === 'FEMALE' ? 'Female Outfits' : g}
                          </span>
                        ))
                      ) : (
                        <>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#4D7AFF4A] text-[#525252] flex items-center gap-2">
                            <img src={female} alt="person" className="h-3 md:h-4 aspect-auto" />
                            Female Outfits
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#4D7AFF4A] text-[#525252] flex items-center gap-2">
                            <img src={male} alt="person" className="h-3 md:h-4 aspect-auto" />
                            Male Outfits
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Location & distance */}
                  <div>
                    <div className="text-xs text-[#323232B2] mb-1 font-semibold flex items-center gap-2">
                      <img src={location} alt="location" className="h-4 md:h-4 aspect-auto" />
                      Location
                    </div>
                    <div className="text-[.9rem] text-[#41423C] font-semibold">
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
                      <div className=" w-full mb-6 py-4 bg-white ">
                        {/* Outfit type */}
                        <div>
                          <div className="font-semibold text-[.9rem] mb-2 flex items-center justify-between">
                            Outfit type
                          </div>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {filtersData.outfit_filter.map((outfit: any) => (
                              <label
                                key={outfit.index}
                                className="flex items-center text-[#323232] text-[.8rem] font-[500] gap-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
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
                          filtersData.outfit_filter
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
                                    className="flex items-center text-[#323232] text-[.8rem] font-[500]  gap-2 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
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
                            // You can handle filter apply here
                            // Example: console.log(selectedOutfits, selectedSubOutfits, selectedColors);
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

            {/* Right: gallery + fetchable backend details */}
            <div className="md:w-[60%] w-full">
              <div className="w-full h-64 md:h-[350px] bg-gray-100 rounded-lg overflow-hidden">
                {detail?.base_info ? (
                  <img
                    src={detail?.base_info?.cover_picture_url}
                    alt={`${selected.tailorName} cover`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
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

              <div className="mt-4 hidden">
                {detailLoading && (
                  <div className="text-sm text-gray-500">Loading full profile…</div>
                )}

                {detailError && (
                  <div className="text-sm text-red-500">Error loading profile: {detailError}</div>
                )}

                {detail ? (
                  <div className="mt-3 grid grid-cols-1 gap-4">
                    {/* header */}
                    <div className="flex items-start gap-4">
                      {detail.base_info?.profile_picture_url && (
                        <img
                          src={detail.base_info.profile_picture_url}
                          alt="profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <div className="font-semibold text-lg">
                          {detail.base_info?.boutique_name || detail.base_info?.tailor_name}
                        </div>
                        <div className="text-sm text-gray-500">{detail.base_info?.user_name}</div>
                      </div>
                    </div>

                    {/* Social */}
                    {detail.social_media_handlers && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Social</div>
                        <div className="flex gap-3 items-center">
                          {detail.social_media_handlers.instagram && (
                            <a
                              href={detail.social_media_handlers.instagram}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-[#79539f] underline"
                            >
                              Instagram
                            </a>
                          )}
                          {detail.social_media_handlers.whatsapp && (
                            <span className="text-sm text-gray-600">
                              WhatsApp: {detail.social_media_handlers.whatsapp}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* images (if any) */}
                    {detail.images && Array.isArray(detail.images) && detail.images.length > 0 && (
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Gallery</div>
                        <div className="grid grid-cols-3 gap-3">
                          {detail.images.map((imgUrl: string, idx: number) => (
                            <img
                              key={idx}
                              src={imgUrl}
                              className="w-full h-24 object-cover rounded-md"
                              alt=""
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  !detailLoading && (
                    <div className="text-sm text-gray-400 mt-3">
                      Click this panel to load full profile from backend
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
