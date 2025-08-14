'use client';

import { useState, useEffect, useRef } from 'react';
import { MdClose, MdPhone, MdArrowForward } from 'react-icons/md';
import {
  ConfirmationResult,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import aiimage from '../../assets/images/ai.png';
import mobilenoti from '../../assets/images/image 360.png';
import PhoneInput from 'react-phone-number-input';
import parsePhoneNumberFromString from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

import { phone } from 'phone';
import { auth } from '../../firbase';
import { toasts } from '../../ui-component';
import { Loader } from '../../ui-component';
import { api } from '../../utils/apiRequest';
import _isNil from 'lodash/isNil';

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
  const [user, setUser] = useState<ConfirmationResult>();
  const [isLoading, setIsLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState<number>(45);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const [defaultCountry, setDefaultCountry] = useState<CountryCode>('IN');

  const fizaaiUserData = localStorage.getItem('fizaaiuser');
  // eslint-disable-next-line no-console
  //console.log(fizaaiUserData);
  const parsedData = fizaaiUserData ? JSON.parse(fizaaiUserData) : null;

  // eslint-disable-next-line no-console
  //console.log(parsedData);

  const phoneNumber1 = parsedData?.user?.phoneNumber || '';

  // eslint-disable-next-line no-console
  //console.log(phoneNumber1);

  useEffect(() => {
    async function getUserCountry() {
      // Try to get user info from localStorage first
      const savedData = localStorage.getItem('ipapidata');

      if (savedData) {
        const data = JSON.parse(savedData);
        setDefaultCountry((data.country_code as CountryCode) || 'IN');
        setFormData((prev) => ({
          ...prev,
          phoneNumber: data.country_calling_code || '+91',
          country_code: data.country_calling_code || '+91',
        }));

        return; // Exit if data is present
      }

      // If not present, fetch from the API
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        // Store API result in localStorage for future use
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

  // Auto-authenticate on page load/refresh if userToken exists
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get the token from the authenticated user
          const token = await firebaseUser.getIdToken();

          if (!_isNil(token) && token !== '') {
            // Store authentication data
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userToken', token);

            // Get the user's phone number with country code
            const fullPhoneNumber = firebaseUser.phoneNumber || phoneNumber1;

            // If we have a phone number and the callback exists, call it
            // Pass the full phone number with country code to the callback
            if (fullPhoneNumber && onMobileNumberVerified) {
              onMobileNumberVerified(fullPhoneNumber);
            }

            if (fullPhoneNumber) {
              // Check if user exists in the backend - send full phone number with country code
              try {
                const apiResponse = await api.postRequest('auth/user/login', {
                  mobileNumber: fullPhoneNumber, // Send full number with country code
                });

                // Store user data if it exists
                if (apiResponse.data?.user) {
                  localStorage.setItem('fizaaiuser', JSON.stringify(apiResponse.data));

                  // Close the popup and set the appropriate step
                  if (setCurrentStep1) {
                    // If user has preferences, go to step 2, otherwise step 1
                    const hasPreferences = apiResponse.data.user.userPreference;
                    setCurrentStep1(hasPreferences ? 2 : 1);
                  }

                  // Close the popup
                  setPopup(false);
                }
              } catch (apiError) {
                // eslint-disable-next-line no-console
                console.error('API error:', apiError);
              }
            }
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error getting token:', error);
        }
      }

      // Set loading to false regardless of authentication status
      setIsLoading(false);
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, [onMobileNumberVerified, setCurrentStep1, setPopup, phoneNumber1]);

  useEffect(() => {
    // Clean up recaptcha when component unmounts
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
          recaptchaVerifierRef.current = null;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error clearing recaptcha:', error);
        }
      }

      // Also clear the container
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  useEffect(() => {
    if (currentStep === 'verify' && otpTimer > 0) {
      const timerID = setInterval(() => setOtpTimer((timer) => timer - 1), 1000);

      return () => clearInterval(timerID);
    }
  }, [currentStep, otpTimer]);

  // This function directly matches how it's done in the signin flow
  // Replace the setupRecaptcha function with this improved version
  const setupRecaptcha = () => {
    try {
      // Clear any existing recaptcha
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }

      // Clear the container element
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.innerHTML = '';
      }

      // Create a new div element for the recaptcha
      const recaptchaDiv = document.createElement('div');
      recaptchaDiv.id = 'recaptcha-container-inner';

      // Append the new div to the container
      if (recaptchaContainerRef.current) {
        recaptchaContainerRef.current.appendChild(recaptchaDiv);
      }

      // Create a new recaptcha verifier using the new div
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container-inner', {
        size: 'invisible',
        callback: () => {
          // eslint-disable-next-line no-console
          console.log('Recaptcha verified');
        },
      });

      return recaptchaVerifierRef.current;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error setting up recaptcha:', error);

      if (error instanceof Error) {
        toasts('error', error.message, 'recaptcha-setup');
      }

      return null;
    }
  };

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

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);

      // Format the phone number correctly - ensure no spaces
      const phoneNumber = `${formData.country_code}${formData.phone_number}`.replace(/\s+/g, '');

      // Set up recaptcha - this matches the signin flow approach
      const recaptchaVerifier = setupRecaptcha();

      if (!recaptchaVerifier) {
        throw new Error('Failed to set up reCAPTCHA. Please refresh and try again.');
      }

      // Send OTP via Firebase - using the same approach as signin flow
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setUser(confirmation);

      // Move to verification step
      setCurrentStep('verify');
      setOtpTimer(45);

      toasts('success', 'OTP sent successfully!', 'send-otp');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error sending OTP:', error);

      if (error instanceof Error) {
        toasts('error', error.message, 'request-otp');
      } else {
        toasts('error', 'Failed to send OTP. Please try again.', 'request-otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);

      if (!user) {
        throw new Error('Verification session expired. Please request a new OTP.');
      }

      // Confirm the OTP
      const response = await user.confirm(formData.otp);

      if (response.user) {
        // Get the Firebase token
        const token = await response.user.getIdToken();

        // Store authentication token in localStorage
        if (token) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userToken', token);
        }

        // Handle successful verification
        toasts('success', 'Phone number verified successfully!', 'verify-otp');

        // Pass the full mobile number with country code back to the parent component
        const fullMobileNumber = `${formData.country_code}${formData.phone_number}`;

        if (onMobileNumberVerified) {
          onMobileNumberVerified(fullMobileNumber);
        }

        // Make API call to check user status - send full number with country code
        const apiResponse = await api.postRequest('auth/user/login', {
          mobileNumber: fullMobileNumber,
        });

        // Store user data in localStorage if it exists
        if (apiResponse.data?.user) {
          localStorage.setItem('fizaaiuser', JSON.stringify(apiResponse.data));
        }

        // Close the popup after successful verification
        setTimeout(() => {
          setPopup(false);

          if (setCurrentStep1) {
            // If user is null, set to step 1 (new user flow)
            if (!apiResponse.data?.user) {
              setCurrentStep1(1);
            } else {
              // If user exists with preferences, set to step 2
              setCurrentStep1(2);
            }
          }
        }, 100);
      }
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error verifying OTP:', error);

      if (error instanceof Error) {
        toasts('error', error.message, 'verify-otp');
      } else {
        toasts('error', 'Failed to verify OTP. Please try again.', 'verify-otp');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);

      // Reset OTP field
      setFormData((prev) => ({ ...prev, otp: '' }));

      // Format the phone number correctly - ensure no spaces
      const phoneNumber = `${formData.country_code}${formData.phone_number}`.replace(/\s+/g, '');

      // Set up recaptcha again
      const recaptchaVerifier = setupRecaptcha();

      if (!recaptchaVerifier) {
        throw new Error('Failed to set up reCAPTCHA. Please refresh and try again.');
      }

      // Resend OTP
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setUser(confirmation);

      // Reset timer
      setOtpTimer(45);

      toasts('success', 'OTP resent successfully!', 'resend-otp');
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Error resending OTP:', error);

      if (error instanceof Error) {
        toasts('error', error.message, 'resend-otp');
      } else {
        toasts('error', 'Failed to resend OTP. Please try again.', 'resend-otp');
      }
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
      // Parse the phone number
      const phoneNumberObj = parsePhoneNumberFromString(value);

      // Check if parsing was successful
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
          {/* Close Button */}
          {/* <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <MdClose size={24} />
          </button> */}

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
                  value={`${formData.phoneNumber}`}
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

            {/* Sign In Link */}
            {/* <div className="text-center pt-4 font-inter font-[500]">
              <p className="text-sm text-gray-600">Already have an account?</p>
              <a href="#" className="text-sm text-gray-900 underline">
                Sign in here
              </a>
            </div> */}
          </div>

          {/* Recaptcha Container - must match the ID used in the signin flow */}
          <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
        </div>
        {isLoading && <Loader showLoader={isLoading} />}
      </div>
    );
  }

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

        {/* Recaptcha Container - needed for resend OTP */}
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
      </div>
      {isLoading && <Loader showLoader={isLoading} />}
    </div>
  );
}
