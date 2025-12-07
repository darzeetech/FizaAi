'use client';

import { useState, useEffect, useRef } from 'react';
import BulkImageUploadField from '../../components/FormComponents/BulkImageUploadField';
import BulkImageUploadFieldp from '../../components/FormComponents/BulkImageUploadFieldp';
import './sidebar.css';
import Lookbook, { Portfolio as LookbookPortfolio } from './Lookbook';
import Favourites from './Favourites/faviourites';

import Collective from './Collective';

// Use the Portfolio type from Lookbook
type Portfolio = LookbookPortfolio;

//import Image from "next/image"
import {
  FaArrowRight,
  FaCheckCircle,
  FaChevronDown,
  FaMinus,
  FaPlus,
  FaSync,
  FaSearch,
  FaEye,
  FaEnvelope,
  FaTelegramPlane,
  FaTwitter,
  FaFacebookF,
  FaCopy,
  FaTimes,
} from 'react-icons/fa';
import { LuLink } from 'react-icons/lu';

import aiimage from '../../assets/images/ai.png';
import coins from '../../assets/images/coins.png';
import share from '../../assets/images/share1.png';
import download from '../../assets/images/download.png';
import whatapp from '../../assets/images/whatsapp1.png';
import woman from '../../assets/images/woman.png';
import preview from '../../assets/images/preview.png';
import sidebar from '../../assets/images/view_sidebar.png';

import design from '../../assets/images/design.png';
import lookbook from '../../assets/images/Style.png';
//import share from '../../assets/images/share.png';
import { FaSyncAlt } from 'react-icons/fa';
import Ai_refresh from '../../assets/icons/Ai_Loader.gif';
import Ai_refresh1 from '../../assets/icons/AI_Refresh.gif';
import { api } from '../../utils/apiRequest';
import SignupFlow from './signup-flow';
import TokenPopup from './TokenPopup';
import StudioSidebar from './StudioSidebar';
import { getValueFromLocalStorage } from '../../utils/common';
import { TiArrowLeft } from 'react-icons/ti';
import { HexColorPicker } from 'react-colorful';
import designerone from '../../assets/icons/designerone.png';
import designertwo from '../../assets/icons/designertwo.png';
import designerthree from '../../assets/icons/designerthree.png';
import { toast } from 'react-toastify';

type SkinColor = {
  id: number;
  colorCode: string;
  red: string;
  green: string;
  blue: string;
};

type WeightUnit = {
  id: number;
  weightUnit: string;
};

type HeightUnit = {
  id: number;
  heightUnit: string;
};

type BodyType = {
  id: number;
  bodyType: string;
  imageUrl: string | null;
  genderId: number;
};

// Define types for our form data
type FormDataSection1 = {
  first_name: string;
  last_name: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
  bodyType: string;
  skinColor: string;
  weightUnit: string;
  heightUnit: string;
  profilePicture: Array<Record<string, string>> | undefined;
};

