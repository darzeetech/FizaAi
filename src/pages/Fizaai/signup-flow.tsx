'use client';

import { useState, useEffect } from 'react';
import { MdClose, MdPhone, MdArrowForward } from 'react-icons/md';
import aiimage from '../../assets/images/ai.png';
import mobilenoti from '../../assets/images/image 360.png';
import PhoneInput from 'react-phone-number-input';
import parsePhoneNumberFromString from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

import { phone } from 'phone';
import { toasts, Loader } from '../../ui-component';
import { api } from '../../utils/apiRequest';
import { getValueFromLocalStorage, setValueInLocalStorage } from '../../utils/common';

type Step = 'signup' | 'verify';

export default function SignupFlow({
  popup,
  setPopup,
  setCurrentStep1,
  onMobileNumberVerified,
}: {
  popup: boolean;
  setPopup: (value: boolean) => void;
  setCurrentStep1?: (value: number) => void;
  onMobileNumberVerified?: (mobileNumber: string) => void;
}) {
  const [currentStep, setCurrentStep] = useState<Step>('signup');
  const [formData, setFormData] = useState({
    phoneNumber: '+91 ',
    otp: '',
    country_code: '+91',
    phone_number: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState<number>(45);
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>('IN');

  // Existing stored user (if any)
  const fizaaiUserData = localStorage.getItem('fizaaiuser');
  const parsedData = fizaaiUserData ? JSON.parse(fizaaiUserData) : null;
  const phoneNumber1 = parsedData?.user?.phoneNumber || '';

  // 🔹 1) Detect country & prefill dial code
  useEffect(() => {
    async function getUserCountry() {
      const savedData = localStorage.getItem('ipapidata');

      if (savedData) {
        const data = JSON.parse(savedData);

        setDefaultCountry((data.country_code as CountryCode) || 'IN');
        setFormData((prev) => ({
          ...prev,
          phoneNumber: data.country_calling_code || '+91',
          country_code: data.country_calling_code || '+91',
        }));

        return;
      }

      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        localStorage.setItem('ipapidata', JSON.stringify(data));

        setDefaultCountry((data.country_code as CountryCode) || 'IN');
        setFormData((prev) => ({
          ...prev,
          phoneNumber: data.country_calling_code || '+91',
          country_code: data.country_calling_code || '+91',
        }));
      } catch {
        setDefaultCountry('IN');
        setFormData((prev) => ({
          ...prev,
          phoneNumber: '+91',
          country_code: '+91',
        }));
      }
    }

    getUserCountry();
  }, []);

  // 🔹 2) Auto-flow if already authenticated (token present)
  useEffect(() => {
    const token = getValueFromLocalStorage('userToken') || getValueFromLocalStorage('token');

    if (token) {
      const fullPhoneNumber = phoneNumber1;

      if (fullPhoneNumber && onMobileNumberVerified) {
        onMobileNumberVerified(fullPhoneNumber);
      }

      if (setCurrentStep1) {
        const hasPreferences = parsedData?.user?.userPreference;
        setCurrentStep1(hasPreferences ? 2 : 1);
      }

      setPopup(false);
    }

    setIsLoading(false);
  }, [onMobileNumberVerified, setCurrentStep1, setPopup, phoneNumber1]);

  // 🔹 3) OTP timer
  useEffect(() => {
    if (currentStep === 'verify' && otpTimer > 0) {
      const timerID = setInterval(() => setOtpTimer((timer) => timer - 1), 1000);

      return () => clearInterval(timerID);
    }
  }, [currentStep, otpTimer]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isPhoneNumberValid = () => {
    if (!formData.phone_number) {
      return false;
    }

    const fullPhoneNumber = `${formData.country_code}${formData.phone_number}`.replace(/\s+/g, '');
    const result = phone(fullPhoneNumber);

    return result.isValid;
  };

  // 🔹 4) Send OTP via backend API (no Firebase)
  const handleSendOTP = async () => {
    try {
      setIsLoading(true);

      const fullMobileNumber = `${formData.country_code}${formData.phone_number}`.replace(
        /\s+/g,
        ''
      );

      const res = await api.postRequest('api/v1/auth/user/generate_otp', {
        mobile_number: fullMobileNumber,
      });

      if (res.status) {
        toasts('success', 'OTP sent successfully!', 'send-otp');
        setCurrentStep('verify');
        setOtpTimer(45);
      } else {
        toasts('error', res.message || 'Failed to send OTP', 'send-otp');
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error sending OTP:', error);
      toasts('error', error?.message || 'Failed to send OTP. Please try again.', 'send-otp');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 5) Verify OTP via backend API (no Firebase)
  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);

      const fullMobileNumber = `${formData.country_code}${formData.phone_number}`.replace(
        /\s+/g,
        ''
      );

      if (formData.otp.length !== 6) {
        toasts('error', 'Please enter a valid 6-digit OTP', 'verify-otp');

        return;
      }

      // 1️⃣ Verify OTP with your API
      const verifyResponse = await api.postRequest('api/v1/auth/user/verify_otp', {
        mobile_number: fullMobileNumber,
        otp: formData.otp,
      });

      if (!verifyResponse.status || !verifyResponse.data?.auth_token) {
        toasts('error', verifyResponse.message || 'Invalid OTP', 'verify-otp');

        return;
      }

      const { auth_token, refresh_token } = verifyResponse.data;

      // 2️⃣ Store tokens in localStorage (used by apiRequest.ts)
      setValueInLocalStorage('userToken', auth_token);
      setValueInLocalStorage('token', auth_token);

      if (refresh_token) {
        setValueInLocalStorage('refreshToken', refresh_token);
      }

      window.localStorage.setItem('isAuthenticated', 'true');

      // 3️⃣ Inform parent about verified number
      if (onMobileNumberVerified) {
        onMobileNumberVerified(fullMobileNumber);
      }

      // 4️⃣ Check user status in your backend (existing logic)
      const loginResponse = await api.postRequest('auth/user/login', {
        mobileNumber: fullMobileNumber,
      });

      if (loginResponse.data?.user) {
        localStorage.setItem('fizaaiuser', JSON.stringify(loginResponse.data));
      }

      toasts('success', 'Phone number verified successfully!', 'verify-otp');

      // 5️⃣ Close popup & control main Fiza AI flow
      setTimeout(() => {
        setPopup(false);

        if (setCurrentStep1) {
          if (!loginResponse.data?.user) {
            // new user
            setCurrentStep1(1);
          } else {
            // existing user with preferences → step 2
            const hasPreferences = loginResponse.data.user.userPreference;
            setCurrentStep1(hasPreferences ? 2 : 1);
          }
        }
      }, 100);
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error verifying OTP:', error);
      toasts('error', error?.message || 'Failed to verify OTP. Please try again.', 'verify-otp');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 6) Resend OTP via backend
  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      setFormData((prev) => ({ ...prev, otp: '' }));

      const fullMobileNumber = `${formData.country_code}${formData.phone_number}`.replace(
        /\s+/g,
        ''
      );

      const res = await api.postRequest('api/v1/auth/user/generate_otp', {
        mobile_number: fullMobileNumber,
      });

      if (res.status) {
        setOtpTimer(45);
        toasts('success', 'OTP resent successfully!', 'resend-otp');
      } else {
        toasts('error', res.message || 'Failed to resend OTP', 'resend-otp');
      }
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Error resending OTP:', error);
      toasts('error', error?.message || 'Failed to resend OTP. Please try again.', 'resend-otp');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPopup(!popup);
  };

  const handleEditPhoneNumber = () => {
    setCurrentStep('signup');
  };

  const handlePhoneChange = (value: string | undefined) => {
    if (value) {
      const phoneNumberObj = parsePhoneNumberFromString(value);

      if (phoneNumberObj) {
        const countryCode = `+${phoneNumberObj.countryCallingCode}`;
        const phoneNumber = phoneNumberObj.nationalNumber;

        setFormData((prev) => ({
          ...prev,
          country_code: countryCode,
          phone_number: phoneNumber?.toString() || '',
          phoneNumber: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        country_code: '',
        phone_number: '',
        phoneNumber: '',
      }));
    }
  };

  if (currentStep === 'signup') {
    return (
      <div className="h-fit bg-white flex items-center justify-center p-4 rounded-md">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-4 relative">
          {/* Header */}
          <div className="mb-8">
            <h1 className="md:text-[1.5rem] text-[1rem]  font-semibold text-gray-900 flex items-center gap-2">
              Sign In / Create Account Fiza AI
              <img src={aiimage} alt="" className="md:h-6 h-4 aspect-auto" />
            </h1>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* Phone Number */}
            <div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <MdPhone className="text-[1rem]" />
                <span className="block text-[.90rem] font-[600] text-[#525252] ">
                  Enter mobile number
                </span>
              </div>
              <div className="flex items-center ">
                <PhoneInput
                  defaultCountry={defaultCountry}
                  value={formData.phoneNumber}
                  onChange={handlePhoneChange}
                  international
                  countryCallingCodeEditable={false}
                  className="w-full h-12 rounded-md border-1 border-gray-300"
                  inputStyle={{
                    width: '100%',
                    height: '100%',
                    fontSize: '1.5rem',
                    border: '1px solid black',
                    Background: '#3b36360a',
                  }}
                  buttonStyle={{ background: '#3b36360a', border: '1px solid black' }}
                  dropdownStyle={{ width: '350px' }}
                />
              </div>
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOTP}
              disabled={!isPhoneNumberValid() || isLoading}
              className={`w-full ${
                !isPhoneNumberValid() || isLoading
                  ? 'bg-gray-400'
                  : 'bg-[#4F2945] hover:bg-purple-900'
              } text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
              {!isLoading && <MdArrowForward size={20} />}
            </button>

            {/* Terms and Privacy */}
            <p className="text-sm font-[500] text-gray-600 items-center ">
              By continuing, you agree to our{' '}
              <a
                href="https://www.fizaai.com/terms-and-conditions"
                className="text-gray-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>{' '}
              and{' '}
              <a
                href="https://www.fizaai.com/privacy-policy"
                className="text-gray-900 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
        {isLoading && <Loader showLoader={isLoading} />}
      </div>
    );
  }

  // ===== VERIFY STEP =====
  return (
    <div className="h-fit bg-white flex items-center justify-center p-4 rounded-md">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolut hidden top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <MdClose size={24} />
        </button>

        {/* Header */}
        <div className="md:mb-8 mb-5">
          <h1 className="md:text-[1.5rem] text-[1rem] font-semibold text-gray-900 mb-6">
            Verify Phone Number
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <img src={mobilenoti} alt="" className="h-8 aspect-auto " />
            <span className="text-lg font-medium text-gray-900">Enter OTP</span>
          </div>

          <div className="text-sm text-gray-600">
            <p>Check your SMS Messages</p>
            <p>
              We have sent a 6 digit verification code on {formData.country_code}{' '}
              {formData.phone_number}
            </p>
          </div>
        </div>

        {/* OTP Form */}
        <div className="md:space-y-6 space-y-4">
          {/* OTP Input */}
          <div>
            <input
              type="text"
              placeholder="Enter Verification Code"
              value={formData.otp}
              onChange={(e) => handleInputChange('otp', e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>

          {/* Help Links */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Did not receive the code?</p>
            <div className="space-y-1 flex justify-between">
              <button
                onClick={handleResendCode}
                disabled={otpTimer > 0 || isLoading}
                className={`block md:text-md text-sm ${
                  otpTimer > 0 || isLoading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {otpTimer > 0 ? `Resend Code (${otpTimer}s)` : 'Resend Code'}
              </button>
              <button
                onClick={handleEditPhoneNumber}
                disabled={isLoading}
                className={`block md:text-md text-sm ${
                  isLoading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                Edit Phone Number
              </button>
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            disabled={formData.otp.length !== 6 || isLoading}
            className={`w-full ${
              formData.otp.length !== 6 || isLoading
                ? 'bg-gray-400'
                : 'bg-[#4F2945] hover:bg-purple-900'
            } text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors`}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
            {!isLoading && <MdArrowForward size={20} />}
          </button>
        </div>
      </div>
      {isLoading && <Loader showLoader={isLoading} />}
    </div>
  );
}
