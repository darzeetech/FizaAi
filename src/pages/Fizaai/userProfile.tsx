'use client';

import React, { useState } from 'react';
import { FaArrowLeft, FaYoutube, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../../firbase';
import discord from '../../assets/icons/Discord.gif';
import fizzai from '../../assets/icons/share_aistylist.gif';
import vision from '../../assets/icons/Vision_Fiza_AI.gif';
import PaymentMethods from '../../assets/icons/Payment_Methods.png';
import parcel from '../../assets/icons/searching-parcel.png';
import address from '../../assets/icons/address.png';
import femalelogo from '../../assets/icons/ai-stylist-female.png';
import malelogo from '../../assets/icons/ai-stylist-male.png';

interface UserProfileProps {
  showProfile: boolean;
  setShowProfile: (val: boolean) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setShowStudio: (val: boolean) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  showProfile,
  setShowProfile,
  currentStep,
  setCurrentStep,
  setShowStudio,
}) => {
  const storedData = localStorage.getItem('fizaaiuser');
  let fullName = 'Fiza User 1';

  let profileUrl = '';
  let gender = '';

  if (storedData) {
    try {
      const userData = JSON.parse(storedData);
      profileUrl = userData?.user?.userPreference?.profilePicture || ''; // Change if your user object has a different field
      gender = (userData?.user?.userPreference?.gender || '').toLowerCase(); // Adjust path as needed
      const firstName = userData?.user?.first_name || '';
      const lastName = userData?.user?.last_name || '';
      fullName = `${firstName} ${lastName}`.trim() || fullName;
    } catch {
      // eslint-disable-next-line no-console
      console.error('Invalid user data in localStorage');
    }
  }

  const getProfileImg = () => {
    if (profileUrl && profileUrl.trim() !== '') {
      return profileUrl;
    }

    if (gender === 'female') {
      return femalelogo;
    }

    if (gender === 'male') {
      return malelogo;
    }

    return malelogo; // fallback
  };

  const username = fullName;
  // const userInitial = username.charAt(0).toUpperCase();
  const [selectedMenu, setSelectedMenu] = useState<'orders' | 'address' | 'payment'>('orders');
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  if (!showProfile) {
    return null;
  }

  // eslint-disable-next-line no-console
  console.log(currentStep);

  return (
    <div className="flex flex-col h-full justify-between w-full">
      <div className="bg-[#F9F6F1] w-full ml-1">
        {/* Top Header Row */}
        <div className="flex items-center gap-2 ml-3 px-3 py-4 cursor-pointer">
          <button onClick={() => setShowProfile(false)} className="text-black">
            <FaArrowLeft size={20} />
          </button>
          <div
            className="flex items-center "
            onClick={() => {
              setCurrentStep(1);

              if (window.innerWidth < 768) {
                setShowStudio(false);
              }
            }}
          >
            <img
              src={getProfileImg()}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-[#E0D6CF]"
            />

            <span className="text-base ml-3 font-medium text-black">{username}</span>
          </div>
        </div>
        {/* Menu Options Row-by-Row */}
        <div className="flex  flex-col w-full text-base text-black font-medium">
          {/* Orders */}
          <div
            onClick={() => setSelectedMenu('orders')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectedMenu === 'orders' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={parcel} alt="Orders" className="w-5 h-5 ml-6" />
            <span className="ml-3">Orders</span>
          </div>

          {/* Address */}
          <div
            onClick={() => setSelectedMenu('address')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectedMenu === 'address' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={address} alt="Address" className="w-5 h-5 ml-6" />
            <span className="ml-3">Address</span>
          </div>

          {/* Payment */}
          <div
            onClick={() => setSelectedMenu('payment')}
            className={`w-full py-3 px-6 cursor-pointer flex items-center gap-3 ${
              selectedMenu === 'payment' ? 'bg-[#EFE1D5]' : 'hover:bg-[#F5EDE6]'
            }`}
          >
            <img src={PaymentMethods} alt="Payment Methods" className="w-5 h-5 ml-6" />
            <span className="ml-3">Payment Methods</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex flex-col gap-4 text-base text-black mt-auto pb-6 pt-6">
        <div
          onClick={() => {
            const message = `Just designed my dream outfit with Fiza AI 👗✨ You can too — no sketching, no stress. Just describe and watch it come to life.

👉 Start now: https://fizaai.com/`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="flex items-center gap-3 cursor-pointer px-4 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <img src={fizzai} alt="Share Fiza AI" className="w-5 h-5 shrink-0" />
          <span className="truncate">Share Fiza AI and kill fast fashion</span>
        </div>

        <div
          onClick={() => setShowYouTubeModal(true)}
          className="flex items-center gap-3 cursor-pointer px-4 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <img src={vision} alt="Mission" className="w-5 h-5 shrink-0" />
          <span className="truncate">Our Mission - Ethical Fashion</span>
          <FaYoutube size={18} className="text-[#D94147] shrink-0" />
        </div>

        <a
          href="https://discord.com/invite/nBzEYku69N"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 cursor-pointer px-4 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <img src={discord} alt="Discord" className="w-5 h-5 shrink-0" />
          <span className="truncate">Join Discord</span>
        </a>

        <div
          onClick={async () => {
            try {
              // Sign out from Firebase Auth
              await signOut(auth);

              // Clear all localStorage data
              localStorage.clear();

              // Reload the page to reset the app state
              window.location.reload();
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error signing out:', error);

              // Even if Firebase signOut fails, clear localStorage and reload
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="flex items-center gap-3 text-[#D94147] cursor-pointer px-4 whitespace-nowrap overflow-hidden text-ellipsis"
        >
          <FaSignOutAlt size={16} className="shrink-0" />
          <span className="truncate">Sign Out</span>
        </div>
      </div>

      {/* YouTube Modal */}
      {showYouTubeModal && (
        <div className="fixed w-screen h-[100vh] inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setShowYouTubeModal(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-black z-10 bg-white rounded-full p-2 shadow-lg"
            >
              <FaTimes size={16} />
            </button>
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube.com/embed/hjuaei8nNI4"
                title="Our Mission - Ethical Fashion"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
