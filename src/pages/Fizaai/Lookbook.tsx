import React, { useEffect, useState } from 'react';
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
};

type Props = {
  portfolios: Portfolio[];
  loading?: boolean;
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
  selected = null,
  onSelect,
  onRefresh,
  onLoadMore,
  searchTerm = '',
  onSearchChange,
  pageInfo,
  className = '',
}: Props) {
  const [detail, setDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [lastFetchedUsername, setLastFetchedUsername] = useState<string | null>(null);

  // reset detail when a different portfolio is selected so user can fetch fresh data by clicking right pane
  useEffect(() => {
    setDetail(null);
    setDetailError(null);
    setDetailLoading(false);
    setLastFetchedUsername(null);
    fetchByUsername(selected?.userName || '');
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
  //

  return (
    <div className={`w-full flex gap-2 md:px-1 p-1 ${className}`}>
      <aside className="md:w-1/3 w-full max-h-[calc(100vh-72px)] custom-scrollbar overflow-y-auto border rounded-lg p-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Designers</h3>
          <div className="flex items-center gap-2">
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

        {loading ? (
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

        {onLoadMore && pageInfo && pageInfo.currentPage! < (pageInfo.totalPages || 1) && (
          <div className="mt-3 text-center">
            <button
              onClick={onLoadMore}
              className="px-4 py-2 bg-[#79539f] text-white rounded-md text-sm"
            >
              Load more
            </button>
          </div>
        )}
      </aside>

      <section className="flex-1 border rounded-lg p-4 bg-white max-h-[calc(100vh-72px)] custom-scrollbar overflow-y-auto ">
        {!selected ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a portfolio on the left to view details
          </div>
        ) : (
          <div className="w-full h-full flex flex-col md:flex-row gap-8">
            {/* Left: owner & meta */}
            <div className="md:w-1/3 w-full flex flex-col gap-4">
              <div className="flex flex-col w-full items-center gap-3 p-3 borde rounded-lg bg-gray-50 shadow shadow-[#00000040]">
                {/* <img
                  src={selected.profilePictureUrl || '/placeholder-avatar.png'}
                  alt={`${selected.tailorName} owner`}
                  className="w-14 h-14 rounded-full object-cover"
                /> */}
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
              {/* About */}
              {detail?.info?.about && (
                <div>
                  <div className="text-xs text-[#323232B2] mb-1 font-semibold">About</div>
                  <div className="text-sm text-[#41423C] font-semibold">{detail?.info?.about}</div>
                </div>
              )}

              <div className="">
                <div className="text-xs text-[#323232B2] mb-1 font-semibold">Type</div>
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
                <div className="text-[1rem] text-[#41423C] font-semibold">
                  {detail?.address_details?.address ? (
                    <>
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
            </div>

            {/* Right: gallery + fetchable backend details */}
            <div
              className="md:w-2/3 w-full"
              //   onClick={() => {
              //     // call backend API when user clicks the right-side panel (per request)
              //     if (selected?.userName) {
              //       fetchByUsername(selected.userName);
              //     }
              //   }}
            >
              <div className="w-full h-64 md:h-[350px] bg-gray-100 rounded-lg overflow-hidde">
                {selected.coverPictureUrl ? (
                  <img
                    src={selected.coverPictureUrl}
                    alt={`${selected.tailorName} cover`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-3 w-full">
                <img
                  src={selected.coverPictureUrl || '/placeholder.png'}
                  alt=""
                  className=" w-1/3 aspect-auto object-cover rounded-md"
                />
                <img
                  src={selected.coverPictureUrl || '/placeholder.png'}
                  alt=""
                  className=" w-1/3 aspect-auto object-cover rounded-md"
                />
                <img
                  src={selected.coverPictureUrl || '/placeholder.png'}
                  alt=""
                  className=" w-1/3 aspect-auto object-cover rounded-md"
                />
              </div>

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
