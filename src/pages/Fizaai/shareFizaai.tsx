'use client';

import { useState, useEffect } from 'react';
import BulkImageUploadField from '../../components/FormComponents/BulkImageUploadField';
import './sidebar.css';
import { useNavigate } from 'react-router-dom';

//import Image from "next/image"
import {
  FaArrowRight,
  FaCheckCircle,
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

import aiimage from '../../assets/images/ai.png';
import share from '../../assets/images/share1.png';
import download from '../../assets/images/download.png';
import whatapp from '../../assets/images/whatsapp1.png';
import woman from '../../assets/images/woman.png';
import preview from '../../assets/images/preview.png';
import sidebar from '../../assets/images/view_sidebar.png';
import lookbook from '../../assets/images/Style.png';

import Ai_refresh from '../../assets/icons/Ai_Loader.gif';
import Ai_refresh1 from '../../assets/icons/AI_Refresh.gif';
import { api } from '../../utils/apiRequest';
import { TiArrowLeft } from 'react-icons/ti';
import { HexColorPicker } from 'react-colorful';

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

// Add color options array after outfitOptions
const colorOptions = [
  { id: 'blue', color: '#5578dc' },
  { id: 'red', color: '#e74c3c' },
  { id: 'green', color: '#32a071' },
  { id: 'purple', color: '#79539f' },
  { id: 'black', color: '#323232' },
  { id: 'white', color: '#ffffff' },
];

export default function shareFizaaI() {
  // Current step (1: About You, 2: Select Outfit, 3: Color, 4: Stitch Options)
  const [currentStep, setCurrentStep] = useState(2);
  const [outfitOptions, setOutfitOptions] = useState<OutfitOption[]>([]);
  const [stitchOptionGroups, setStitchOptionGroups] = useState<StitchOptionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStitchOptions, setLoadingStitchOptions] = useState(false);
  const [loadingImageVersion, setLoadingImageVersion] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingVersionData, setPendingVersionData] = useState<VersionData | null>(null);

  const [outfit_index, setoutfit_index] = useState<number | undefined>(undefined);

  const [showStudio, setShowStudio] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'studio' | 'lookbook'>('studio');
  const [sidebarAnimating, setSidebarAnimating] = useState(false);
  const [currentVersionEntry, setCurrentVersionEntry] = useState<VersionData | null>(null);

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
  const [topFabric, setTopFabric] = useState<string | null>(null);
  const [bottomFabric, setBottomFabric] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [animationStep, setAnimationStep] = useState<'idle' | 'ticking' | 'loading' | 'complete'>(
    'idle'
  );
  const [tickedOptions, setTickedOptions] = useState<Set<string>>(new Set());
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const navigate = useNavigate();

  const handleShowStudio = () => {
    setSidebarAnimating(true);
    // Use setTimeout to ensure the element is rendered before applying the show animation
    setTimeout(() => {
      setShowStudio(true);
    }, 10);
  };

  const handleShare = (platform: string) => {
    const shareText = `Check out my AI-generated outfit design on Darzee!`;
    const shareUrl = window.location.href;

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
        const copyText = `${shareText} ${shareUrl}`;
        navigator.clipboard.writeText(copyText).then(() => {
          alert('Link copied to clipboard!');
        });
        break;
      }
      default:
        break;
    }

    setShowShareModal(false);
  };

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
      if (!formDataSection1.gender) {
        return;
      }

      setLoading(true);

      try {
        const response = await api.getRequest(
          `master-data/outfits/?gender=${formDataSection1.gender}`
        );

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

    fetchOutfitOptions();
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
          // Only reset if the outfit type changes, otherwise preserve selection
          setFormDataSection234((prev) => ({
            ...prev,
            stitchOptions:
              prev.selectedOutfit !== formDataSection234.selectedOutfit
                ? initialStitchOptions
                : prev.stitchOptions,
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

    fetchStitchOptions();
  }, [currentStep, formDataSection234.selectedOutfit, outfit_index]);

  // Add this useEffect to keep formDataSection234.aboutYou in sync with formDataSection1
  useEffect(() => {
    setFormDataSection234((prev) => ({
      ...prev,
      aboutYou: formDataSection1,
    }));
  }, [formDataSection1]);

  //   const fetchBodyTypes = async () => {
  //     if (!formDataSection1.gender) {
  //       return;
  //     }

  //     setLoadingBodyTypes(true);
  //     setError(null);
  //     try {
  //       const genderId = formDataSection1.gender === 'male' ? 1 : 2;
  //       const response = await api.getRequest(`master-data/body-types/gender?genderId=${genderId}`);

  //       if (response.status && response.data) {
  //         setBodyTypes(response.data);
  //         // Only reset bodyType if it's not valid for the current gender
  //         // Check if current bodyType exists in the new data
  //         const currentBodyType = formDataSection1.bodyType;
  //         const isCurrentBodyTypeValid = response.data.some(
  //           (bt: BodyType) => bt.bodyType === currentBodyType
  //         );

  //         if (!isCurrentBodyTypeValid && currentBodyType !== '') {
  //           // Reset bodyType only if it's not valid for the current gender
  //           setFormDataSection1((prev) => ({
  //             ...prev,
  //             bodyType: '',
  //           }));
  //         }
  //       } else {
  //         setError('Failed to fetch body types');
  //       }
  //     } catch (err) {
  //       setError('An error occurred while fetching body types');
  //     } finally {
  //       setLoadingBodyTypes(false);
  //     }
  //   };

  //   fetchBodyTypes();
  // }, [formDataSection1.gender]);

  // Group all effects
  // useEffect(() => {
  //   if (popup) {
  //     document.body.style.overflow = 'hidden';
  //   } else {
  //     document.body.style.overflow = 'unset';
  //   }
  // }, [popup]);

  // Add this useEffect after your other useEffect hooks
  // useEffect(() => {
  //   // Try to get user data from localStorage
  //   try {
  //     const storedUserData = localStorage.getItem('fizaaiuser');

  //     if (storedUserData) {
  //       const userData = JSON.parse(storedUserData);

  //       if (userData.user) {
  //         // Update formDataSection1 with the user data
  //         setFormDataSection1((prevData) => ({
  //           ...prevData,
  //           first_name: userData.user.first_name || '',
  //           last_name: userData.user.last_name || '',
  //           gender: userData.user.userPreference?.gender || 'male',
  //           age: userData.user.userPreference?.age || '',
  //           weight: userData.user.userPreference?.weight?.toString() || '',
  //           height: userData.user.userPreference?.height?.toString() || '',
  //           bodyType: userData.user.userPreference?.bodyType || '',
  //           skinColor: userData.user.userPreference?.colorCode || '',
  //           weightUnit: userData.user.userPreference?.weightUnit || '',
  //           heightUnit: userData.user.userPreference?.heightUnit || '',
  //           profilePicture: userData.user.userPreference?.profilePicture
  //             ? [{ short_lived_url: userData.user.userPreference.profilePicture }]
  //             : undefined,
  //         }));

  //         // If you need to set the mobile number as well
  //         if (userData.user.phoneNumber) {
  //           setUserMobileNumber(userData.user.phoneNumber);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error('Error loading user data from localStorage:', error);
  //   }
  // }, [showStudio]);

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setIsLoggedInn(true);
  //     } else {
  //       setItems([]); // Clear versions on logout
  //       setIsLoggedInn(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);

  // ? Step 2: When logged in, fetch versions
  // useEffect(() => {
  //   if (!isLoggedInn) {
  //     return;
  //   }

  //   const fetchVersions = async () => {
  //     let zone = 'Asia/Kolkata'; // default fallback

  //     try {
  //       // 1?? Try to get data from localStorage first
  //       const savedData = localStorage.getItem('ipapidata');

  //       if (savedData) {
  //         const ipData = JSON.parse(savedData);

  //         if (ipData?.timezone) {
  //           zone = ipData.timezone;
  //         }
  //       } else {
  //         // 2?? Not in localStorage — fetch from API
  //         const ipRes = await fetch('https://ipapi.co/json/');

  //         if (ipRes.ok) {
  //           const ipData = await ipRes.json();
  //           // Save full response for future use
  //           localStorage.setItem('ipapidata', JSON.stringify(ipData));
  //           // eslint-disable-next-line no-console
  //           console.log('User timezone:', zone);

  //           if (ipData?.timezone) {
  //             zone = ipData.timezone;
  //           }
  //         }
  //       }
  //     } catch (ipError) {
  //       // eslint-disable-next-line no-console
  //       console.warn('Failed to get timezone, using default:', ipError);
  //     }

  //     // You can now use `zone`

  //     try {
  //       const user = auth.currentUser;

  //       if (!user) {
  //         return;
  //       }

  //       const token = await user.getIdToken();

  //       // Fetch parent versions
  //       const parentRes = await api.getRequest(
  //         'fiza/image/versions?pageNo=0&pageSize=100&sortBy=id&sortDir=DESC',
  //         {
  //           Authorization: `Bearer ${token}`,
  //           Accept: '*/*',
  //           'time-zone': zone,
  //         }
  //       );

  //       const parents: VersionData[] = parentRes?.data?.content || [];

  //       // Fetch child versions
  //       const childrenRequests = parents
  //         .filter((p) => p.children && p.children > 0)
  //         .map((parent) =>
  //           api
  //             .getRequest(
  //               `fiza/image/fetch_by_parent?pageNo=0&pageSize=100&sortBy=id&sortDir=ASC&parentId=${parent.id}`,
  //               {
  //                 Authorization: `Bearer ${token}`,
  //                 Accept: '*/*',
  //                 'time-zone': zone,
  //               }
  //             )
  //             .then((res) => res?.data?.content || [])
  //         );

  //       const allChildren = await Promise.all(childrenRequests);
  //       const children: VersionData[] = allChildren.flat();

  //       // ? Final version list
  //       setItems([...parents, ...children]);
  //     } catch (err) {
  //       // eslint-disable-next-line no-console
  //       console.error('Failed to fetch versions:', err);

  //       // Check if it's a network error vs other error
  //       if (err instanceof TypeError && err.message === 'Failed to fetch') {
  //         // eslint-disable-next-line no-console
  //         console.warn('Network connectivity issue - API server may be unreachable');
  //       }

  //       setItems([]);
  //     }
  //   };

  //   fetchVersions();
  // }, [isLoggedInn, showStudio, generatedImageUrl]);

  const [hashedId, setHashedId] = useState<string | null>(null);

  useEffect(() => {
    // Extract hashedId from URL path dynamically
    const pathSegments = window.location.pathname.split('/');
    // Path example: ['', 'image_share', 'aifiza', 'df560fe7-af59-4cda-af21-c85b026d9e48']
    const id = pathSegments[pathSegments.length - 1];
    setHashedId(id);
  }, []);

  async function fetchVersionDataAndSelect() {
    if (!hashedId) {
      return;
    }
    try {
      const response = await api.getRequest(`link_share/decode?hashedId=${hashedId}`);

      if (response && response.status && response.data) {
        const entry = response.data as VersionData;
        const parsedData = JSON.parse(entry.data);

        // Extract gender from version data
        const gender = parsedData.aboutYou?.gender || 'male';

        // Update gender state for formDataSection1
        setFormDataSection1((prev) => ({
          ...prev,
          gender: gender,
        }));

        // Fetch outfit options as per this gender
        const outfitResponse = await api.getRequest(`master-data/outfits/?gender=${gender}`);

        if (outfitResponse && outfitResponse.status && outfitResponse.data) {
          setOutfitOptions(outfitResponse.data);

          // Find outfit index from parsedData.selectedOutfit (if available)
          if (parsedData.selectedOutfit) {
            const selectedOutfit = outfitResponse.data.find(
              (outfit: any) => outfit.outfit_name === parsedData.selectedOutfit
            );

            if (selectedOutfit) {
              setoutfit_index(selectedOutfit.outfit_index);

              // Fetch stitch options for that outfit
              const stitchResponse = await api.getRequest(
                `fiza/outfit/${selectedOutfit.outfit_index}/stitch_options`
              );

              if (stitchResponse && stitchResponse.status && stitchResponse.data) {
                setStitchOptionGroups(stitchResponse.data);

                // Update stitch options from parsedData
                if (parsedData.stitchOptions) {
                  setFormDataSection234((prev) => ({
                    ...prev,
                    stitchOptions: parsedData.stitchOptions,
                    aboutYou: parsedData.aboutYou,
                    selectedOutfit: parsedData.selectedOutfit,
                    topColor: parsedData.topColor,
                    bottomColor: parsedData.bottomColor,
                    fabricImageTop: parsedData.fabricImageTop,
                    fabricImageBottom: parsedData.fabricImageBottom,
                    colorFabricInstructions: parsedData.colorFabricInstructions,
                    specialInstructions: parsedData.specialInstructions,
                  }));
                }
              }
            }
          }

          // Finally call your existing handleVersionSelect for any additional setup/UI updates
          handleVersionSelect(entry);
        } else {
          setError('Failed to fetch outfit options');
        }
      } else {
        setError('Failed to fetch version data');
      }
    } catch (err) {
      setError('Error fetching version data or dependent data');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  useEffect(() => {
    // const hashedId = '8873096d-36ad-428c-b4e5-4f8b7c1d69c3'; // dynamic or hardcoded

    fetchVersionDataAndSelect();
  }, [hashedId]);

  useEffect(() => {
    if (pendingVersionData && outfitOptions.length > 0) {
      handleVersionSelect(pendingVersionData);
      setPendingVersionData(null);
    }
  }, [pendingVersionData, outfitOptions]);

  useEffect(() => {
    if (!hashedId) {
      return;
    }
    fetchVersionDataAndSelect();
  }, [hashedId]);

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
    const x = 1;
    try {
      if (x === 1) {
        navigate('/');
        // eslint-disable-next-line no-console
        console.log('Generating preview with data:');

        return;
        // eslint-disable-next-line no-console
        console.log('Generating preview with data:');
      }
      // Check if user has 0 tokens
      // if (coinBalance === 0) {
      //   setShowPopup(true);

      //   return;
      // }

      // eslint-disable-next-line no-console
      console.log('Generating preview with data:');

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

  // Find selected outfit details
  const selectedOutfitDetails = outfitOptions.find(
    (outfit) => outfit.outfit_name === formDataSection234.selectedOutfit
  );

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

  // Function to download the generated image
  const handleDownloadImage = async () => {
    if (!generatedImageUrl) {
      alert('No image available to download');

      return;
    }

    // setIsDownloading(true); // Show loader

    const version = currentVersionEntry?.version ?? 1;
    const outfitName = formDataSection234?.selectedOutfit || 'Outfit';
    const fileName = `${outfitName} Version ${version}.jpg`;

    try {
      const apiUrl = `https://backend.stage.darzeeapp.com/file/download-file?fileUrl=${encodeURIComponent(
        generatedImageUrl
      )}`;
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
    }
  };

  const handleSingup = () => {
    navigate('/');
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
        ></div>
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
                    className="h-6 md:h-10 aspect-auto cursor-pointer hidden"
                  />
                  <div className="flex  w-[85%] md:w-[60%] md:pl-8 pl-4 ">
                    {/* Studio Tab */}
                    <div
                      onClick={() => {
                        setSelectedTab('studio');
                      }}
                      className={`flex  cursor-pointer pb-2 ${
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
                      onClick={() => setSelectedTab('lookbook')}
                      className={`fle items-center md:gap-2 gap-1 cursor-pointer pb-2 hidden ${
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
              )}

              <div className="flex  w-[85%] md:w-[60%] ">
                {/* Studio Tab */}
                {/* <div
                  onClick={() => {
                    setSelectedTab('studio');
                  }}
                  className={`flex  cursor-pointer pb-2 ${
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
                </div> */}

                {/* Lookbook Tab */}
                {/* <div
                  onClick={() => setSelectedTab('lookbook')}
                  className={`fle items-center md:gap-2 gap-1 cursor-pointer pb-2 hidden ${
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
                </div> */}
              </div>
            </div>

            {/* Right Section headar */}
            <div className="flex items-center justify-end gap-2 md:gap-4 w-1/2">
              <div className="flex items-center gap-2 md:gap-3 py-1.5 rounded-full cursor-pointer transition-all duration-300">
                <button
                  onClick={() => handleSingup()}
                  className="flex items-center bg-[#79539F]  text-white px-3 py-1 rounded-md text-[.8rem] md:text-[1rem] font-medium transition"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* {showPopup && <TokenPopup onClose={() => setShowPopup(false)} />} */}

        {currentStep === 1 && <div></div>}

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
                            <p className="text-sm mt-2">Try searching with different keywords</p>
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
                              <span className="ml-2 text-sm">{formDataSection234.topColor}</span>
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
                                  border: color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                                }}
                                onClick={() => updateFormDataSection234('topColor', color.color)}
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
                              <span className="ml-2 text-sm">{formDataSection234.bottomColor}</span>
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
                                  border: color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                                }}
                                onClick={() => updateFormDataSection234('bottomColor', color.color)}
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
                                border: color.color === '#ffffff' ? '1px solid #e2e8f0' : 'none',
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
                      <p className="text-xs text-gray-400 mt-1">This section is not mandatory</p>
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
                                      if (formDataSection234.stitchOptions[option.label] === null) {
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
                                      if (formDataSection234.stitchOptions[option.label] === null) {
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
                          showStudio ? 'md:w-[calc(58%-300px)] md:ml-[300px]' : 'md:w-1/2 md:ml-0'
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
                          onClick={() => handleGeneratePreview(currentVersionEntry || undefined)}
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
                  className={`${showMobilePreview ? ' block' : ' hidden'} size-8 cursor-pointer`}
                />
                <h2 className="text-xl font-medium ">Preview</h2>
              </div>
              <div className="flex items-center md:gap-7 gap-4">
                <img
                  src={share}
                  alt="Share outfit"
                  className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={() => setShowShareModal(true)}
                />
                <img
                  src={download}
                  alt="Download outfit"
                  className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                  onClick={handleDownloadImage}
                />
                <img
                  onClick={() => handleShare('whatsapp')}
                  src={whatapp}
                  alt=""
                  className="md:h-8 h-6 aspect-auto cursor-pointer hover:opacity-70 transition-opacity"
                />
              </div>
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
                      <img src={Ai_refresh} alt="Loading..." className="h-[15rem] w-[15rem] mb-4" />
                      <p className="text-lg font-medium text-gray-700">Adding Final Details...</p>
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
                          <p className="text-lg font-medium text-gray-700">Loading version...</p>
                          <p className="text-sm text-gray-500 mt-2">Please wait</p>
                        </div>
                      ) : (
                        <div className="w-full h-full object-contain flex flex-col items-center ">
                          <img
                            src={generatedImageUrl}
                            alt="Generated outfit preview"
                            className="w-full max-w-full h-auto max-h-[calc(100vh-250px)] object-contain rounded-lg"
                          />
                          <div className="text-sm text-gray-600 mb-4">
                            AI-generated preview based on your selections
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
                                  let displayValue = formDataSection234.stitchOptions[option.label];
                                  const isSelected = displayValue !== null;
                                  const isAnimatingTick =
                                    animationStep === 'ticking' && tickedOptions.has(option.label);

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
                                          backgroundColor: formDataSection234.topColor || '#cccccc',
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
                              <h3 className="font-medium mb-2">Color and Fabric Instructions:</h3>
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

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500]">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Share Your Design</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes size={20} />
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