// Define stitch option types
type StitchOptionRadio = {
  id: number;
  type: 'radio';
  label: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

type StitchOptionCounter = {
  id: number;
  type: 'counter';
  label: string;
  min_value: string;
  max_value: string;
};

type StitchOption = StitchOptionRadio | StitchOptionCounter;

type StitchOptionGroup = {
  side: string;
  stitch_options: StitchOption[];
};

// Update the FormDataSection234 type definition to include colorFabricInstructions
type FormDataSection234 = {
  aboutYou: FormDataSection1;
  selectedOutfit: string | null;
  topColor: string | null;
  bottomColor: string | null;
  fabricImageTop: Array<Record<string, string>> | undefined;
  fabricImageBottom: Array<Record<string, string>> | undefined;
  colorFabricInstructions: string;
  specialInstructions: string;
  // Change to use label as key instead of ID
  stitchOptions: Record<string, string | number | null>;
};

// Define outfit option type
type OutfitOption = {
  outfit_index: number;
  outfit_name: string;
  outfit_details_title: string;
  outfit_link: string;
  pieces: number;
  stitch_options_exist: boolean;
  outfit_type: string;
  portfolio_eligible: boolean;
};

interface VersionDataa {
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
  // Additional/derived fields from your input context:
  addedToFav?: boolean;
  coinUsed?: number;
  favCount?: number;
  originId?: number;
  platForm?: string;
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

interface VersionData {
  id: number;
  data: string;
  version: number;
  parentId: number | null;
  createdAt: string;
  imageUrl: string;
  userId: number;
  children?: number | null;
  collective: boolean;
  likeCount: number | null;
  likedByCurrentUser: boolean;
  prof_pic: string | null;
}

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

// Add color options array after outfitOptions
const colorOptions = [
  { id: 'blue', color: '#5578dc' },
  { id: 'red', color: '#e74c3c' },
  { id: 'green', color: '#32a071' },
  { id: 'purple', color: '#79539f' },
  { id: 'black', color: '#323232' },
  { id: 'white', color: '#ffffff' },
];

export default function FizaAI() {
  // Current step (1: About You, 2: Select Outfit, 3: Color, 4: Stitch Options)
  const [currentStep, setCurrentStep] = useState(1);
  const [outfitOptions, setOutfitOptions] = useState<OutfitOption[]>([]);
  const [stitchOptionGroups, setStitchOptionGroups] = useState<StitchOptionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStitchOptions, setLoadingStitchOptions] = useState(false);
  const [loadingImageVersion, setLoadingImageVersion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [outfit_index, setoutfit_index] = useState<number | undefined>(undefined);

  // Add these state variables after the existing useState declarations
  const [skinColors, setSkinColors] = useState<SkinColor[]>([]);
  const [loadingSkinColors, setLoadingSkinColors] = useState(false);

  // Add these state variables after the existing useState declarations
  const [weightUnits, setWeightUnits] = useState<WeightUnit[]>([]);
  const [loadingWeightUnits, setLoadingWeightUnits] = useState(false);
  const [isWeightUnitDropdownOpen, setIsWeightUnitDropdownOpen] = useState(false);

  const [heightUnits, setHeightUnits] = useState<HeightUnit[]>([]);
  const [loadingHeightUnits, setLoadingHeightUnits] = useState(false);
  const [isHeightUnitDropdownOpen, setIsHeightUnitDropdownOpen] = useState(false);

  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [loadingBodyTypes, setLoadingBodyTypes] = useState(false);
  const [popup, setpopup] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState<string>('');
  const [coinBalance, setCoinBalance] = useState<number>(0);
  const [showStudio, setShowStudio] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'studio' | 'lookbook'>(
    () =>
      (typeof window !== 'undefined' &&
        (localStorage.getItem('selected_tab') as 'studio' | 'lookbook')) ||
      'studio'
  );

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInn, setIsLoggedInn] = useState(false);
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [currentVersionEntry, setCurrentVersionEntry] = useState<VersionData | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [items, setItems] = useState<VersionData[]>([]);
  const [selectlookbook, setSelectlookbook] = useState<string>(
    typeof window !== 'undefined'
      ? localStorage.getItem('selectlookbook') || 'Explore Designers'
      : 'Explore Designers'
  );

  // Split state for section 1 (About You)
  const [formDataSection1, setFormDataSection1] = useState<FormDataSection1>({
    first_name: '',
    last_name: '',
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    bodyType: '',
    skinColor: '',
    weightUnit: '',
    heightUnit: '',
    profilePicture: undefined,
  });

  // State for sections 2, 3, and 4 (Select Outfit, Color, Stitch Options)
  const [formDataSection234, setFormDataSection234] = useState<FormDataSection234>({
    aboutYou: formDataSection1,
    selectedOutfit: null,
    topColor: null,
    bottomColor: null,
    fabricImageTop: undefined,
    fabricImageBottom: undefined,
    colorFabricInstructions: '', // New field for section 3
    specialInstructions: '', // Empty for section 4
    // Initialize with empty object
    stitchOptions: {},
  });
  const [showPicker, setShowPicker] = useState(false);
  const [showPickerone, setShowPickerone] = useState(false);
  const toppcolor = formDataSection234.topColor || '#5578dc';
  const bottommcolor = formDataSection234.bottomColor || '#5578dc';
  // Add these new state variables after the existing useState declarations
  const [topFabric, setTopFabric] = useState<string | null>(null);
  const [bottomFabric, setBottomFabric] = useState<string | null>(null);

  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  // Add this state variable near the other useState declarations
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  // Add this state variable near the other useState declarations
  const [searchTerm, setSearchTerm] = useState('');

  const [animationStep, setAnimationStep] = useState<'idle' | 'ticking' | 'loading' | 'complete'>(
    'idle'
  );
  const [tickedOptions, setTickedOptions] = useState<Set<string>>(new Set());
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);
  // const [shareStep, setShareStep] = useState<'ready' | 'generating' | 'done'>('ready');
  const [showShareSuccessModal, setShowShareSuccessModal] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loadingPortfolios, setLoadingPortfolios] = useState(false);
  const [loadingPortfoliosMore, setLoadingPortfoliosMore] = useState(false);
  const [portfoliosPage, setPortfoliosPage] = useState<number>(0);
  const [portfoliosTotalPages, setPortfoliosTotalPages] = useState<number>(1);
  const [portfoliosLastPage, setPortfoliosLastPage] = useState<boolean>(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [collectiveLoading, setCollectiveLoading] = useState(false);
  const [collectiveItems, setCollectiveItems] = useState<VersionDataa[]>([]);

  const [loadingCollective, setLoadingCollective] = useState(false);
  const [collectivePage, setCollectivePage] = useState(0);
  const [collectiveTotalPages, setCollectiveTotalPages] = useState(1);
  const [collectiveLastPage, setCollectiveLastPage] = useState(false);
  const [favouriteItems, setFavouriteItems] = useState<FavouriteItem[]>([]);
  const [favouritePage, setFavouritePage] = useState(0);
  const [favouriteTotalPages, setFavouriteTotalPages] = useState(1);
  const [favouriteLastPage, setFavouriteLastPage] = useState(false);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  const [searchhTerm, setSearchhTerm] = useState('');

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Store lat/lon from ipapi.co

  const [locationData] = useState<{ lat?: number; lon?: number }>({});

  const handleTabChange = (tab: 'studio' | 'lookbook') => {
    setSelectedTab(tab);
    localStorage.setItem('selected_tab', tab);
  };

  // ✅ Lookbook Tab Change Trigger Integration

  useEffect(() => {
    if (!isLoggedIn || selectedTab !== 'lookbook') {
      return;
    }

    if (selectlookbook === 'Collective') {
      fetchCollective(0, false);
    } else if (selectlookbook === 'Favorites') {
      fetchFavourites(0, false);
    }
  }, [selectlookbook, selectedTab, isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn || selectedTab !== 'lookbook') {
      return;
    }

    if (selectlookbook === 'Collective') {
      fetchCollective(0, false);
    } else if (selectlookbook === 'Favorites') {
      fetchFavourites(0, false);
    }
  }, [selectlookbook, selectedTab, isLoggedIn]);

  const handleShowStudio = () => {
    setSidebarAnimating(true);
    // Use setTimeout to ensure the element is rendered before applying the show animation
    setTimeout(() => {
      setShowStudio(true);
    }, 10);
  };

  const handleShare = (platform: string) => {
    //const shareText = `Check out my AI-generated outfit design on Darzee!`;
    const shareUrl = shareLink || 'Check out my AI-generated outfit design on Darzee!';

    switch (platform) {
      case 'whatsapp': {
        const whatsappText = `${shareUrl}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`, '_blank');
        break;
      }
      case 'telegram': {
        window.open(`https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      }
      case 'email': {
        const emailBody = `$${shareUrl}`;
        window.open(
          `mailto:?subject=${encodeURIComponent(
            'Check out my AI-generated outfit design on Darzee!'
          )}&body=${encodeURIComponent(emailBody)}`,
          '_blank'
        );
        break;
      }
      case 'twitter': {
        const twitterText = `${shareUrl}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`,
          '_blank'
        );
        break;
      }
      case 'facebook': {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      }
      case 'copy': {
        const copyText = `${shareUrl}`;
        navigator.clipboard.writeText(copyText).then(() => {
          toast.success('Link copied to clipboard!');
        });
        break;
      }
      default:
        break;
    }

    setShowShareModal(false);
  };
  const handleGenerateShareLink = async () => {
    if (!currentVersionEntry?.id) {
      alert('No generated image available to create share link');

      return;
    }

    setIsGeneratingShareLink(true);
    setShareLink(null); // reset any existing link

    let outfitName = '';

    if (formDataSection234 && formDataSection234.selectedOutfit) {
      outfitName = formDataSection234.selectedOutfit;
    } else if (currentVersionEntry.data) {
      try {
        const parsed = JSON.parse(currentVersionEntry.data);
        outfitName = parsed.selectedOutfit || '';
      } catch {
        outfitName = '';
      }
    }

    try {
      const requestBody = {
        imageId: currentVersionEntry.id,
        parameters: [`outfit_${outfitName}`], // add any parameters as needed
      };
      // Adjust the API endpoint as per your backend for share link creation
      const response = await api.postRequest(`link_share/generate`, requestBody);

      if (response.status && response.data?.link) {
        // Backend returns the direct shareable link here
        setShareLink(response.data.link);

        return true;
      } else {
        alert('Failed to generate share link');
        setShareLink(null);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating share link:', error);
      alert('An error occurred while generating share link');
      setShareLink(null);

      return false;
    } finally {
      setIsGeneratingShareLink(false);
    }
  };

  useEffect(() => {
    setIsImageLoaded(false);
  }, [generatedImageUrl]);

  // Add this useEffect to fetch skin colors when component mounts
  useEffect(() => {
    const fetchSkinColors = async () => {
      setLoadingSkinColors(true);
      setError(null);
      try {
        const response = await api.getRequest('master-data/body-colors');

        if (response.status && response.data) {
          setSkinColors(response.data);
        } else {
          setError('Failed to fetch skin colors');
        }
      } catch (err) {
        setError('An error occurred while fetching skin colors');
      } finally {
        setLoadingSkinColors(false);
      }
    };

    fetchSkinColors();
  }, []);

  // Add this useEffect to fetch weight units when component mounts
  useEffect(() => {
    const fetchWeightUnits = async () => {
      setLoadingWeightUnits(true);
      setError(null);
      try {
        const response = await api.getRequest('master-data/weight-units');

        if (response.status && response.data) {
          setWeightUnits(response.data);

          // Set default weight unit to the first option if available
          if (response.data.length > 0 && !formDataSection1.weightUnit) {
            setFormDataSection1((prev) => ({
              ...prev,
              weightUnit: response.data[0].weightUnit,
            }));
          }
        } else {
          setError('Failed to fetch weight units');
        }
      } catch (err) {
        setError('An error occurred while fetching weight units');
      } finally {
        setLoadingWeightUnits(false);
      }
    };

    fetchWeightUnits();
  }, []);

  useEffect(() => {
    const fetchHeightUnits = async () => {
      setLoadingHeightUnits(true);
      setError(null);
      try {
        const response = await api.getRequest('master-data/height-units');

        if (response.status && response.data) {
          setHeightUnits(response.data);

          // Set default height unit to the first option if available
          if (response.data.length > 0 && !formDataSection1.heightUnit) {
            setFormDataSection1((prev) => ({
              ...prev,
              heightUnit: response.data[0].heightUnit,
            }));
          }
        } else {
          setError('Failed to fetch height units');
        }
      } catch (err) {
        setError('An error occurred while fetching height units');
      } finally {
        setLoadingHeightUnits(false);
      }
    };

    fetchHeightUnits();
  }, []);

  // Add this useEffect to fetch coin balance when component mounts
  useEffect(() => {
    // Check if user is logged in based on stored token
    const token = getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token');

    if (!token) {
      // Not logged in
      setIsLoggedIn(false);
      setCoinBalance(0);

      return;
    }

    // Logged in
    setIsLoggedIn(true);

    const fetchCoinBalance = async () => {
      try {
        // apiRequest will automatically add Authorization + x-boutique-id + refresh_token logic
        const response = await api.getRequest('coin/balance', {
          Accept: '*/*',
        });

        if (response.status && response.data !== null && response.data !== undefined) {
          setCoinBalance(response.data ?? 0);
        } else {
          setCoinBalance(0);
        }
      } catch {
        setCoinBalance(0);
      }
    };

    void fetchCoinBalance();
    // Recalculate coins when these change
  }, [generatedImageUrl, formDataSection1.first_name, currentStep]);

  // Add this useEffect to update the fabric URLs whenever fabricImageTop or fabricImageBottom changes
  useEffect(() => {
    // Update topFabric when fabricImageTop changes
    if (formDataSection234.fabricImageTop && formDataSection234.fabricImageTop.length > 0) {
      setTopFabric(formDataSection234.fabricImageTop[0].short_lived_url);
    } else {
      setTopFabric(null);
    }

    // Update bottomFabric when fabricImageBottom changes
    if (formDataSection234.fabricImageBottom && formDataSection234.fabricImageBottom.length > 0) {
      setBottomFabric(formDataSection234.fabricImageBottom[0].short_lived_url);
    } else {
      setBottomFabric(null);
    }
  }, [formDataSection234.fabricImageTop, formDataSection234.fabricImageBottom]);

  // Fetch outfit options when gender changes
  useEffect(() => {
    const fetchOutfitOptions = async () => {
      const storedUserData = localStorage.getItem('fizaaiuser');

      let genderrr = 'male';

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          genderrr = userData?.user?.userPreference?.gender;
          // eslint-disable-next-line no-console
          //console.log(genderrr);
        } catch (error) {
          // Optional: Handle JSON parse errors
          setError('Corrupted user data in storage');

          return;
        }
      }

      setLoading(true);

      try {
        const response = await api.getRequest(`master-data/outfits/?gender=${genderrr}`);

        if (response.status && response.data) {
          setOutfitOptions(response.data);
        } else {
          setError('Failed to fetch outfit options');
        }
      } catch (err) {
        setError('An error occurred while fetching outfit options');
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentStep === 2) {
      fetchOutfitOptions();
    }
  }, [currentStep, formDataSection1.gender]);

  // Fetch stitch options when outfit is selected and moving to step 4
  useEffect(() => {
    const fetchStitchOptions = async () => {
      if (!formDataSection234.selectedOutfit) {
        return;
      }

      // Don't fetch stitch options if popup is showing
      if (showStudio) {
        return null;
      }

      setLoadingStitchOptions(true);
      setError(null);
      try {
        const response = await api.getRequest(`fiza/outfit/${outfit_index}/stitch_options`);

        if (response.status && response.data) {
          setStitchOptionGroups(response.data);

          // Initialize stitch options with null values using label as key
          const initialStitchOptions: Record<string, string | number | null> = {};

          // Process all stitch options and set null values initially
          response.data.forEach((group: StitchOptionGroup) => {
            group.stitch_options.forEach((option: StitchOption) => {
              // Set all options to null initially, using label as key
              initialStitchOptions[option.label] = null;
            });
          });

          // Update the form data with initial stitch options
          setFormDataSection234((prev) => ({
            ...prev,
            stitchOptions: initialStitchOptions,
          }));
        } else {
          setError('Failed to fetch stitch options');
        }
      } catch (err) {
        setError('An error occurred while fetching stitch options');
        // eslint-disable-next-line no-console
        console.error(err);
      } finally {
        setLoadingStitchOptions(false);
      }
    };

    if (currentStep === 4) {
      fetchStitchOptions();
    }
  }, [currentStep, formDataSection234.selectedOutfit, outfit_index]);

  // Add this useEffect to keep formDataSection234.aboutYou in sync with formDataSection1
  useEffect(() => {
    setFormDataSection234((prev) => ({
      ...prev,
      aboutYou: formDataSection1,
    }));
  }, [formDataSection1]);

  useEffect(() => {
    const fetchBodyTypes = async () => {
      if (!formDataSection1.gender) {
        return;
      }

      setLoadingBodyTypes(true);
      setError(null);
      try {
        const genderId = formDataSection1.gender === 'male' ? 1 : 2;
        const response = await api.getRequest(`master-data/body-types/gender?genderId=${genderId}`);

        if (response.status && response.data) {
          setBodyTypes(response.data);
          // Only reset bodyType if it's not valid for the current gender
          // Check if current bodyType exists in the new data
          const currentBodyType = formDataSection1.bodyType;
          const isCurrentBodyTypeValid = response.data.some(
            (bt: BodyType) => bt.bodyType === currentBodyType
          );

          if (!isCurrentBodyTypeValid && currentBodyType !== '') {
            // Reset bodyType only if it's not valid for the current gender
            setFormDataSection1((prev) => ({
              ...prev,
              bodyType: '',
            }));
          }
        } else {
          setError('Failed to fetch body types');
        }
      } catch (err) {
        setError('An error occurred while fetching body types');
      } finally {
        setLoadingBodyTypes(false);
      }
    };

    fetchBodyTypes();
  }, [formDataSection1.gender]);

  // Group all effects
  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [popup]);

  // Add this useEffect after your other useEffect hooks
  useEffect(() => {
    // Try to get user data from localStorage
    try {
      const storedUserData = localStorage.getItem('fizaaiuser');

      if (storedUserData) {
        const userData = JSON.parse(storedUserData);

        if (userData.user) {
          // Update formDataSection1 with the user data
          setFormDataSection1((prevData) => ({
            ...prevData,
            first_name: userData.user.first_name || '',
            last_name: userData.user.last_name || '',
            gender: userData.user.userPreference?.gender || 'male',
            age: userData.user.userPreference?.age || '',
            weight: userData.user.userPreference?.weight?.toString() || '',
            height: userData.user.userPreference?.height?.toString() || '',
            bodyType: userData.user.userPreference?.bodyType || '',
            skinColor: userData.user.userPreference?.colorCode || '',
            weightUnit: userData.user.userPreference?.weightUnit || '',
            heightUnit: userData.user.userPreference?.heightUnit || '',
            profilePicture: userData.user.userPreference?.profilePicture
              ? [{ short_lived_url: userData.user.userPreference.profilePicture }]
              : undefined,
          }));

          // If you need to set the mobile number as well
          if (userData.user.phoneNumber) {
            setUserMobileNumber(userData.user.phoneNumber);
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error loading user data from localStorage:', error);
    }
  }, [showStudio]);

  useEffect(() => {
    // Check authentication from localStorage instead of Firebase
    const isAuth = localStorage.getItem('isAuthenticated');

    if (isAuth === 'true') {
      setIsLoggedInn(true);
    } else {
      setItems([]); // Clear versions on logout
      setIsLoggedInn(false);
    }
  }, []);

  //   return () => unsubscribe();
  // }, []);

  // ✅ Step 2: When logged in, fetch versions
  useEffect(() => {
    if (!isLoggedInn) {
      return;
      setIsLoggedInn(true);
    }

    const fetchVersions = async () => {
      let zone = 'Asia/Kolkata'; // default fallback

      try {
        // 1️⃣ Try to get data from localStorage first
        const savedData = localStorage.getItem('ipapidata');

        if (savedData) {
          const ipData = JSON.parse(savedData);

          if (ipData?.timezone) {
            zone = ipData.timezone;
          }
        } else {
          // 2️⃣ Not in localStorage — fetch from API
          const ipRes = await fetch('https://ipapi.co/json/');

          if (ipRes.ok) {
            const ipData = await ipRes.json();
            // Save full response for future use
            localStorage.setItem('ipapidata', JSON.stringify(ipData));

            if (ipData?.timezone) {
              zone = ipData.timezone;
            }
          }
        }
      } catch (ipError) {
        // eslint-disable-next-line no-console
        console.warn('Failed to get timezone, using default:', ipError);
      }

      try {
        // 🔹 api.getRequest will add Authorization + x-boutique-id + refresh logic
        const parentRes = await api.getRequest(
          'fiza/image/versions?pageNo=0&pageSize=100&sortBy=id&sortDir=DESC',
          {
            Accept: '*/*',
            'time-zone': zone,
          }
        );

        const parents: VersionData[] = parentRes?.data?.content || [];

        // Fetch child versions
        const childrenRequests = parents
          .filter((p) => p.children && p.children > 0)
          .map((parent) =>
            api
              .getRequest(
                `fiza/image/fetch_by_parent?pageNo=0&pageSize=100&sortBy=id&sortDir=ASC&parentId=${parent.id}`,
                {
                  Accept: '*/*',
                  'time-zone': zone,
                }
              )
              .then((res) => res?.data?.content || [])
          );

        const allChildren = await Promise.all(childrenRequests);
        const children: VersionData[] = allChildren.flat();

        // ✅ Final version list
        setItems([...parents, ...children]);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch versions:', err);

        if (err instanceof TypeError && err.message === 'Failed to fetch') {
          // eslint-disable-next-line no-console
          console.warn('Network connectivity issue - API server may be unreachable');
        }

        setItems([]);
      }
    };

    fetchVersions();
  }, [isLoggedInn, showStudio, generatedImageUrl]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    // Load default data when tab changes or user is logged in
    fetchCollective(0, false);
    fetchFavourites(0, false);
  }, [selectedTab, isLoggedIn]);

  const fetchCollective = async (pageNo = 0, append = false) => {
    setLoadingCollective(true);

    try {
      const response = await api.getRequest(
        `fiza/collective/feed?pageNo=${pageNo}&pageSize=5&sortBy=likeCount&sortDir=DESC`,
        {
          Accept: '*/*',
        }
      );

      if (response.status && response.data && Array.isArray(response.data.content)) {
        const content = response.data.content;
        const lastPage = Boolean(response.data.lastPage);
        const currentPage =
          typeof response.data.currentPage === 'number' ? response.data.currentPage : pageNo;
        const totalPages =
          typeof response.data.totalPages === 'number' ? response.data.totalPages : 1;

        // ✅ use functional update to avoid stale `collectiveItems`
        setCollectiveItems((prev) => (append ? [...prev, ...content] : content));
        setCollectivePage(currentPage);
        setCollectiveTotalPages(totalPages);
        setCollectiveLastPage(lastPage);
      } else {
        if (!append) {
          setCollectiveItems([]);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching collective feed:', err);

      if (!append) {
        setCollectiveItems([]);
      }
    } finally {
      setLoadingCollective(false);
    }
  };

  const fetchFavourites = async (pageNo = 0, append = false) => {
    setLoadingFavourites(true);

    try {
      const response = await api.getRequest(
        `fiza/collective/fav_list?pageNo=${pageNo}&pageSize=5&sortBy=id&sortDir=DESC`,
        {
          Accept: '*/*',
        }
      );

      if (response.status && response.data && Array.isArray(response.data.content)) {
        const content = response.data.content;
        const lastPage = Boolean(response.data.lastPage);
        const currentPage =
          typeof response.data.currentPage === 'number' ? response.data.currentPage : pageNo;
        const totalPages =
          typeof response.data.totalPages === 'number' ? response.data.totalPages : 1;

        // ✅ Functional update to avoid stale state
        setFavouriteItems((prev) => (append ? [...prev, ...content] : content));

        setFavouritePage(currentPage);
        setFavouriteTotalPages(totalPages);
        setFavouriteLastPage(lastPage);
      } else {
        if (!append) {
          setFavouriteItems([]);
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error fetching favourites:', err);

      if (!append) {
        setFavouriteItems([]);
      }
    } finally {
      setLoadingFavourites(false);
    }
  };

  const handleLoadMoreCollective = () => {
    if (loadingCollective || collectiveLastPage) {
      return;
    }
    fetchCollective(collectivePage + 1, true);
  };

  const handleLoadMoreFavourites = () => {
    if (loadingFavourites || favouriteLastPage) {
      return;
    }
    fetchFavourites(favouritePage + 1, true);
  };

  // Fetch portfolios when user switches to Lookbook tab
  useEffect(() => {
    fetchPortfolios(0, false);
  }, [selectedTab, selectlookbook]);

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

  const handleVersionSelect = (entry: VersionData) => {
    try {
      if (window.innerWidth < 768) {
        setShowMobilePreview(true);
      }

      const parsedData = JSON.parse(entry.data);

      setCurrentVersionEntry(entry);
      // eslint-disable-next-line no-console
      //console.log(parsedData);

      // Update formDataSection234 with the selected version data
      setFormDataSection234(parsedData);

      // Show loading state when image version changes
      setLoadingImageVersion(true);

      // Preload image and hide loader when actually loaded
      const img = new Image();
      img.onload = () => {
        setLoadingImageVersion(false);
      };
      img.onerror = () => {
        setLoadingImageVersion(false);
      };
      img.src = entry.imageUrl;

      // Update the generated image URL
      setGeneratedImageUrl(entry.imageUrl);

      // Update formDataSection1 with aboutYou data from the version
      if (parsedData.aboutYou) {
        setFormDataSection1(parsedData.aboutYou);
      }

      // Find the outfit index based on selected outfit
      if (parsedData.selectedOutfit) {
        const selectedOutfit = outfitOptions.find(
          (outfit) => outfit.outfit_name === parsedData.selectedOutfit
        );

        if (selectedOutfit) {
          setoutfit_index(selectedOutfit.outfit_index);

          // Fetch stitch options for the selected outfit and then set the values
          const fetchStitchOptionsAndSetValues = async () => {
            try {
              setLoadingStitchOptions(true);
              const response = await api.getRequest(
                `fiza/outfit/${selectedOutfit.outfit_index}/stitch_options`
              );

              if (response.status && response.data) {
                setStitchOptionGroups(response.data);

                // After setting stitch option groups, set the values from parsed data
                if (parsedData.stitchOptions) {
                  setFormDataSection234((prev) => ({
                    ...prev,
                    stitchOptions: parsedData.stitchOptions,
                  }));
                }
              }
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error fetching stitch options:', error);
            } finally {
              setLoadingStitchOptions(false);
            }
          };

          fetchStitchOptionsAndSetValues();
        }
      }

      // Set the current step to 4 (stitch options) to show the complete form
      setCurrentStep(4);
      setAnimationStep('complete');

      // You can now access additional properties from the entry object:
      // entry.id - the version ID
      // entry.version - the version number
      // entry.parentId - parent version ID if applicable
      // entry.createdAt - creation timestamp
      // entry.userId - user who created this version
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error parsing version data:', error);
    }
  };

  const handleCollectiveToggle = async () => {
    if (!currentVersionEntry) {
      return;
    }

    setCollectiveLoading(true);

    try {
      const imageVersionId = currentVersionEntry.id;
      const addToCollective = !currentVersionEntry.collective;

      const apiUrl = addToCollective
        ? `fiza/collective/mark_as_collective?imageVersionId=${imageVersionId}`
        : `fiza/collective/remove_from_collective?imageVersionId=${imageVersionId}`;

      // ❗Minimal change: removed token + firebase user
      const response = await api.putRequest(
        apiUrl,
        {},
        false,
        { Accept: '*/*' } // apiRequest adds Bearer + boutique automatically
      );

      if (response.status) {
        setCurrentVersionEntry({
          ...currentVersionEntry,
          collective: addToCollective,
        });

        toast.success(addToCollective ? 'Added to Collective' : 'Removed from Collective');
      } else {
        throw new Error('API error');
      }
    } catch (error) {
      // toast.error("There is Already An Image Added To Collective.");
    } finally {
      setCollectiveLoading(false);
    }
  };

  // // Fetch portfolios (supports paging and append)
  // const fetchPortfolios = async (pageNo = 0, append = false) => {
  //   try {
  //     if (append) {
  //       setLoadingPortfoliosMore(true);
  //     } else {
  //       setLoadingPortfolios(true);
  //     }
  //     setError(null);

  //     // Try to get lat/lon from localStorage if not present in locationData
  //     let lat = locationData?.lat;
  //     let lon = locationData?.lon;

  //     if (lat === undefined || lon === undefined) {
  //       const ipapiRaw = localStorage.getItem('ipapidata');

  //       if (ipapiRaw) {
  //         try {
  //           const ipapiData = JSON.parse(ipapiRaw);

  //           if (ipapiData.latitude !== undefined && ipapiData.longitude !== undefined) {
  //             lat = ipapiData.latitude;
  //             lon = ipapiData.longitude;
  //           }
  //         } catch (error) {
  //           // eslint-disable-next-line no-console
  //           console.error('Failed to parse ipapidata from localStorage', error);
  //         }
  //       }
  //     }

  //     const res = await api.getRequest(
  //       `portfolio/fetch-all?pageNo=${pageNo}&pageSize=10${
  //         lat !== undefined && lon !== undefined ? `&lat=${lat}&lon=${lon}` : ''
  //       }`
  //     );

  //     if (res.status && res.data && Array.isArray(res.data.content)) {
  //       const content = res.data.content;
  //       const lastPage = Boolean(res.data.lastPage);
  //       const currentPage =
  //         typeof res.data.currentPage === 'number' ? res.data.currentPage : pageNo;
  //       const totalPages = typeof res.data.totalPages === 'number' ? res.data.totalPages : 1;

  //       if (append) {
  //         setPortfolios((prev) => [...prev, ...content]);
  //       } else {
  //         setPortfolios(content);

  //         if (content.length > 0) {
  //           setSelectedPortfolio(content[0]);
  //         } else {
  //           setSelectedPortfolio(null);
  //         }
  //       }

  //       setPortfoliosPage(currentPage);
  //       setPortfoliosTotalPages(totalPages);
  //       setPortfoliosLastPage(lastPage);
  //     } else {
  //       if (!append) {
  //         setPortfolios([]);
  //         setSelectedPortfolio(null);
  //       }
  //     }
  //   } catch (err) {
  //     if (!append) {
  //       setPortfolios([]);
  //       setSelectedPortfolio(null);
  //     }
  //     // eslint-disable-next-line no-console
  //     console.error('Failed to fetch portfolios', err);
  //   } finally {
  //     setLoadingPortfolios(false);
  //     setLoadingPortfoliosMore(false);
  //   }
  // };

  // Update form data for section 1
  const updateFormDataSection1 = (field: keyof FormDataSection1, value: any) => {
    setFormDataSection1((prev) => ({ ...prev, [field]: value }));
  };

  // Update form data for sections 2, 3, and 4
  const updateFormDataSection234 = (
    field: keyof FormDataSection234,
    value: string | number | null | Record<string, string | number | null> | any
  ) => {
    setFormDataSection234((prev) => ({ ...prev, [field]: value }));
  };

  // Update stitch option value using label as key
  const updateStitchOption = (label: string, value: string | number | null) => {
    setFormDataSection234((prev) => ({
      ...prev,
      stitchOptions: {
        ...prev.stitchOptions,
        [label]: value,
      },
    }));
  };

  // Handle next button click
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Handle outfit selection
  const handleOutfitSelect = (outfitId: string) => {
    updateFormDataSection234('selectedOutfit', outfitId);
  };

  // Increment counter for stitch option
  const incrementCounter = (label: string, maxValue: string) => {
    const currentValue = (formDataSection234.stitchOptions[label] as number) || 0;
    const max = parseInt(maxValue);

    if (currentValue < max) {
      updateStitchOption(label, currentValue + 1);
    }
  };

  // Decrement counter for stitch option
  const decrementCounter = (label: string, minValue: string) => {
    const currentValue = (formDataSection234.stitchOptions[label] as number) || 0;
    const min = parseInt(minValue);

    if (currentValue > min) {
      updateStitchOption(label, currentValue - 1);
    }
  };
  // Add this filtered outfits computation
  const filteredOutfitOptions = outfitOptions.filter(
    (outfit) =>
      (outfit.outfit_details_title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (outfit.outfit_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Clear all stitch options
  const handleClearAll = () => {
    const clearedOptions: Record<string, null> = {};
    stitchOptionGroups.forEach((group) => {
      group.stitch_options.forEach((option) => {
        clearedOptions[option.label] = null;
      });
    });

    setFormDataSection234((prev) => ({
      ...prev,
      stitchOptions: clearedOptions,
    }));
  };

  // Update the handleGeneratePreview function
  const handleGeneratePreview = async (entry?: VersionData) => {
    try {
      // Check if user has 0 tokens
      if (coinBalance === 0) {
        setShowPopup(true);

        return;
      }

      if (window.innerWidth < 768) {
        setShowMobilePreview(true);
      }

      setAnimationStep('ticking');
      setTickedOptions(new Set());

      // Get all selected options
      const selectedOptions: string[] = [];
      stitchOptionGroups.forEach((group) => {
        group.stitch_options.forEach((option) => {
          if (formDataSection234.stitchOptions[option.label] !== null) {
            selectedOptions.push(option.label);
          }
        });
      });

      // Add color options to the list
      if (formDataSection234.topColor) {
        selectedOptions.push('topColor');
      }

      if (formDataSection234.bottomColor) {
        selectedOptions.push('bottomColor');
      }

      // Prepare the request body
      const requestBody = {
        data: JSON.stringify(formDataSection234),
        topFebric: topFabric,
        bottomFebric: bottomFabric,
      };

      // Start API call immediately but don't await it yet
      const apiCallPromise =
        entry && entry.id !== null
          ? api.postRequest(`fiza/image/edit?id=${entry.id}`, requestBody, false, {
              'Content-Type': 'application/json',
            })
          : api.postRequest('fiza/image/generate', requestBody, false, {
              'Content-Type': 'application/json',
            });

      // Show ticking animation first
      for (let i = 0; i < selectedOptions.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setTickedOptions((prev) => {
          const newSet = new Set(prev);
          newSet.add(selectedOptions[i]);

          return newSet;
        });
      }

      // Wait a bit after all ticks are shown
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Show loading state and wait for API response
      setAnimationStep('loading');
      setIsGeneratingImage(true);
      const response = await apiCallPromise;

      // Handle the response
      if (response.status && response.data) {
        if (response.data.img) {
          setGeneratedImageUrl(response.data.img);
          setAnimationStep('complete');

          // Update currentVersionEntry with the new response data
          if (response.data.id) {
            setCurrentVersionEntry({
              id: response.data.id,
              data: JSON.stringify(formDataSection234),
              version: response.data.version,
              parentId: response.data.parentId || null,
              createdAt: response.data.createdAt || new Date().toISOString(),
              imageUrl: response.data.img,
              userId: response.data.userId,
              children: response.data.children || null,
              collective: response.data.collective || false,
              likeCount: response.data.likeCount || null,
              likedByCurrentUser: response.data.likedByCurrentUser || null,
              prof_pic: response.data.prof_pic || null,
            });
          }
        } else {
          alert('No image URL received in the response');
          setAnimationStep('idle');
        }
      } else {
        setGeneratedImageUrl(null);
        setAnimationStep('idle');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating preview:', error);
      setGeneratedImageUrl(null);
      setAnimationStep('idle');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // eslint-disable-next-line no-console
  // console.log(generatedImageUrl);

  // Find selected outfit details
  const selectedOutfitDetails = outfitOptions.find(
    (outfit) => outfit.outfit_name === formDataSection234.selectedOutfit
  );

  // Add this function before the return statement
  const handleRegisterUser = async () => {
    try {
      // Check if we have a mobile number
      if (!userMobileNumber) {
        alert('Mobile number is missing. Please try signing up again.');

        return;
      }

      // Prepare the request body using form data
      const requestBody = {
        mobileNumber: userMobileNumber,
        userPreference: {
          gender: formDataSection1.gender,
          height: parseFloat(formDataSection1.height),
          heightUnit: formDataSection1.heightUnit,
          weight: parseFloat(formDataSection1.weight),
          weightUnit: formDataSection1.weightUnit,
          bodyType: formDataSection1.bodyType,
          colorCode: formDataSection1.skinColor,
          age: formDataSection1.age,
          profilePicture: formDataSection1.profilePicture?.[0]?.short_lived_url || '',
        },
        first_name: formDataSection1.first_name,
        last_name: formDataSection1.last_name,
      };

      // Make the API call using the api utility
      const response = await api.postRequest('auth/user/register', requestBody);

      // Handle the response
      if (response.status && response.data) {
        // Store user data in localStorage
        const userData = {
          user: {
            first_name: formDataSection1.first_name,
            last_name: formDataSection1.last_name,
            phoneNumber: userMobileNumber,
            userPreference: {
              gender: formDataSection1.gender,
              age: formDataSection1.age,
              weight: parseFloat(formDataSection1.weight),
              height: parseFloat(formDataSection1.height),
              bodyType: formDataSection1.bodyType,
              colorCode: formDataSection1.skinColor,
              weightUnit: formDataSection1.weightUnit,
              heightUnit: formDataSection1.heightUnit,
              profilePicture: formDataSection1.profilePicture?.[0]?.short_lived_url || '',
            },
          },
        };
        localStorage.setItem('fizaaiuser', JSON.stringify(userData));

        // If registration is successful, proceed to the next step
        setShowStudio(false);
        handleNext();
      } else {
        // If there's an error, show an alert or handle it appropriately
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error registering user:', error);
      alert('An error occurred during registration. Please try again.');
    }
  };

  // Add this function before the return statement
  const isAboutYouSectionValid = () => {
    return (
      formDataSection1.first_name !== '' &&
      formDataSection1.last_name !== '' &&
      formDataSection1.gender !== '' &&
      formDataSection1.age !== '' &&
      formDataSection1.weight !== '' &&
      formDataSection1.height !== '' &&
      formDataSection1.skinColor !== '' &&
      formDataSection1.weightUnit !== '' &&
      formDataSection1.heightUnit !== ''
    );
  };

  // // eslint-disable-next-line no-console
  // console.log(generatedImageUrl);

  // // eslint-disable-next-line no-console
  // console.log(formDataSection234);

  const handleNewOutfit = () => {
    // Check if user is already on a fresh/new outfit
    const isOnNewOutfit =
      currentStep === 1 ||
      (currentStep === 2 && !formDataSection234.selectedOutfit) ||
      (currentStep > 2 && !formDataSection234.selectedOutfit && !generatedImageUrl);

    // If already on new outfit, do nothing
    if (isOnNewOutfit) {
      setCurrentStep(2);

      return;
    }

    // Reset to create new outfit
    setCurrentStep(2); // Start from outfit selection
    setFormDataSection234({
      aboutYou: formDataSection1,
      selectedOutfit: null,
      topColor: null,
      bottomColor: null,
      fabricImageTop: undefined,
      fabricImageBottom: undefined,
      colorFabricInstructions: '',
      specialInstructions: '',
      stitchOptions: {},
    });
    setGeneratedImageUrl(null);
    setCurrentVersionEntry(null);
    setAnimationStep('idle');
    setTickedOptions(new Set());
    setoutfit_index(undefined);
    setStitchOptionGroups([]);
    setShowMobilePreview(false);
  };

  // Function to download the generated image
  const handleDownloadImage = async () => {
    if (!generatedImageUrl) {
      alert('No image available to download');

      return;
    }

    setIsDownloading(true);

    // setIsDownloading(true); // Show loader

    const version = currentVersionEntry?.version ?? 1;
    const outfitName = formDataSection234?.selectedOutfit || 'Outfit';
    const fileName = `${outfitName} Version ${version}.jpg`;
    const ap = process.env.REACT_APP_BASE_API_URL;

    // const ap1 = 'https://app.fizaai.com/';
    // eslint-disable-next-line no-console
    // console.log(ap);

    try {
      const apiUrl = `${ap}file/download-file?fileUrl=${encodeURIComponent(generatedImageUrl)}`;
      const response = await fetch(apiUrl, { mode: 'cors', credentials: 'omit' });

      if (!response.ok) {
        throw new Error('Network response was not OK');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      window.open(generatedImageUrl, '_blank');
      alert('Could not force download – image opened in a new tab instead.');
    } finally {
      // setIsDownloading(false); // Hide loader
      setIsDownloading(false);
    }
  };

  // Fetch portfolios with optional search query
  const fetchPortfolios = async (pageNo = 0, append = false, query = '') => {
    try {
      if (append) {
        setLoadingPortfoliosMore(true);
      } else {
        setLoadingPortfolios(true);
      }

      setError(null);

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
      let url = `portfolio/fetch-all?pageNo=${pageNo}&pageSize=10`;

      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      }

      let finalQuery = query;

      if (finalQuery) {
        // If user typed new query → delete stored one
        localStorage.removeItem('username');
      } else {
        // No query → fallback to local storage
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
          finalQuery = storedUsername;
        }
      }

      if (finalQuery) {
        url += `&query=${encodeURIComponent(finalQuery)}`;
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

  return (
    <div className="flex w-full min-h-screen relative overflow-hidden">
      {/* Sidebar */}
      {(showStudio || sidebarAnimating) && (
        <div
          className={`md:w-[300px] w-[280px] md:fixed md:left-0 md:top-0 absolute md:min-w-[260px] h-screen bg-[#F9F6F1] border-r shadow-md z-[100] transform transition-all duration-500 ease-in-out ${
            showStudio
              ? 'md:translate-x-0 translate-x-0 opacity-100'
              : 'md:-translate-x-full -translate-x-full opacity-0'
          }`}
          onTransitionEnd={() => {
            if (!showStudio) {
              setSidebarAnimating(false);
            }
          }}
        >
          <StudioSidebar
            setShowStudio={(value) => {
              if (!value) {
                setShowStudio(false);
              } else {
                setShowStudio(true);
              }
            }}
            generatedImageUrl={generatedImageUrl}
            onVersionSelect={handleVersionSelect}
            showProfile={showProfile}
            setShowProfile={setShowProfile}
            items={items}
            onNewOutfit={handleNewOutfit}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            selectedTab={selectedTab}
            selectlookbook={selectlookbook}
            setSelectlookbook={setSelectlookbook}

            // This now expects the entire entry object
          />
        </div>
      )}

      {/* Main Content Area */}
      <div
        onClick={() => {
          // Only close studio on mobile screens
          if (window.innerWidth < 768) {
            setShowStudio(false);
          }
        }}
        className={`w-full flex flex-col items-center justify-between flex-1 min-h-screen bg-white transition-all duration-500 ease-in-out ${
          showStudio ? 'md:ml-[300px]' : 'md:ml-0'
        }`}
      >
        {/* signup-popup */}
        {popup && (
          <div className="fixed inset-0 z-[900] flex items-center justify-center bg-[#756f6f98]">
            <div className="md:w-[450px] rounded-lg border bg-white shadow-sm mx-[.5rem]">
              <SignupFlow
                popup={popup}
                setPopup={setpopup}
                setCurrentStep1={setCurrentStep}
                onMobileNumberVerified={(mobileNumber) => setUserMobileNumber(mobileNumber)}
              />
            </div>
          </div>
        )}

        {/* Header */}
        <header className="w-full  md:px-6 px-4 py-2 border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="flex items-center justify-between w-full mx-auto">
            {/* Left Section */}
            <div className="flex items-center justify-between gap-4 w-1/2">
              {/* Only show these if sidebar is NOT visible */}
              {!showStudio && (
                <div className="flex items-center md:justify-between gap-2 md:gap-4  w-[15%] md:w-[40%]">
                  <img
                    onClick={handleShowStudio}
                    src={sidebar}
                    alt="Sidebar Toggle"
                    className="h-6 md:h-10 aspect-auto cursor-pointer"
                  />
                  <div className="hidden md:flex items-center gap-2">
                    {/* <img
                      src={search}
                      alt="Search"
                      className="h-6 md:h-10 aspect-auto cursor-pointer"
                    /> */}
                    <img
                      onClick={handleNewOutfit}
                      src={design}
                      alt="Design"
                      className="h-6 md:h-10 aspect-auto cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 md:gap-8 w-[85%] md:w-[60%] pl-4">
                {/* Studio Tab */}
                <div
                  onClick={() => {
                    localStorage.removeItem('username');
                    handleTabChange('studio');
                  }}
                  className={`flex items-center md:gap-2 gap-1 cursor-pointer pb-2 ${
                    selectedTab === 'studio' ? 'border-b-2 border-[#4F2945]' : ''
                  }`}
                >
                  <img src={aiimage} alt="Studio Icon" className="h-6 md:h-7 aspect-auto" />
                  <h1
                    className={`text-[1rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                      selectedTab === 'studio' ? 'block' : 'hidden md:block'
                    }`}
                  >
                    Studio
                  </h1>
                </div>

                {/* Lookbook Tab */}
                <div
                  onClick={() => {
                    localStorage.removeItem('username');
                    handleTabChange('lookbook');
                  }}
                  className={`flex items-center md:gap-2 gap-1 cursor-pointer pb-2  ${
                    selectedTab === 'lookbook' ? 'border-b-2 border-[#4F2945]' : ''
                  }`}
                >
                  <img src={lookbook} alt="Lookbook Icon" className="h-6 md:h-10 aspect-auto" />
                  <h1
                    className={`text-[.9rem] md:text-[1.4rem] font-semibold text-[#4F2945] ${
                      selectedTab === 'lookbook' ? 'block' : 'hidden md:block'
                    }`}
                  >
                    Lookbook
                  </h1>
                </div>
              </div>
            </div>

            {/* Right Section headar */}
            <div className="flex items-center justify-end gap-2 md:gap-4 w-1/2">
              <div className="flex items-center gap-2 md:gap-3 py-1.5 rounded-full cursor-pointer transition-all duration-300">
                <img src={coins} alt="Coin Icon" className="h-5 md:h-6 aspect-auto" />
                <span className="text-[.8rem] md:text-[1rem] font-semibold">{coinBalance}</span>
                <button
                  onClick={() => setShowPopup(true)}
                  className="flex items-center bg-[#32A071] hover:bg-green-700 text-white px-3 py-1 rounded-md text-[.8rem] md:text-[1rem] font-medium transition"
                >
                  Top Up
                  <FaSyncAlt className="ml-2 w-4 h-4" />
                </button>
              </div>

              {/* <div className="hidden md:flex items-center gap-2">
                <img src={share} alt="Share Icon" className="h-5 md:h-6 aspect-auto" />
                <h1 className="text-[1.1rem] md:text-[1.4rem] font-medium text-black">
                  Share &kill fast fashion
                </h1>
              </div> */}

              {/* Logout */}
              {/* <div
                onClick={() => {
                  localStorage.setItem('token', '');tab
                  localStorage.clear();
                  window.location.reload();
                }}
                className="hidden md:flex items-center gap-2 cursor-pointer"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#4f2945] flex items-center justify-center text-white sm:text-[1.2rem] font-semibold">
                  {(() => {
                    const storedData = localStorage.getItem('fizaaiuser');

                    if (storedData) {
                      try {
                        const userData = JSON.parse(storedData);
                        const firstName = userData?.user?.first_name || '';
                        const lastName = userData?.user?.last_name || '';
                        const fullName = `${firstName} ${lastName}`.trim();

                        return fullName.charAt(0).toUpperCase();

                        // Display first letter of full name
                      } catch {
                        return 'A'; // Fallback
                      }
                    }

                    return 'A'; // Fallback
                  })()}
                </div>
              </div> */}
            </div>
          </div>
        </header>

        {showPopup && <TokenPopup onClose={() => setShowPopup(false)} />}

        {currentStep === 1 && (
          <div
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="w-full md:w-[70%] md:mb-8 mb-[3.5rem] flex flex-col md:gap-4 gap-3  px-4 overflow-y-scroll pt-4"
          >
            {/* Profile Picture */}
            <div className="mb-4 relative">
              <label className="block mb-3 font-medium text-sm md:text-base">Profile Picture</label>
              {/* Profile Picture Preview */}

              <BulkImageUploadFieldp
                label="Upload Profile Picture"
                placeholder="Upload Profile Picture"
                type="file"
                required={false}
                multiple={true}
                maxUpload={1}
                fileTypeRequired={false}
                value={formDataSection1.profilePicture}
                onChange={(value: any) => {
                  updateFormDataSection1('profilePicture', value);
                }}
              />
            </div>
            {/* Gender Selection */}
            <div className="mb-4">
              <label className="block mb-3 font-medium text-sm md:text-base">Gender</label>
              <div className="flex gap-3 md:gap-4">
                <button
                  className={`flex-1 md:flex-none md:px-6 px-4 py-2.5 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors ${
                    formDataSection1.gender === 'male'
                      ? 'bg-[#79539f] text-white'
                      : 'bg-white border border-[#79539F] text-[#79539F]'
                  }`}
                  onClick={() => updateFormDataSection1('gender', 'male')}
                >
                  Male
                </button>
                <button
                  className={`flex-1 md:flex-none md:px-6 px-4 py-2.5 md:py-2 rounded-md text-sm md:text-base font-medium transition-colors ${
                    formDataSection1.gender === 'female'
                      ? 'bg-[#79539f] text-white'
                      : 'bg-white border border-[#79539F] text-[#79539F]'
                  }`}
                  onClick={() => updateFormDataSection1('gender', 'female')}
                >
                  Female
                </button>
              </div>
            </div>

            {/* First Name and Last Name */}
            <div className="flex flex-col md:flex-row md:gap-6 gap-4">
              <div className="flex-1">
                <label className="block mb-2 font-medium text-sm md:text-base">First Name</label>
                <input
                  type="text"
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-[#79539F] rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#79539F] focus:border-transparent"
                  value={formDataSection1.first_name}
                  onChange={(e) => updateFormDataSection1('first_name', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-medium text-sm md:text-base">Last Name</label>
                <input
                  type="text"
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-[#79539F] rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#79539F] focus:border-transparent"
                  value={formDataSection1.last_name}
                  onChange={(e) => updateFormDataSection1('last_name', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Age and Weight */}
            <div className="flex flex-col md:flex-row md:gap-6 gap-4">
              <div className="flex-1">
                <label className="block mb-2 font-medium text-sm md:text-base">Age</label>
                <input
                  type="text"
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-[#79539F] rounded-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#79539F] focus:border-transparent"
                  value={formDataSection1.age}
                  onChange={(e) => updateFormDataSection1('age', e.target.value)}
                  placeholder="Enter your age"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-medium text-sm md:text-base">Weight</label>
                <div className="flex">
                  <input
                    type="text"
                    className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-[#79539F] rounded-l-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#79539F] focus:border-transparent"
                    value={formDataSection1.weight}
                    onChange={(e) => updateFormDataSection1('weight', e.target.value)}
                    placeholder="Enter your weight"
                  />
                  <div className="relative">
                    <button
                      type="button"
                      className="flex items-center px-2 md:px-3 py-2.5 md:py-2 border border-l-0 border-[#79539F] rounded-r-md bg-white hover:bg-gray-50 min-w-[80px] md:min-w-[100px] text-sm md:text-base"
                      onClick={() => setIsWeightUnitDropdownOpen(!isWeightUnitDropdownOpen)}
                      disabled={loadingWeightUnits}
                    >
                      <span className="mr-1 md:mr-2 truncate">
                        {loadingWeightUnits ? '...' : formDataSection1.weightUnit || 'Select'}
                      </span>
                      <FaChevronDown size={12} className="md:w-4 md:h-4 flex-shrink-0" />
                    </button>
                    {isWeightUnitDropdownOpen && !loadingWeightUnits && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
                        {weightUnits.map((unit) => (
                          <button
                            key={unit.id}
                            type="button"
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-sm md:text-base"
                            onClick={() => {
                              updateFormDataSection1('weightUnit', unit.weightUnit);
                              setIsWeightUnitDropdownOpen(false);
                            }}
                          >
                            {unit.weightUnit}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Height */}
            <div className="mb-4">
              <label className="block mb-2 font-medium text-sm md:text-base">Height</label>
              <div className="flex">
                <input
                  type="text"
                  className="w-full px-3 md:px-4 py-2.5 md:py-2 border border-[#79539F] rounded-l-md text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-[#79539F] focus:border-transparent"
                  value={formDataSection1.height}
                  onChange={(e) => updateFormDataSection1('height', e.target.value)}
                  placeholder="Enter your height"
                />
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center px-2 md:px-3 py-2.5 md:py-2 border border-l-0 border-[#79539F] rounded-r-md bg-white hover:bg-gray-50 min-w-[80px] md:min-w-[100px] text-sm md:text-base"
                    onClick={() => setIsHeightUnitDropdownOpen(!isHeightUnitDropdownOpen)}
                    disabled={loadingHeightUnits}
                  >
                    <span className="mr-1 md:mr-2 truncate">
                      {loadingHeightUnits ? '...' : formDataSection1.heightUnit || 'Select'}
                    </span>
                    <FaChevronDown size={12} className="md:w-4 md:h-4 flex-shrink-0" />
                  </button>
                  {isHeightUnitDropdownOpen && !loadingHeightUnits && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-20 max-h-40 overflow-y-auto">
                      {heightUnits.map((unit) => (
                        <button
                          key={unit.id}
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md text-sm md:text-base"
                          onClick={() => {
                            updateFormDataSection1('heightUnit', unit.heightUnit);
                            setIsHeightUnitDropdownOpen(false);
                          }}
                        >
                          {unit.heightUnit}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body Type Selection */}
            <div className="mb-4">
              <label className="block mb-3 font-medium text-sm md:text-base">
                Select body type
              </label>
              {loadingBodyTypes ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-[#79539f]"></div>
                </div>
              ) : (
                <div
                  className="flex gap-3 md:gap-4 overflow-x-auto pb-2"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {bodyTypes.map((bodyType) => (
                    <button
                      key={bodyType.id}
                      className={`px-6 py-2 rounded-md flex flex-col items-center justify-center text-[1rem] font-light relative ${
                        formDataSection1.bodyType === bodyType.bodyType
                          ? 'bg-[#79539f  border-2 border-[#79539F]  text-black shadow-md '
                          : 'bg-white border border-[#79539F] '
                      }`}
                      onClick={() => updateFormDataSection1('bodyType', bodyType.bodyType)}
                    >
                      {/* Checkmark for selected state */}
                      {formDataSection1.bodyType === bodyType.bodyType && (
                        <div className="absolute top-1 md:top-2 right-1 md:right-2 w-4 h-4 md:w-6 md:h-6 bg-white rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-[#79539f] text-xs md:text-sm" />
                        </div>
                      )}
                      <img
                        src={bodyType.imageUrl || ''}
                        alt={bodyType.bodyType}
                        className="h-16 w-12 md:min-h-[115px] md:min-w-[90px] object-contain mb-1 md:mb-2"
                      />
                      <span className="text-center leading-tight">{bodyType.bodyType}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Skin Color Selection */}
            <div className="md:mb-1 mb-[4rem]">
              <label className="block  font-medium text-sm md:text-base">Select skin color</label>
              {loadingSkinColors ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-t-2 border-b-2 border-[#79539f]"></div>
                </div>
              ) : (
                <div
                  className="flex gap-3 md:gap-4 overflow-x-auto h-fit py-8 px-2 "
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  {skinColors.map((color) => (
                    <button
                      key={color.id}
                      className={`flex-shrink-0 w-10 h-10 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                        formDataSection1.skinColor === color.colorCode
                          ? 'border-[#79539f] ring-1 ring-offset-1 ring-[#79539f] scale-110'
                          : 'border-gray-300 hover:border-[#79539f]'
                      }`}
                      style={{ backgroundColor: color.colorCode }}
                      onClick={() => updateFormDataSection1('skinColor', color.colorCode)}
                      title={`Skin tone ${color.id}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 md:border-gray-0 p-4 md:p-0 z-30">
              <button
                onClick={currentStep === 1 ? handleRegisterUser : handleNext}
                disabled={currentStep === 1 && !isAboutYouSectionValid()}
                className={`flex items-center justify-center w-full md:max-w-xs md:mx-auto px-6 py-3 md:py-3 rounded-md text-sm md:text-base font-medium transition-colors ${
                  currentStep === 1 && !isAboutYouSectionValid()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#4f2945] text-white hover:bg-[#3d1f35]'
                }`}
              >
                <span>Save</span>
                <FaArrowRight className="ml-2" size={16} />
              </button>
            </div>
          </div>
        )}

        {currentStep > 1 &&
          (selectedTab === 'studio' ? (
            <div className="flex flex-1 w-full ">
              {/* Left side - Form (50%) */}
              <div
                className={`${
                  showMobilePreview ? 'hidden md:block md:w-1/2' : 'md:w-1/2 w-full'
                } overflow-auto max-h-[calc(100vh-72px)] md:p-4 p-1 custom-scrollbar `}
              >
                <div className="md:px-6 py-4 px-3 font-semibold md:mb-1 mb-[2rem] relative">
                  {/* Steps */}
                  <div className="flex w-full items-center justify-between md:mb-6 mb-3 md:px-4 px-0 ">
                    <div
                      className="flex items-center md:ml-4 ml-1 cursor-pointer"
                      onClick={() => {
                        // Allow direct navigation to step 2
                        setCurrentStep(2);
                      }}
                    >
                      <div
                        className={`md:w-8 w-6 md:h-8 h-6 rounded-full ${
                          currentStep > 2
                            ? 'bg-green-500'
                            : currentStep === 2
                              ? 'bg-[#79539f]'
                              : 'bg-gray-200'
                        } ${
                          currentStep >= 2 ? 'text-white' : 'text-gray-500'
                        } flex items-center justify-center`}
                      >
                        {currentStep > 2 ? <FaCheckCircle size={16} /> : '1'}
                      </div>
                      <span
                        className={`ml-2 md:text-[1.15rem] text-[.8rem] ${
                          currentStep > 2
                            ? 'text-green-500'
                            : currentStep === 2
                              ? 'font-semibold'
                              : 'text-gray-500'
                        }`}
                      >
                        Select Outfit
                      </span>
                    </div>
                    <div
                      className="flex items-center md:ml-4 ml-1 cursor-pointer"
                      onClick={() => {
                        // Allow direct navigation to step 3
                        setCurrentStep(3);
                      }}
                    >
                      <div
                        className={`md:w-8 w-6 md:h-8 h-6 rounded-full ${
                          currentStep > 3
                            ? 'bg-green-500'
                            : currentStep === 3
                              ? 'bg-[#79539f]'
                              : 'bg-gray-200'
                        } ${
                          currentStep >= 3 ? 'text-white' : 'text-gray-500'
                        } flex items-center justify-center`}
                      >
                        {currentStep > 3 ? <FaCheckCircle size={16} /> : '2'}
                      </div>
                      <span
                        className={`ml-2 md:text-[1.15rem] text-[.8rem] ${
                          currentStep > 3
                            ? 'text-green-500'
                            : currentStep === 3
                              ? 'font-medium'
                              : 'text-gray-500'
                        }`}
                      >
                        Color
                      </span>
                    </div>
                    <div
                      className="flex items-center md:ml-4 ml-1 cursor-pointer"
                      onClick={() => {
                        // Allow direct navigation to step 4
                        setCurrentStep(4);
                      }}
                    >
                      <div
                        className={`md:w-8 w-6 md:h-8 h-6 rounded-full ${
                          currentStep === 4 ? 'bg-[#79539f]' : 'bg-gray-200'
                        } ${
                          currentStep === 4 ? 'text-white' : 'text-gray-500'
                        } flex items-center justify-center`}
                      >
                        3
                      </div>
                      <span
                        className={`ml-2 md:text-[1.15rem] text-[.8rem] ${
                          currentStep === 4 ? 'font-medium' : 'text-gray-500'
                        }`}
                      >
                        Stitch Options
                      </span>
                    </div>
                  </div>

                  {currentStep === 2 && (
                    <div className=" md:mb-8 mb-[3.5rem] flex flex-col gap-2">
                      <div>
                        <h2 className="md:text-[1.3rem] text-[1rem] font-medium md:mb-4 mb-2">
                          Select Outfit Type
                        </h2>
                        <div className="relative md:mb-6 mb-3">
                          <input
                            type="text"
                            placeholder="Search Outfit"
                            className="w-full px-4 py-2 pl-10 bg-gray-100 border-none rounded-md"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <FaSearch className="absolute left-3 top-2.5 text-gray-500" size={18} />
                        </div>

                        {loading ? (
                          <div className="flex justify-center items-center h-40">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#79539f]"></div>
                          </div>
                        ) : error ? (
                          <div className="text-red-500 text-center p-4">{error}</div>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 md:gap-7 gap-3 mb-12">
                              {filteredOutfitOptions.map((outfit) => (
                                <div
                                  key={outfit.outfit_index}
                                  className={`md:p-7 p-3 border rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all ${
                                    formDataSection234.selectedOutfit === outfit.outfit_name
                                      ? 'border-[#79539f]'
                                      : 'border-gray-200 shadow-md shadow-[#C1C7D899] hover:border-gray-300'
                                  }`}
                                  onClick={() => {
                                    handleOutfitSelect(outfit.outfit_name);
                                    setoutfit_index(outfit.outfit_index);
                                  }}
                                >
                                  <div className="w-12 h-12 mb-2">
                                    <img
                                      src={outfit.outfit_link}
                                      alt={outfit.outfit_details_title}
                                      width={64}
                                      height={64}
                                      className="object-contain w-full h-full"
                                    />
                                  </div>
                                  <span className="text-sm text-center">
                                    {outfit.outfit_details_title}
                                  </span>
                                </div>
                              ))}
                            </div>
                            {filteredOutfitOptions.length === 0 && searchTerm && (
                              <div className="text-center py-8 text-gray-500">
                                <p>No outfits found matching {searchTerm}</p>
                                <p className="text-sm mt-2">
                                  Try searching with different keywords
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className=" md:mb-8 mb-[2.5rem] flex flex-col gap-1">
                      <div className="mb-10">
                        <h2 className="text-xl font-medium mb-4">Select Color</h2>

                        {selectedOutfitDetails && selectedOutfitDetails.pieces > 1 ? (
                          <>
                            {/* Top Color */}
                            <div className="mb-6">
                              <div className="flex items-center gap-5 mb-5 ">
                                <label className="block mb-3 font-medium">Top</label>
                                <div className="flex gap-3 items-center">
                                  <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <div
                                      onClick={() => setShowPicker(!showPicker)}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '0.375rem', // same as Tailwind's rounded
                                        cursor: 'pointer',
                                        backgroundColor: toppcolor,
                                        border: '1px solid #ccc',
                                      }}
                                      title="Select color"
                                    />

                                    {showPicker && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: 'calc(100% + 8px)',
                                          left: 0,
                                          zIndex: 1000,
                                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                          borderRadius: 8,
                                          backgroundColor: '#fff',
                                          padding: 8,
                                        }}
                                      >
                                        <HexColorPicker
                                          color={toppcolor}
                                          onChange={(newColor) =>
                                            updateFormDataSection234('topColor', newColor)
                                          }
                                        />
                                        <button
                                          onClick={() => setShowPicker(false)}
                                          style={{
                                            marginTop: 8,
                                            padding: '4px 8px',
                                            border: 'none',
                                            background: '#357edd',
                                            color: 'white',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            width: '100%',
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <span className="ml-2 text-sm">
                                    {formDataSection234.topColor}
                                  </span>
                                </div>
                              </div>
                              {/* Keep the existing color options as presets */}
                              <div className="flex gap-3 ">
                                {colorOptions.map((color) => (
                                  <div
                                    key={`top-${color.id}`}
                                    className={`w-8 h-8 rounded cursor-pointer ${
                                      formDataSection234.topColor === color.color
                                        ? 'ring-2 ring-offset-2 ring-[#79539f]'
                                        : ''
                                    }`}
                                    style={{
                                      backgroundColor: color.color,
                                      border:
                                        color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                                    }}
                                    onClick={() =>
                                      updateFormDataSection234('topColor', color.color)
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Bottom Color */}
                            <div className="mb-6">
                              <div className="flex items-center gap-5 mb-5 ">
                                <label className="block mb-3 font-medium">Bottom</label>
                                <div className="flex gap-3 items-center">
                                  <div style={{ position: 'relative', display: 'inline-block' }}>
                                    {/* Color preview box to open picker */}
                                    <div
                                      onClick={() => setShowPickerone(!showPicker)}
                                      style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: '0.375rem', // rounded corners similar to Tailwind 'rounded'
                                        cursor: 'pointer',
                                        backgroundColor: bottommcolor,
                                        border: '1px solid #ccc',
                                        display: 'inline-block',
                                      }}
                                      title="Select bottom color"
                                    />

                                    {/* Pop-up color picker */}
                                    {showPickerone && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: 'calc(100% + 8px)',
                                          left: 0,
                                          zIndex: 1000,
                                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                          borderRadius: 8,
                                          backgroundColor: '#fff',
                                          padding: 8,
                                        }}
                                      >
                                        <HexColorPicker
                                          color={bottommcolor}
                                          onChange={(newColor) =>
                                            updateFormDataSection234('bottomColor', newColor)
                                          }
                                        />
                                        <button
                                          onClick={() => setShowPickerone(false)}
                                          style={{
                                            marginTop: 8,
                                            padding: '4px 8px',
                                            border: 'none',
                                            background: '#357edd',
                                            color: 'white',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                            width: '100%',
                                          }}
                                        >
                                          Close
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <span className="ml-2 text-sm">
                                    {formDataSection234.bottomColor}
                                  </span>
                                </div>
                              </div>
                              {/* Keep the existing color options as presets */}
                              <div className="flex gap-3">
                                {colorOptions.map((color) => (
                                  <div
                                    key={`bottom-${color.id}`}
                                    className={`w-8 h-8 rounded cursor-pointer ${
                                      formDataSection234.bottomColor === color.color
                                        ? 'ring-2 ring-offset-2 ring-[#79539f]'
                                        : ''
                                    }`}
                                    style={{
                                      backgroundColor: color.color,
                                      border:
                                        color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                                    }}
                                    onClick={() =>
                                      updateFormDataSection234('bottomColor', color.color)
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                          </>
                        ) : (
                          /* Single Color for one-piece outfits */
                          <div className="mb-6">
                            <div className="flex items-center gap-5 mb-5 ">
                              <label className="block mb-3 font-medium">
                                {selectedOutfitDetails?.outfit_type === 'BOTTOM' ? 'Bottom' : 'Top'}
                              </label>
                              <div className="flex gap-3 items-center">
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                  <div
                                    onClick={() =>
                                      selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                        ? setShowPickerone(!showPickerone)
                                        : setShowPicker(!showPicker)
                                    }
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: '0.375rem',
                                      cursor: 'pointer',
                                      backgroundColor:
                                        selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                          ? bottommcolor
                                          : toppcolor,
                                      border: '1px solid #ccc',
                                    }}
                                    title="Select color"
                                  />

                                  {((selectedOutfitDetails?.outfit_type === 'BOTTOM' &&
                                    showPickerone) ||
                                    (selectedOutfitDetails?.outfit_type !== 'BOTTOM' &&
                                      showPicker)) && (
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 8px)',
                                        left: 0,
                                        zIndex: 1000,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                                        borderRadius: 8,
                                        backgroundColor: '#fff',
                                        padding: 8,
                                      }}
                                    >
                                      <HexColorPicker
                                        color={
                                          selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                            ? bottommcolor
                                            : toppcolor
                                        }
                                        onChange={(newColor) =>
                                          selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                            ? updateFormDataSection234('bottomColor', newColor)
                                            : updateFormDataSection234('topColor', newColor)
                                        }
                                      />
                                      <button
                                        onClick={() =>
                                          selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                            ? setShowPickerone(false)
                                            : setShowPicker(false)
                                        }
                                        style={{
                                          marginTop: 8,
                                          padding: '4px 8px',
                                          border: 'none',
                                          background: '#357edd',
                                          color: 'white',
                                          borderRadius: 4,
                                          cursor: 'pointer',
                                          width: '100%',
                                        }}
                                      >
                                        Close
                                      </button>
                                    </div>
                                  )}
                                </div>
                                <span className="ml-2 text-sm">
                                  {selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                    ? formDataSection234.bottomColor
                                    : formDataSection234.topColor}
                                </span>
                              </div>
                            </div>
                            {/* Keep the existing color options as presets */}
                            <div className="flex gap-3 ">
                              {colorOptions.map((color) => (
                                <div
                                  key={`single-${color.id}`}
                                  className={`w-8 h-8 rounded cursor-pointer ${
                                    (selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                      ? formDataSection234.bottomColor
                                      : formDataSection234.topColor) === color.color
                                      ? 'ring-2 ring-offset-2 ring-[#79539f]'
                                      : ''
                                  }`}
                                  style={{
                                    backgroundColor: color.color,
                                    border:
                                      color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                                  }}
                                  onClick={() =>
                                    selectedOutfitDetails?.outfit_type === 'BOTTOM'
                                      ? updateFormDataSection234('bottomColor', color.color)
                                      : updateFormDataSection234('topColor', color.color)
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Fabric Image */}
                        <div className="mb-6">
                          <label className="block mb-3 font-medium">Fabric Image</label>
                          <p className="text-sm text-gray-500 mb-3">
                            If you have the fabric upload image
                          </p>
                          <BulkImageUploadField
                            label="Upload Fabric Images"
                            placeholder="Upload Fabric Images"
                            type="file"
                            required={false}
                            multiple={true}
                            maxUpload={1}
                            fileTypeRequired={false}
                            value={formDataSection234.fabricImageTop}
                            onChange={(value: any) => {
                              updateFormDataSection234('fabricImageTop', value);
                            }}
                          />

                          {selectedOutfitDetails && selectedOutfitDetails.pieces > 1 && (
                            <div className="mt-4">
                              <label className="block mb-3 font-medium">Bottom Fabric Image</label>
                              <BulkImageUploadField
                                label="Upload Bottom Fabric Images"
                                placeholder="Upload Bottom Fabric Images"
                                type="file"
                                required={false}
                                multiple={true}
                                maxUpload={1}
                                fileTypeRequired={false}
                                value={formDataSection234.fabricImageBottom}
                                onChange={(value: any) => {
                                  updateFormDataSection234('fabricImageBottom', value);
                                }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Color and Fabric Instructions */}
                        <div>
                          <label className="block mb-3 font-medium">
                            Color and Fabric Instructions
                          </label>
                          <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg resize-none h-24 bg-gray-50 text-gray-500"
                            placeholder="Add any color and fabric instructions here..."
                            value={formDataSection234.colorFabricInstructions}
                            onChange={(e) =>
                              updateFormDataSection234('colorFabricInstructions', e.target.value)
                            }
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            This section is not mandatory
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className=" md:mb-8 mb-[2rem] flex flex-col gap-1">
                      {loadingStitchOptions ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#79539f]"></div>
                        </div>
                      ) : error ? (
                        <div className="text-red-500 text-center p-4">{error}</div>
                      ) : (
                        <>
                          {generatedImageUrl && (
                            <div className=" w-full md:hidden flex gap-2 items-center justify-end">
                              <img src={woman} alt="" className="h-12 aspect-auto pb-2  " />
                              <button
                                onClick={() => {
                                  setShowMobilePreview(true);
                                }}
                                className="bg-[#4F2945] text-[.8rem] font-semibold px-3 py-1.5 text-white flex items-center rounded-xl gap-2"
                              >
                                Preview <img src={preview} alt="" className="h-4 aspect-auto " />
                              </button>
                            </div>
                          )}
                          {stitchOptionGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className="md:mb-8 mb-2">
                              <h2 className="text-xl font-medium md:mb-4 mb-3">{group.side}</h2>

                              {group.stitch_options.map((option, optionIndex) => (
                                <div key={optionIndex} className="mb-6">
                                  <label className="block md:mb-3 mb-2 font-semibold ">
                                    {option.label}
                                  </label>

                                  {option.type === 'radio' && (
                                    <div className="flex flex-wrap gap-3">
                                      {option.options.map((choice, choiceIndex) => {
                                        // Check if this option is selected
                                        const isSelected =
                                          formDataSection234.stitchOptions[option.label] !== null &&
                                          String(formDataSection234.stitchOptions[option.label]) ===
                                            String(choice.value);

                                        return (
                                          <button
                                            key={choiceIndex}
                                            className={`md:px-4 px-3 md:py-2 py-1.5 rounded-full text-sm font-medium ${
                                              isSelected
                                                ? 'bg-[#79539f] text-white'
                                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() =>
                                              updateStitchOption(option.label, choice.value)
                                            }
                                          >
                                            {choice.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}

                                  {option.type === 'counter' && (
                                    <div className="flex items-center">
                                      <button
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-50"
                                        onClick={() => {
                                          // Initialize to min_value if null
                                          if (
                                            formDataSection234.stitchOptions[option.label] === null
                                          ) {
                                            updateStitchOption(
                                              option.label,
                                              parseInt(option.min_value || '0')
                                            );
                                          } else {
                                            decrementCounter(option.label, option.min_value);
                                          }
                                        }}
                                      >
                                        <FaMinus size={16} />
                                      </button>
                                      <div className="w-16 h-10 flex items-center justify-center border-t border-b border-gray-300">
                                        {formDataSection234.stitchOptions[option.label] !== null
                                          ? formDataSection234.stitchOptions[option.label]
                                          : '-'}
                                      </div>
                                      <button
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-50"
                                        onClick={() => {
                                          // Initialize to min_value if null
                                          if (
                                            formDataSection234.stitchOptions[option.label] === null
                                          ) {
                                            updateStitchOption(
                                              option.label,
                                              parseInt(option.min_value || '0')
                                            );
                                          } else {
                                            incrementCounter(option.label, option.max_value);
                                          }
                                        }}
                                      >
                                        <FaPlus size={16} />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ))}

                          {/* Special Instructions */}
                          <div className="mb-8">
                            <label className="block mb-3 font-medium">Special Instructions</label>
                            <div className="relative">
                              <div className="absolute top-1 left-2 text-[#8227ff]">
                                <img src={aiimage} alt="" className=" h-8 mt-2 aspect-auto " />
                              </div>
                              <textarea
                                className="w-full p-4 pl-12 border border-gray-200 rounded-lg resize-none h-24 md:mb-1 mb-6"
                                placeholder="Add any special instructions here..."
                                value={formDataSection234.specialInstructions}
                                onChange={(e) =>
                                  updateFormDataSection234('specialInstructions', e.target.value)
                                }
                              />
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div
                            className={`fixed flex items-center justify-between md:bottom-1 bottom-2 left-0 gap-4 bg-transparent py-4 px-6 transition-all duration-500 ease-in-out w-full ${
                              showStudio
                                ? 'md:w-[calc(58%-300px)] md:ml-[300px]'
                                : 'md:w-1/2 md:ml-0'
                            }`}
                          >
                            <button
                              className="flex-1 flex items-center md:text-[1rem] text-[.9rem] justify-center gap-2 px-6 py-3 bg-[#fef6ea] text-[#4f2945] rounded-md"
                              onClick={handleClearAll}
                            >
                              <FaSync className="md:block hidden" size={18} />
                              <span>Clear All</span>
                            </button>
                            <button
                              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#4f2945] text-white rounded-md"
                              onClick={() =>
                                handleGeneratePreview(currentVersionEntry || undefined)
                              }
                              // disabled={isGeneratingImage || animationStep !== 'idle'}
                            >
                              {animationStep === 'ticking' ? (
                                <>
                                  {/* <div className="animate-pulse h-5 w-5 bg-green-500 rounded-full"></div> */}
                                  <span>Processing...</span>
                                </>
                              ) : isGeneratingImage || animationStep === 'loading' ? (
                                <>
                                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                  <span>Generating...</span>
                                </>
                              ) : (
                                <>
                                  <FaEye className="md:block hidden" size={18} />
                                  <span className="md:text-[1rem] text-[.9rem] leading-5 text-nowrap">
                                    Generate Preview
                                  </span>
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Next Button - Only show if not on the last step */}
                  {currentStep < 4 && (
                    <div
                      className={`fixed md:bottom-1 bottom-2 left-0 w-full bg-transparent py-4 px-6 z-10 transition-all duration-500 ease-in-out ${
                        showStudio ? 'md:w-[calc(100%-350px)] ' : 'md:w-1/2 md:ml-0'
                      }`}
                    >
                      <button
                        onClick={handleNext}
                        disabled={
                          (currentStep === 1 && !isAboutYouSectionValid()) ||
                          (currentStep === 2 && !formDataSection234.selectedOutfit)
                        }
                        className={`flex items-center justify-center w-full max-w-xs mx-auto px-6 py-3 rounded-md ${
                          (currentStep === 1 && !isAboutYouSectionValid()) ||
                          (currentStep === 2 && !formDataSection234.selectedOutfit)
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#4f2945] text-white'
                        }`}
                      >
                        <span>Next</span>
                        <FaArrowRight className="ml-2" size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Vertical divider */}
              <div
                className={`w-1 bg-[#FEF6EA] ${showMobilePreview ? 'hidden' : 'md:block hidden'}`}
              ></div>

              {/* Right side - Preview (50%) */}
              <div
                className={`${
                  showMobilePreview ? 'w-full md:w-1/2' : 'w-1/2 md:block hidden'
                } md:p-6 p-4 sticky top-0 min-h-[calc(100vh-72px)] overflow-y-scroll`}
              >
                <div className="flex items-center justify-between md:mb-6 mb-3">
                  <div className="flex items-center">
                    <TiArrowLeft
                      onClick={() => {
                        setShowMobilePreview(false);
                      }}
                      className={`${
                        showMobilePreview ? ' block' : ' hidden'
                      } size-8 cursor-pointer`}
                    />
                    <h2 className="text-xl font-medium ">Preview</h2>
                  </div>
                  {isImageLoaded && (
                    <div className="flex items-center md:gap-7 gap-4">
                      <img
                        src={share}
                        alt="Share outfit"
                        className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={() => setShowShareModal(true)}
                      />
                      {isDownloading ? (
                        <div className="md:h-8 h-6 flex items-center justify-center">
                          <svg
                            className="animate-spin h-6 w-6 "
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="#79539F"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="#79539F"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                        </div>
                      ) : (
                        <img
                          src={download}
                          alt="Download outfit"
                          className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                          onClick={handleDownloadImage}
                        />
                      )}

                      <img
                        onClick={() => handleShare('whatsapp')}
                        src={whatapp}
                        alt=""
                        className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                      />
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-3xl min-h-[calc(100vh-192px)] max-h-[calc(100vh-152px)] flex flex-col items-center justify-center py-4 flex-wrap overflow-y-scroll md:pt-[4rem custom-scrollbar">
                  {currentStep === 2 && !formDataSection234.selectedOutfit && (
                    <>
                      <div className="relative mb-4">
                        <div className="bg-white border border-[#79539F] rounded-xl p-4 flex items-center gap-3 max-w-xs">
                          <img src={woman} alt="" className="h-12 aspect-auto " />
                          <div className="font-medium">Let&apos;s build your look</div>
                        </div>
                        <div className="absolute  -bottom-4 left-6 w-0 h-0 border-l-[2px] border-l-transparent border-t-[16px] border-t-[#79539F] border-r-[12px] border-r-transparent rotate-"></div>
                      </div>
                      <div className="text-center mt-8">
                        <h3 className="text-3xl font-bold mb-2">Start selecting</h3>
                        <h3 className="text-3xl font-bold mb-2">options to visualize</h3>
                        <h3 className="text-3xl font-bold">your dream outfit</h3>
                      </div>
                    </>
                  )}

                  {currentStep === 2 && formDataSection234.selectedOutfit && (
                    <div className="w-full flex flex-col items-center justify-between">
                      <div className="flex items-center gap-3 mb-6">
                        <img src={woman} alt="" className=" h-12 aspect-auto " />
                        <div className="font-medium text-xl">
                          {selectedOutfitDetails?.outfit_details_title ||
                            formDataSection234.selectedOutfit}
                        </div>
                      </div>

                      {selectedOutfitDetails && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="font-medium mb-2">Details:</h3>
                            <ul className="space-y-1 text-sm">
                              <li>- {selectedOutfitDetails.pieces} piece(s)</li>
                              <li>
                                -{' '}
                                {selectedOutfitDetails.stitch_options_exist
                                  ? 'Has stitch options'
                                  : 'No stitch options'}
                              </li>
                              <li>
                                -{' '}
                                {selectedOutfitDetails.portfolio_eligible
                                  ? 'Portfolio eligible'
                                  : 'Not portfolio eligible'}
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="w-full flex flex-col items-center justify-between">
                      <div className="flex items-center gap-3 mb-6">
                        <img src={woman} alt="" className="h-12 aspect-auto " />
                        <div className="font-medium text-xl">
                          {selectedOutfitDetails?.outfit_details_title ||
                            formDataSection234.selectedOutfit}
                        </div>
                      </div>

                      <div className="space-y-6">
                        {selectedOutfitDetails && selectedOutfitDetails.pieces > 1 ? (
                          <>
                            <div>
                              <h3 className="font-medium mb-2">Top:</h3>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-center mt-2">
                                  - Color:{' '}
                                  <span
                                    className="ml-2 w-4 h-4 inline-block rounded"
                                    style={{
                                      backgroundColor: formDataSection234.topColor || '#cccccc',
                                    }}
                                  ></span>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <h3 className="font-medium mb-2">Bottom:</h3>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-center mt-2">
                                  - Color:{' '}
                                  <span
                                    className="ml-2 w-4 h-4 inline-block rounded"
                                    style={{
                                      backgroundColor: formDataSection234.bottomColor || '#cccccc',
                                    }}
                                  ></span>
                                </li>
                              </ul>
                            </div>
                          </>
                        ) : (
                          <div>
                            <h3 className="font-medium mb-2">Color:</h3>
                            <ul className="space-y-1 text-sm">
                              <li className="flex items-center mt-2">
                                <span
                                  className="ml-2 w-4 h-4 inline-block rounded"
                                  style={{
                                    backgroundColor: formDataSection234.topColor || '#cccccc',
                                  }}
                                ></span>
                              </li>
                            </ul>
                          </div>
                        )}

                        {formDataSection234.colorFabricInstructions && (
                          <div className="w-fulL h-fit ">
                            <h3 className="font-medium mb-2">Color and Fabric Instructions:</h3>
                            <p className="text-sm italic flex flex-wrap h-fit text-wrap ">
                              {formDataSection234.colorFabricInstructions}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="w-full flex flex-col items-center justify-between">
                      {animationStep === 'loading' || isGeneratingImage ? (
                        // Show loader while generating image
                        <div className="flex flex-col items-center justify-center h-[400px]">
                          <img
                            src={Ai_refresh}
                            alt="Loading..."
                            className="h-[15rem] w-[15rem] mb-4"
                          />
                          <p className="text-lg font-medium text-gray-700">
                            Adding Final Details...
                          </p>
                          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
                        </div>
                      ) : animationStep === 'complete' && generatedImageUrl ? (
                        // Display the generated image when available
                        <div className="w-full flex flex-col items-center justify-center">
                          {loadingImageVersion ? (
                            // Show loader while image version is changing
                            <div className="flex flex-col items-center justify-center">
                              <img
                                src={Ai_refresh}
                                alt="Loading new version..."
                                className="h-[15rem] w-[15rem] mb-4"
                              />
                              <p className="text-lg font-medium text-gray-700">
                                Loading version...
                              </p>
                              <p className="text-sm text-gray-500 mt-2">Please wait</p>
                            </div>
                          ) : (
                            <div className="w-full h-full object-contain flex flex-col items-center ">
                              <img
                                src={generatedImageUrl}
                                alt="Generated outfit preview"
                                onLoad={() => setIsImageLoaded(true)}
                                onError={() => setIsImageLoaded(false)}
                                className="w-full max-w-full h-auto md:max-h-[calc(100vh-250px)] max-h-[calc(100vh-320px)] object-contain rounded-lg"
                              />
                              <div className="text-sm text-gray-600 mb-4">
                                AI-generated preview based on your selections
                              </div>
                              <div className=" relative flex items-center justify-between w-full px-4 py-2">
                                {/* Avatars + Designer Count */}
                                <div className="flex items-center">
                                  <div className="flex -space-x-2">
                                    <img
                                      src={designerone}
                                      alt="Designer 1"
                                      className="w-7 h-7 md:w-6 md:h-6  rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                      src={designertwo}
                                      alt="Designer 2"
                                      className="w-7 h-7 md:w-6 md:h-6 rounded-full border-2 border-white object-cover"
                                    />
                                    <img
                                      src={designerthree}
                                      alt="Designer 3"
                                      className="w-7 h-7 md:w-6 md:h-6 rounded-full border-2 border-white object-cover"
                                    />
                                  </div>
                                  <span className="  ml-3 font-medium hidden md:block text-sm text-gray-800 whitespace-nowrap">
                                    500+ designers available
                                  </span>
                                </div>
                                <div className=" absolute font-medium left-4 top-[42px]  text-sm text-gray-800 whitespace-nowrap block  md:hidden ">
                                  500+ designers available
                                </div>

                                {/* Toggle Card */}
                                <div className="flex items-center bg-[#FCF7F4] rounded-xl py-2 px-4">
                                  <span className="font-semibold text-sm text-black mr-3 ">
                                    {currentVersionEntry?.collective
                                      ? 'Added to collective'
                                      : 'Add to collective'}
                                  </span>
                                  <button
                                    disabled={collectiveLoading}
                                    type="button"
                                    aria-pressed={!!currentVersionEntry?.collective}
                                    className={`
        w-10 h-6 flex items-center rounded-full transition-colors duration-200
        ${currentVersionEntry?.collective ? 'bg-[#79539f]' : 'bg-gray-200'}
        relative
      `}
                                    style={{ boxShadow: '0px 2px 4px #0001' }}
                                    onClick={handleCollectiveToggle}
                                  >
                                    <span
                                      className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200"
                                      style={{
                                        transform: currentVersionEntry?.collective
                                          ? 'translateX(16px)'
                                          : 'translateX(0px)',
                                      }}
                                    />
                                  </button>
                                  {/* <div className=" absolute left-8  bottom- font-medium text-sm text-gray-800 whitespace-nowrap block  md:hidden ">
                                    500+ designers available
                                  </div> */}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Show the regular preview content with animated ticks
                        <>
                          <div className="w-full flex flex-col items-center justify-between">
                            <div className="flex items-center gap-3 mb-6">
                              <img src={woman} alt="" className="h-12 aspect-auto " />
                              <div className="font-medium text-xl">
                                {selectedOutfitDetails?.outfit_details_title ||
                                  formDataSection234.selectedOutfit}
                              </div>
                            </div>

                            <div className=" pb-8">
                              {stitchOptionGroups.map((group, groupIndex) => (
                                <div key={groupIndex}>
                                  <h3 className="font-medium mb-2">{group.side}:</h3>
                                  <ul className="space-y-1 text-sm">
                                    {group.stitch_options.map((option, optionIndex) => {
                                      // Find the label for radio options
                                      let displayValue =
                                        formDataSection234.stitchOptions[option.label];
                                      const isSelected = displayValue !== null;
                                      const isAnimatingTick =
                                        animationStep === 'ticking' &&
                                        tickedOptions.has(option.label);

                                      // Only render if the option is selected
                                      if (!isSelected) {
                                        return null;
                                      }

                                      if (option.type === 'radio') {
                                        const selectedOption = option.options.find(
                                          (opt) => String(opt.value) === String(displayValue)
                                        );

                                        if (selectedOption) {
                                          displayValue = selectedOption.label;
                                        }
                                      }

                                      return (
                                        <li
                                          key={optionIndex}
                                          className="flex items-center justify-between gap-8 "
                                        >
                                          <span className="flex-1">
                                            - {option.label}: {displayValue}
                                          </span>
                                          <div className="ml-2 flex items-center">
                                            <div className="flex items-center">
                                              {/* Animated tick */}
                                              {isAnimatingTick ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                                  <FaCheckCircle className="text-white text-xs" />
                                                </div>
                                              ) : animationStep === 'idle' ? (
                                                <div className="w-5 h-5 bg-green-500 rounded-full fle items-center justify-center hidden">
                                                  <FaCheckCircle className="text-white text-xs" />
                                                </div>
                                              ) : (
                                                <div className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center">
                                                  <img
                                                    src={Ai_refresh1}
                                                    alt="Loading..."
                                                    className="h-5 w-5 "
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </li>
                                      );
                                    })}
                                    {group.side === 'Top' && (
                                      <li className="flex items-center mt-2 justify-between">
                                        <span className="flex-1">
                                          - Color:{' '}
                                          <span
                                            className="ml-2 w-4 h-4 inline-block rounded"
                                            style={{
                                              backgroundColor:
                                                formDataSection234.topColor || '#cccccc',
                                            }}
                                          ></span>
                                        </span>
                                        <div className="ml-2">
                                          {tickedOptions.has('topColor') &&
                                          animationStep === 'ticking' ? (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                              <FaCheckCircle className="text-white text-xs" />
                                            </div>
                                          ) : animationStep === 'idle' ? (
                                            <div className="w-5 h-5 bg-green-500 rounded-full fle hidden items-center justify-center">
                                              <FaCheckCircle className="text-white text-xs" />
                                            </div>
                                          ) : (
                                            <div className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center">
                                              <img
                                                src={Ai_refresh1}
                                                alt="Loading..."
                                                className="h-5 w-5 "
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </li>
                                    )}
                                    {group.side === 'Bottom' && (
                                      <li className="flex items-center mt-2 justify-between">
                                        <span className="flex-1">
                                          - Color:{' '}
                                          <span
                                            className="ml-2 w-4 h-4 inline-block rounded"
                                            style={{
                                              backgroundColor:
                                                formDataSection234.bottomColor || '#cccccc',
                                            }}
                                          ></span>
                                        </span>
                                        <div className="ml-2">
                                          {tickedOptions.has('bottomColor') &&
                                          animationStep === 'ticking' ? (
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                                              <FaCheckCircle className="text-white text-xs" />
                                            </div>
                                          ) : animationStep === 'idle' ? (
                                            <div className="w-5 h-5 bg-green-500 rounded-full fle hidden items-center justify-center">
                                              <FaCheckCircle className="text-white text-xs" />
                                            </div>
                                          ) : (
                                            <div className="w-6 h-6 bg-transparent rounded-full flex items-center justify-center">
                                              <img
                                                src={Ai_refresh1}
                                                alt="Loading..."
                                                className="h-5 w-5 "
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>

                            <div className="md:w-[500px] h-fit overflow-x-hidden gap-5 mb-[2rem]">
                              {formDataSection234.colorFabricInstructions && (
                                <div className="w-fulL h-fit ">
                                  <h3 className="font-medium mb-2">
                                    Color and Fabric Instructions:
                                  </h3>
                                  <p className="text-sm italic flex flex-wrap h-fit text-wrap ">
                                    {formDataSection234.colorFabricInstructions}
                                  </p>
                                </div>
                              )}
                              {formDataSection234.specialInstructions && (
                                <div>
                                  <h3 className="font-medium mb-2">Special Instructions:</h3>
                                  <p className="text-sm italic flex flex-wrap h-fit text-wrap">
                                    {formDataSection234.specialInstructions}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : selectedTab === 'lookbook' ? (
            <div className="flex flex-1 w-full ">
              {(() => {
                switch (selectlookbook) {
                  case 'Explore Designers':
                    return (
                      <Lookbook
                        portfolios={portfolios}
                        loading={loadingPortfolios}
                        loadingMore={loadingPortfoliosMore}
                        selected={selectedPortfolio}
                        onSelect={(p) => setSelectedPortfolio(p)}
                        onRefresh={() => fetchPortfolios(0, false)}
                        onLoadMore={handleLoadMorePortfolios}
                        searchTerm={searchhTerm}
                        onSearchChange={(v) => {
                          setSearchhTerm(v);

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
                    );
                  case 'Outfits':
                    return (
                      <div>
                        {/* Add your Outfits component or UI here */}
                        <p>Outfits section coming soon...</p>
                      </div>
                    );
                  case 'Collective':
                    return (
                      <Collective
                        data={collectiveItems}
                        loading={loadingCollective}
                        onLoadMore={handleLoadMoreCollective}
                        setSelectlookbook={setSelectlookbook}
                        pageInfo={{
                          currentPage: collectivePage,
                          totalPages: collectiveTotalPages,
                          lastPage: collectiveLastPage,
                          totalItems: collectiveItems.length,
                        }}
                      />
                    );

                  case 'My Designs':
                    return (
                      <div>
                        {/* Add your My Designs component or UI here */}
                        <p>My Designs section coming soon...</p>
                      </div>
                    );
                  case 'Favorites':
                    return (
                      <Favourites
                        data={favouriteItems}
                        loading={loadingFavourites}
                        onLoadMore={handleLoadMoreFavourites}
                        pageInfo={{
                          currentPage: favouritePage,
                          totalPages: favouriteTotalPages,
                          lastPage: favouriteLastPage,
                          totalItems: favouriteItems.length,
                        }}
                      />
                    );

                    return (
                      <div>
                        {/* Add your Favorites component or UI here */}
                        <p>Favorites section coming soon...</p>
                      </div>
                    );
                  case 'Brought to life':
                    return (
                      <div>
                        {/* Add your Brought to life component or UI here */}
                        <p>Brought to life section coming soon...</p>
                      </div>
                    );
                  case 'Awaiting Artisan':
                    return (
                      <div>
                        {/* Add your Awaiting Artisan component or UI here */}
                        <p>Awaiting Artisan section coming soon...</p>
                      </div>
                    );
                  default:
                    return null;
                }
              })()}
            </div>
          ) : null)}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500] px-4">
            {/* White card container */}
            <div className="bg-white rounded-2xl shadow-lg flex flex-col items-center max-w-[430px] w-full px-4 sm:px-6 py-6">
              {/* Title */}
              {/* Title + Close Button */}
              <div className="w-full flex items-center justify-between mb-6">
                <div className="text-left font-medium text-[17px]">Share public link to chat</div>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Warning Banner */}
              <div className="w-full rounded-2xl bg-[#d4c5ab] flex items-start px-6 py-4 mb-6">
                <div className="mt-0.5 mr-3 shrink-0">
                  <span className="inline-block w-6 h-6 rounded-full border border-[#00000022] bg-[#fff7ea] flex items-center justify-center">
                    <span className="text-[#62563c] font-bold text-base">i</span>
                  </span>
                </div>
                <div className="text-[14px] leading-snug flex-1">
                  <div className="font-semibold">This image may include personal information</div>
                  <div className="text-[#333] mt-1">
                    Take a moment to check the content before the sharing the link.
                  </div>
                </div>
              </div>

              {/* Privacy Subtext */}
              <div className="text-gray-500 text-[15px] mb-8 text-left w-full leading-snug">
                Your name, custom instructions, and any messages you add after sharing stay private
              </div>

              {/* Create Link Button */}
              <button
                onClick={async () => {
                  setIsGeneratingShareLink(true);
                  const ok = await handleGenerateShareLink();
                  setIsGeneratingShareLink(false);
                  setShowShareModal(false);

                  if (ok) {
                    setShowShareSuccessModal(true);
                  }
                }}
                className="flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-full bg-[#493041] hover:bg-[#2d1b26] text-white text-[14px] font-medium transition disabled:opacity-70 mx-auto"
                disabled={isGeneratingShareLink}
              >
                <LuLink size={20} className="mr-1" />
                {isGeneratingShareLink ? 'Generating...' : 'Create Link'}
              </button>
            </div>
          </div>
        )}
        {showShareSuccessModal && shareLink && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500] px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Your Design</h3>
                <button
                  onClick={() => setShowShareSuccessModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Share Link with copy button */}
              <div className="flex items-center border border-gray-300 rounded-md p-2 mb-6">
                <input
                  type="text"
                  readOnly
                  value={shareLink}
                  className="flex-grow border-none focus:outline-none text-gray-700 text-sm px-2 truncate"
                  aria-label="Share link"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast.success('Link copied to clipboard!');
                  }}
                  className="ml-2 p-2 rounded bg-[#79539F] hover:bg-[#633a84] text-white transition"
                  title="Copy share link"
                  aria-label="Copy share link"
                >
                  <FaCopy size={18} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <img src={whatapp} alt="WhatsApp" className="h-6 w-6" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => handleShare('telegram')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaTelegramPlane className="h-6 w-6 text-[#79539F]" />
                  <span>Telegram</span>
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaEnvelope className="h-6 w-6 text-[#79539F]" />
                  <span>Email</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaTwitter className="h-6 w-6 text-[#79539F]" />
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaFacebookF className="h-6 w-6 text-[#79539F]" />
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FaCopy className="h-6 w-6 text-[#79539F]" />
                  <span>Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
