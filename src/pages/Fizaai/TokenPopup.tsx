'use client';

import React, { useEffect, useState } from 'react';
import { api } from '../../utils/apiRequest';
import { loadRazorpayScript } from './loadRazorpay';

interface TokenPopupProps {
  onClose: () => void;
}

interface CoinPlan {
  id: number;
  currency: string;
  price: number;
  subject: string;
  coins: number;
  sortIndex: number;
  discount: string | null;
}

const TokenPopup: React.FC<TokenPopupProps> = ({ onClose }) => {
  const [plans, setPlans] = useState<CoinPlan[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<string>('USD');
  const [isProcessing, setIsProcessing] = useState(false);

  // useEffect(() => {
  //   const fetchRegionAndPlans = async () => {
  //     try {
  //       let regionCurrency = 'USD'; // default fallback

  //       try {
  //         const ipRes = await fetch('https://ipapi.co/json/');

  //         if (ipRes.ok) {
  //           const ipData = await ipRes.json();
  //           // Only override if currency exists and isn't empty

  //           if (ipData?.currency) {
  //             regionCurrency = ipData.currency;
  //           }
  //         }
  //       } catch (err) {
  //         // eslint-disable-next-line no-console
  //         console.warn('IP API failed, defaulting to USD', err);
  //       }

  //       setRegion(regionCurrency);

  //       const response = await api.getRequest('coin_price_unit', {
  //         Region: regionCurrency,
  //       });

  //       const sorted = response.data.sort((a: CoinPlan, b: CoinPlan) => a.sortIndex - b.sortIndex);
  //       setPlans(sorted);
  //     } catch (err) {
  //       // eslint-disable-next-line no-console
  //       console.error('Failed to fetch region or plans:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchRegionAndPlans();
  // }, []);

  useEffect(() => {
    const fetchRegionAndPlans = async () => {
      try {
        let regionCurrency = 'USD'; // default fallback

        // 1️⃣ Try to read from localStorage first
        const savedRegionData = localStorage.getItem('ipapidata');

        if (savedRegionData) {
          const ipData = JSON.parse(savedRegionData);

          if (ipData?.currency) {
            regionCurrency = ipData.currency;
          }
        } else {
          // 2️⃣ If not in localStorage, call the API
          try {
            const ipRes = await fetch('https://ipapi.co/json/');

            if (ipRes.ok) {
              const ipData = await ipRes.json();
              // Save the important part in localStorage for next time
              localStorage.setItem('ipapidata', JSON.stringify(ipData));

              if (ipData?.currency) {
                regionCurrency = ipData.currency;
              }
            }
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn('IP API failed, defaulting to USD', err);
          }
        }

        // 3️⃣ Set region based on localStorage or API result
        setRegion(regionCurrency);

        // 4️⃣ Fetch your coin plans
        const response = await api.getRequest('coin_price_unit', {
          Region: regionCurrency,
        });

        const sorted = response.data.sort((a: CoinPlan, b: CoinPlan) => a.sortIndex - b.sortIndex);
        setPlans(sorted);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch region or plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegionAndPlans();
  }, []);

  const initiatePayment = async () => {
    if (selectedId === null) {
      return;
    }

    const selectedPlan = plans.find((plan) => plan.id === selectedId);

    if (!selectedPlan) {
      return;
    }

    const razorpayLoaded = await loadRazorpayScript();

    if (!razorpayLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');

      return;
    }

    try {
      setIsProcessing(true);
      const res = await api.postRequest('order/coins', { coinId: selectedPlan.id }, false, {
        Region: region,
        Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        Accept: '*/*',
      });

      const order = res.data;
      let contact = '';
      const demoEmail = 'fizzaaidemo@gmail.com';
      const storedData = localStorage.getItem('fizaaiuser');

      if (storedData) {
        try {
          const userData = JSON.parse(storedData);
          contact = userData?.user?.phoneNumber || '';
          // eslint-disable-next-line no-console
          console.log(contact);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error('Failed to parse user from localStorage', e);
        }
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Fiza AI by Darzee',
        description: `${selectedPlan.coins} Tokens Purchase`,
        order_id: order.orderId,

        handler: async function (response: any) {
          try {
            const txnId = response.razorpay_payment_id;
            const verifyRes = await api.putRequest(`order/success?txnId=${txnId}`, {}, false, {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
              Accept: '*/*',
            });
            // eslint-disable-next-line no-console
            console.log('Payment verification response:', verifyRes.data);
            alert('Payment verified and tokens added!');
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Verification failed:', err);
            alert('Payment successful, but verification failed.');
          }

          onClose();
          window.location.reload();
        },

        prefill: {
          contact: contact,
          email: demoEmail,
        },

        theme: {
          color: '#4f2945',
        },
        image:
          'https://s3.us-east-1.amazonaws.com/darzee.backend.stage/1754302132247-XeiCxUFpfiza_ai_insta.png',
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setIsProcessing(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Payment initiation failed', error);
      alert('Payment initiation failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] bg-black bg-opacity-50 flex justify-center items-center px-2 sm:px-4">
      <div className="bg-white rounded-xl w-full max-w-[95%] sm:max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-lg text-gray-500 hover:text-black"
        >
          &times;
        </button>

        <h2 className="text-base sm:text-lg font-semibold mb-5 sm:mb-6 text-center">
          Select Fiza AI tokens package
        </h2>

        {loading ? (
          <p className="text-center text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-5 sm:mb-6">
            {plans.map((plan) => {
              const isSelected = selectedId === plan.id;

              return (
                <div key={plan.id} className="flex flex-col items-center">
                  <div
                    onClick={() => setSelectedId(plan.id)}
                    className={`w-full border rounded-lg p-2 sm:p-3 cursor-pointer transition-all text-center
                      ${isSelected ? 'border-[#4f2945] bg-[#f9f0fc]' : 'border-gray-300'}
                    `}
                  >
                    <p className="font-semibold text-xs sm:text-sm">{plan.coins} Tokens</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {region} {plan.price}
                    </p>
                  </div>

                  {(plan.subject || plan.discount) && (
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2 text-[9px] sm:text-[10px]">
                      {plan.subject && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full font-medium
                            ${
                              plan.subject === 'Best Seller'
                                ? 'bg-green-100 text-green-800'
                                : plan.subject === 'Ultimate Fashionists'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }
                          `}
                        >
                          {plan.subject}
                        </span>
                      )}
                      {plan.discount && <span className="text-green-600">{plan.discount}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={initiatePayment}
          disabled={selectedId === null || isProcessing}
          className={`w-full py-2 rounded-lg text-white font-semibold ${
            selectedId !== null && !isProcessing ? 'bg-[#4f2945]' : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          {isProcessing ? (
            <div className="flex justify-center items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Processing...</span>
            </div>
          ) : (
            'Buy tokens'
          )}
        </button>

        <p className="text-[9px] sm:text-[10px] text-gray-500 text-center mt-3 sm:mt-4">
          *inclusive of all taxes and payment gateway fee
          <br />
          *tokens have no expiry
        </p>
      </div>
    </div>
  );
};

export default TokenPopup;
