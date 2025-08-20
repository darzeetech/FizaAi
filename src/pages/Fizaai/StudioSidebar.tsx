'use client';

import React, { useEffect, useState, useRef } from 'react';
import { format, isToday } from 'date-fns';
import sidebar from '../../assets/images/view_sidebar.png';
import search from '../../assets/images/Frame 1000010377.png';
import design from '../../assets/images/design.png';
import coins from '../../assets/images/coins.png';
import './sidebar.css';
import UserProfile from './userProfile';
import { FaChevronDown, FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

interface StudioSidebarProps {
  setShowStudio: (val: boolean) => void;
  generatedImageUrl: string | null;
  onVersionSelect: (entry: VersionData) => void;
  showProfile: boolean;
  setShowProfile: (val: boolean) => void;
  items: VersionData[];
  onNewOutfit: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface VersionData {
  id: number;
  data: string;
  version: number;
  parentId: number | null;
  createdAt: string;
  imageUrl: string;
  userId: number;
  children?: number | null;
}

const StudioSidebar: React.FC<StudioSidebarProps> = ({
  setShowStudio,
  generatedImageUrl,
  onVersionSelect,
  showProfile,
  setShowProfile,
  items,
  onNewOutfit,
  currentStep,
  setCurrentStep,
}) => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedVersionRef = useRef<HTMLDivElement>(null);

  const groupByDateAndParent = (data: VersionData[]) => {
    const parentMap: Record<number, VersionData[]> = {};
    const roots = data.filter((d) => d.parentId === null);
    const children = data.filter((d) => d.parentId !== null);

    for (const parent of roots) {
      parentMap[parent.id] = [parent];
    }

    for (const child of children) {
      if (child.parentId && parentMap[child.parentId]) {
        parentMap[child.parentId].push(child);
      }
    }

    const groupedByDate: Record<string, VersionData[][]> = {};

    for (const parent of roots) {
      const group = parentMap[parent.id];
      group.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      const label = isToday(new Date(group[0].createdAt))
        ? 'Today'
        : format(new Date(group[0].createdAt), 'dd MMM, yyyy');

      if (!groupedByDate[label]) {
        groupedByDate[label] = [];
      }

      groupedByDate[label].push(group);
    }

    return groupedByDate;
  };

  const groupedItems = groupByDateAndParent(items);

  // user info
  const storedData = localStorage.getItem('fizaaiuser');
  let fullName = '';

  if (storedData) {
    try {
      const userData = JSON.parse(storedData);
      const firstName = userData?.user?.first_name || '';
      const lastName = userData?.user?.last_name || '';
      fullName = `${firstName} ${lastName}`.trim() || fullName;
    } catch {
      // eslint-disable-next-line no-console
      console.error('Invalid user data in localStorage');
    }
  }

  const username = fullName;
  const userInitial = username.charAt(0).toUpperCase();

  function formatOutfit(outfit: string): string {
    if (!outfit) {
      return '';
    }

    return outfit
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  const filteredGroupedItems = Object.entries(groupedItems).reduce(
    (acc, [dateLabel, groups]) => {
      const filteredGroups = groups.filter((group) => {
        const parent = group[0];
        const outfit = formatOutfit(JSON.parse(parent.data)?.selectedOutfit || '');

        return outfit.toLowerCase().includes(searchQuery.toLowerCase());
      });

      if (filteredGroups.length > 0) {
        acc[dateLabel] = filteredGroups;
      }

      return acc;
    },
    {} as Record<string, VersionData[][]>
  );

  useEffect(() => {
    if (showProfile) {
      setSearchMode(false);
      setSearchQuery('');
    }
  }, [showProfile]);

  useEffect(() => {
    if (selectedVersionRef.current) {
      selectedVersionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [generatedImageUrl]);

  return (
    <div className="w-[300px] min-w-[260px] h-[100dvh] bg-[#F9F6F1] border-r shadow-md fixed left-0 top-0 z-40 flex flex-col">
      {/* Header (Hidden when user profile is open) */}
      {!showProfile && (
        <div className="sticky top-0 z-10 bg-[#F9F6F1] px-4 pt-4 pb-2">
          <div className="flex items-center justify-between">
            {/* Sidebar icon hidden in search mode */}
            {!searchMode && (
              <img
                src={sidebar}
                alt="Sidebar"
                className="h-6 md:h-10 cursor-pointer"
                onClick={() => setShowStudio(false)}
              />
            )}

            {/* Right side icons */}
            <div className="flex items-center gap-3 ml-auto">
              {searchMode ? (
                // 🔍 Search bar with search + input + cross, all INSIDE pill
                <div className="flex items-center bg-[#E6D7C3] px-3 py-[6px] rounded-full w-[250px]">
                  <FaSearch className="text-[#4F2945] text-sm mr-2" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none text-sm text-[#4F2945] placeholder-[#4F2945] flex-1"
                  />
                  <IoClose
                    className="text-[#A34D88] text-lg cursor-pointer ml-1"
                    onClick={() => {
                      setSearchMode(false);
                      setSearchQuery('');
                    }}
                  />
                </div>
              ) : (
                <img
                  src={search}
                  alt="Search"
                  className="h-6 md:h-10 cursor-pointer"
                  onClick={() => setSearchMode(true)}
                />
              )}
              {/* Always visible Design icon */}
              <img
                src={design}
                alt="Design"
                className={`h-6 md:h-10 cursor-pointer ${searchMode ? 'mr-2' : ''}`}
                onClick={() => {
                  onNewOutfit();
                  setShowStudio(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      {showProfile ? (
        <UserProfile
          showProfile={showProfile}
          setShowProfile={setShowProfile}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          setShowStudio={setShowStudio}
        />
      ) : (
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar py-[1rem] pb-[2rem] hidde">
          <div className="space-y-6">
            {Object.entries(filteredGroupedItems).map(([dateLabel, versionGroups]) => (
              <div key={dateLabel}>
                {versionGroups.map((group) => {
                  const parent = group[0];
                  const parentData = JSON.parse(parent.data);
                  const outfit = parentData?.selectedOutfit || 'Outfit';

                  return (
                    <div key={parent.id} className="mb-4">
                      <div className="flex justify-between items-start text-sm text-[#000000] font-semibold mb-1">
                        <p className="text-[#000000]">{formatOutfit(outfit)}</p>
                        <p className="flex items-center gap-1 text-xs font-medium">
                          <img src={coins} className="w-4" alt="coin" />
                          Total Used <span className="ml-1 font-bold text-sm">{group.length}</span>
                        </p>
                      </div>

                      {group.map((entry) => {
                        const createdAt = new Date(entry.createdAt);
                        const timeLabel = isToday(createdAt)
                          ? `Today, ${format(createdAt, 'p')}`
                          : `${format(createdAt, 'dd MMM, yyyy')}, ${format(createdAt, 'p')}`;
                        const isSelected = generatedImageUrl === entry.imageUrl;

                        return (
                          <div
                            key={entry.id}
                            ref={isSelected ? selectedVersionRef : null}
                            onClick={() => {
                              onVersionSelect(entry);

                              if (window.innerWidth < 768) {
                                setShowStudio(false);
                              }
                            }}
                            className={`pl-3 pr-2 py-1 mb-[2px] rounded-md cursor-pointer text-[12px] transition-all duration-150 ${
                              isSelected
                                ? 'bg-[#F3EDE6] text-black font-semibold'
                                : 'text-[#000000] opacity-80 hover:text-[#A34D88]'
                            }`}
                          >
                            Version {entry.version} &nbsp;&nbsp; {timeLabel}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {!showProfile && (
        <div className="sticky bottom-0 bg-[#F9F6F1] py-3 border-t border-[#E0D6CF] z-50 px-0">
          <div className="flex items-center justify-start gap-2 pl-4">
            <div className="w-8 h-8 rounded-full bg-[#4F2945] flex items-center justify-center text-white text-sm font-bold">
              {userInitial}
            </div>
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setShowProfile(true)}
            >
              <span className="text-sm font-medium text-black">{username}</span>
              <span className="text-black  hover:underline">
                <FaChevronDown size={14} />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudioSidebar;
