import logo from '../assets/images/logo darzee 4.png';
import bg2 from '../assets/images/Vector.png';
import transtion from '../assets/images/money.png';
import upi from '../assets/images/Frame 1000010260.png';
import { Text, toasts } from '../ui-component';
import { useState, useEffect } from 'react';
import _isNil from 'lodash/isNil';
import moment from 'moment';
import { paymentModeOptions } from './Order/OrderList/component/InvoiceSummary/constant';
import type { OrderPriceBreakupType } from '../pages/Order/CreateOrder/type';
import { convertNumberOrStringToPriceFormat } from '../utils/common';
import { moneyFormatSigns } from '../utils/contant';
import { RiWhatsappFill } from 'react-icons/ri';
import print from '../assets/images/print.png';
import { BiSolidDownload } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';

import { api } from '../utils/apiRequest';
import print1 from '../assets/icons/print.png';
import icon from '../assets/icons/Vector.png';
import icon1 from '../assets/icons/Vector (1).png';
import icon2 from '../assets/icons/file_download.png';
import icon3 from '../assets/icons/Vector (2).png';

import { handleDownloadInvoice } from '../utils/common';

import QRCode from 'react-qr-code';

type PaymentSummary = {
  amount: number;
  id: number;
  paymentDate: string;
  paymentMode: number;
  createdAt: string;
};

const Invoice = () => {
  const [data, setData] = useState<Record<string, any>>();

  const [trackingData, setTrackingData] = useState<Record<string, any>>();

  const [trackingId, setTrackingId] = useState<string>('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [selectedOption, setSelectedOption] = useState<1 | 2>(1);

  const pathSegments = location.pathname.split('/');
  const urlTrackingId = pathSegments[pathSegments.length - 2];
  // eslint-disable-next-line no-console
  console.log(urlTrackingId);

  const url = `tracking/track/${urlTrackingId}?is_invoice=true`;
  // eslint-disable-next-line no-console
  console.log(url);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract tracking ID from URL path
        //const pathSegments = location.pathname.split('/');
        //const urlTrackingId = pathSegments[pathSegments.length - 1];

        setTrackingId(urlTrackingId);

        if (urlTrackingId) {
          const trackingDetails = await api.getRequest(
            `tracking/track/${urlTrackingId}?is_invoice=true`
          );
          setTrackingData(trackingDetails?.data);
          setData(trackingDetails?.data);

          setData((prevData) => ({
            ...prevData,
            tracking_info: trackingDetails?.data,
          }));
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in data fetching:', error);
      }
    };

    fetchData();
  }, [location]);

  const order_id = trackingData?.invoice?.order_summary?.order_id;

  useEffect(() => {
    if (order_id && order_id > 0) {
      void getInvoiceLink();
    }
  }, [order_id]);

  // const handlePrint = async () => {
  //   try {
  //     const response = await api.postRequest('order/print_invoice', {
  //       orderId: 1693,
  //       invoiceCopyType: ['customer_copy', 'business_copy'],
  //       printerType: 'thermal_printer',
  //     });

  //     if (response?.status) {
  //       const rawPrinterData = response.data;
  //       const blob = new Blob([rawPrinterData], { type: 'application/octet-stream' });
  //       const fileURL = URL.createObjectURL(blob);

  //       const printFrame = document.createElement('iframe');
  //       printFrame.style.display = 'none';
  //       printFrame.src = fileURL;
  //       document.body.appendChild(printFrame);

  //       printFrame.onload = () => {
  //         printFrame.contentWindow?.print();
  //         setTimeout(() => {
  //           document.body.removeChild(printFrame);
  //           URL.revokeObjectURL(fileURL);
  //         }, 1000);
  //       };
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.log('Print Error:', error);
  //   }
  // };

  // const getTrackingId = async (entityId: number) => {
  //   const response = await api.postRequest('tracking/track', {
  //     entity_id: entityId,
  //     entity_type: 'ORDER',
  //   });

  //   return response?.data;
  // };

  // eslint-disable-next-line no-console
  console.log(order_id);

  // const getInvoiceLink = async () => {
  //   try {
  //     const boutique_id = getValueFromLocalStorage('boutique_id');

  //     const payload = {
  //       entity_type: 'invoice',
  //       entity_id: order_id || 2548,
  //       meta_data: {
  //         boutique_id,
  //       },
  //     };

  //     //const response = await api.postRequest(`storage/file/link`, payload);
  //     const response = await api.postRequest(`storage/file/link`, payload);

  //     if (response.status) {
  //       setInvoiceLink(response.data.link);
  //     }
  //   } catch (err) {
  //     if (err instanceof Error) {
  //       toasts('error', err.message, 'get-invoice-link-error');
  //     }
  //   }
  // };

  const getInvoiceLink = async () => {
    // eslint-disable-next-line no-console
    console.log(data?.invoice?.order_summary?.order_id);
    try {
      const payload = {
        entity_type: 'invoice',
        entity_id: data?.invoice?.order_summary?.order_id,
      };

      const response = await api.postRequest(`tracking/track/${urlTrackingId}/file/link`, payload);

      if (response.status) {
        setInvoiceLink(response.data.link);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-invoice-link-error');
      }
    }
  };

  const handleShare = async (link: string) => {
    try {
      setIsSharing(true);
      const response = await fetch(link);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${data?.invoice?.order_summary?.boutique_order_id ?? ''}_invoice.pdf`,
        {
          type: 'application/pdf',
        }
      );

      const customerPhone = data?.invoice?.customer_phone_number?.replace(/\D/g, '');

      if (navigator.share && file) {
        await navigator.share({
          files: [file],
          title: 'Invoice',
          text: 'Here is your invoice',
        });
      } else {
        const whatsappURL = customerPhone ? `https://wa.me/${customerPhone}` : `https://wa.me/`;
        window.open(whatsappURL, '_blank');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sharing file:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // eslint-disable-next-line no-console
  console.log(trackingData);

  //for print

  // const handlePrint = () => {
  //   // eslint-disable-next-line no-console
  //   console.log('Printing copy type:', selectedOption === 1 ? 'Customer Copy' : 'Personal Copy');
  //   setpopup(!popup);
  // };
  const handlePrint = async () => {
    try {
      const payload = {
        entityType: 'invoice',
        entityId: data?.invoice?.order_summary?.order_id, // Use actual order ID from data
        metaData: {
          boutiqueId: data?.invoice?.boutique_id, // Use actual boutique ID from data
        },
        printerTypeOrdinal: 2,
        copyTypeOrdinal: [2], // Use the selected option (1 for Customer Copy, 2 for Personal Copy)
      };

      const response = await api.postRequest('order/print_invoice', payload);

      if (response?.status && response?.data?.pdfUrl) {
        window.open(response.data.pdfUrl, '_blank');
      }

      setpopup(false); // Close the popup after successful print
    } catch (error) {
      toasts('error', 'Failed to print invoice', 'print-invoice-error');
    }
  };

  const [popup, setpopup] = useState(false);

  //const [checks, setchecks] = useState(true);

  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [popup]);

  const handleUPIPayment = () => {
    const paymentLink = data?.invoice?.redirect_payment_link;
    // Try opening in new window first
    const paymentWindow = window.open(paymentLink, '_blank');

    // Fallback to direct location change if window.open fails
    if (!paymentWindow) {
      window.location.href = paymentLink;
    }
  };

  if (urlTrackingId === 'invoice_tracking' || !data?.invoice?.boutique_name) {
    return (
      <div className="flex w-screen items-center justify-center h-screen bg-[#4D7AFF]">
        <Text size="xxxl" fontWeight={600} color="white">
          No Data Found
        </Text>
      </div>
    );
  }

  return (
    <div className="bg-[#4D7AFF] w-full h-lvh   overflow-y-scroll">
      {/* popup */}
      {popup && (
        <div className=" w-full absolute h-screen items-center justify-center  bg-[#756f6f98]  flex flex-col  z-[900] ">
          <div className="w-[400px] rounded-lg border bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-[1.25rem] font-inter font-[700] text-[#4F4F4F]">
                Select Bill Print Options
              </h2>
              <button className="rounded-lg p-1 hover:bg-gray-100">
                <RxCross2 onClick={() => setpopup(!popup)} className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 p-4">
              {/* Customer Copy Option */}
              <div
                onClick={() => setSelectedOption(1)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
            ${
              selectedOption === 1 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
              ${
                selectedOption === 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
              }`}
                  >
                    {selectedOption === 1 && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Customer Copy</span>
                </div>
              </div>

              {/* Personal Copy Option */}
              <div
                onClick={() => setSelectedOption(2)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
            ${
              selectedOption === 2 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
              ${
                selectedOption === 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
              }`}
                  >
                    {selectedOption === 2 && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Personal Copy</span>
                </div>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="mt-2 w-full flex items-center justify-center gap-3 rounded-lg font-inter font-[500] text-[1.2rem] bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Print <img src={print1} alt="" className="h-[20px] aspect-auto" />
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full h-fit p-[2rem] ">
        <div className="w-full">
          <img src={logo} alt="logo" className="md:h-[70px] h-[60px] aspect-auto" />
          <p className="font-inter text-[13px] font-semibold italic leading-[15.73px] text-[#FFFFFF] ml-[2rem]">
            Powered by Darzee
          </p>
          <div className="fle hidden items-center gap-1">
            <Text fontWeight={600}>Tracking ID niti:</Text>
            <Text fontWeight={500} color="black">
              {trackingId || '-'}
            </Text>
          </div>
        </div>
        <div className="w-full h-fit my-[.7rem] md:my-[2rem] flex">
          <div className="md:w-[70%] w-[100%] h-fit bg-white rounded-md md:py-[3rem] py-[1rem] px-[.8rem] md:px-[6rem]">
            <div className="w-full flex items-center justify-between ">
              <p className="font-inter font-[700] text-[#525252]  md:text-[2.5rem] text-[2.2rem]">
                Invoice
              </p>
              <div className="md:hidden flex items-center justify-between gap-4">
                <img onClick={handleUPIPayment} src={upi} alt="" className="h-[28px] aspect-auto" />
                <img
                  onClick={() => {
                    handlePrint();
                  }}
                  src={icon}
                  alt=""
                  className="h-[22px] aspect-auto"
                />
                <img
                  onClick={() => handleShare(invoiceLink)}
                  src={icon1}
                  alt=""
                  className="h-[22px] aspect-auto"
                />
                <img
                  onClick={() => {
                    handleDownloadInvoice(
                      invoiceLink,
                      `${data?.invoice?.order_summary?.boutique_order_id ?? ''}_invoice.pdf`
                    );
                  }}
                  src={icon2}
                  alt=""
                  className="h-[26px] aspect-auto"
                />
                <img src={icon3} alt="" className="h-[22px] aspect-auto hidden" />
              </div>
            </div>

            <div className="w-full h-fit flex">
              <div className="w-[50%]">
                <Text fontWeight={600} color="#32343AB2">
                  {data?.invoice?.boutique_name ?? 'Boutique name'}
                </Text>
                <div className="my-[.7rem]">
                  <Text fontWeight={500} color="#32343AB2">
                    {data?.invoice?.boutique_address?.addressLine1}
                    {data?.invoice?.boutique_address?.addressLine2 &&
                      `, ${data?.invoice?.boutique_address?.addressLine2}`}
                  </Text>
                  <Text fontWeight={500} color="#32343AB2">
                    {data?.invoice?.boutique_address?.city},{' '}
                    {data?.invoice?.boutique_address?.state} -{' '}
                    {data?.invoice?.boutique_address?.postalCode}
                  </Text>
                  <Text fontWeight={500} color="#32343AB2">
                    {data?.invoice?.customer_phone_number ?? 'phone no'}
                  </Text>
                </div>
                {/* <Text fontWeight={500} color="#32343AB2">
                  GST Number: 123456789
                </Text> */}
              </div>
              <div className="w-[50%] flex flex-col items-center justify-center gap-3">
                <img src={bg2} alt="bg2" className="h-[80px] aspect-auto" />
                <div className="md:flex hidden flex-col justify-center items-end">
                  <div className="flex justify-center items-center gap-1">
                    <Text fontWeight={600}>Invoice Date:</Text>
                    <Text fontWeight={500} color="black">
                      {!_isNil(data?.invoice?.invoice_date_time)
                        ? new Date(data?.invoice?.invoice_date_time).toDateString()
                        : '-'}
                    </Text>
                  </div>
                  <div className="flex justify-center items-center gap-1">
                    <Text fontWeight={600}>Invoice Number:</Text>
                    <Text fontWeight={500} color="black">
                      {data?.invoice?.order_summary?.invoice_no ?? '-'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
            <p className="w-full bg-[#97979780] h-[1px] my-4"></p>
            <div className="w-full md:h-[75vh] h-fit md:overflow-y-scroll flex flex-col md:p-[2rem] p-[.4rem] gap-10">
              <div className="w-full flex md:flex-row flex-col justify-between">
                <div className="md:w-[50%] flex flex-col my-[1rem]">
                  <div className="flex items-center md:justify-start justify-between gap-1">
                    <Text fontWeight={600}>Customer Name:</Text>
                    <Text fontWeight={500} color="black">
                      {data?.invoice?.customer_name}
                    </Text>
                  </div>
                  <div className="flex items-center md:justify-start justify-between gap-1">
                    <Text fontWeight={600}>Order Number:</Text>
                    <Text fontWeight={500} color="black">
                      {data?.invoice?.order_summary?.boutique_order_id ?? '-'}
                    </Text>
                  </div>
                  <div className="flex items-center md:justify-start justify-between gap-1">
                    <Text fontWeight={600}>Order Received Date:</Text>
                    <Text fontWeight={500} color="black">
                      {!_isNil(data?.invoice?.recieve_date_time)
                        ? new Date(data?.invoice?.recieve_date_time).toDateString()
                        : '-'}
                    </Text>
                  </div>
                  <div className="w-[100%] md:my-[3rem] my-[1.5rem]">
                    <div className="flex items-center gap-2">
                      <Text fontWeight={700} size="medium" color="#525252">
                        Transactions
                      </Text>
                      <img src={transtion} alt="tran" className="size-5" />
                    </div>

                    {data?.invoice?.order_summary?.payment_summary_response_list?.map(
                      (payment: PaymentSummary, index: number) => (
                        <div key={index} className="w-full">
                          <div className="w-full flex gap-2">
                            <Text fontWeight={600} size="small">
                              {moment(payment?.createdAt).format('Do MMM YYYY, h:mm A')}
                            </Text>
                            <div className="flex gap-1">
                              <Text fontWeight={600} size="small" color="#30BC00">
                                ₹ {payment?.amount ?? 0}
                              </Text>
                              <Text fontWeight={600} size="small">
                                received via
                              </Text>
                            </div>
                            <Text fontWeight={600} size="small" color="#323233" className="">
                              {paymentModeOptions.find(
                                (option) => option.value === (payment?.paymentMode || 1)
                              )?.label ?? '-'}
                            </Text>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="w-full fle hidden gap-2 items-center mt-[1rem]">
                    <Text fontWeight={600}>Last Updated:</Text>
                    <Text fontWeight={600}>26 Jan 2022 / 3:30 Pm</Text>
                  </div>
                  <div className="w-auto h-auto mt-[2rem]">
                    <p className="font-semibold text-[1.1rem] my-[1rem]">Pay via upi</p>
                    <QRCode
                      size={160}
                      bgColor="white"
                      fgColor="black"
                      value={data?.invoice?.payment_link || ''}
                    />
                  </div>
                </div>
                <div className="flex flex-col flex-[0.75] min-w-[300px] gap-2">
                  <div className="bg-[rgba(238,242,255,1)] rounded p-3 px-5">
                    <Text size="large" fontWeight={600}>
                      Order Summary
                    </Text>
                    <div className="mt-6 flex flex-col gap-3">
                      {data?.invoice?.order_summary?.order_item_summary_list?.map(
                        (itemObj: any, index: number) => {
                          const total =
                            itemObj?.price_breakup?.reduce(
                              (sum: number, currPriceObj: OrderPriceBreakupType) =>
                                sum + (currPriceObj?.value ?? 0) * currPriceObj.component_quantity,
                              0
                            ) ?? 0;

                          return (
                            <div key={index}>
                              <div className="flex items-center justify-between ">
                                <Text color="black" fontWeight={700}>
                                  {itemObj?.outfit_alias ?? '-'}
                                </Text>
                                <Text color="black" fontWeight={700}>
                                  {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                                    total ?? 0
                                  )}`}
                                </Text>
                              </div>

                              <div className="my-2 flex flex-col gap-2 pl-2">
                                {itemObj?.price_breakup?.map(
                                  (priceObj: OrderPriceBreakupType, index: number) => (
                                    <div
                                      key={index}
                                      className="amount-item flex items-center justify-between"
                                    >
                                      <Text size="small" color="black" fontWeight={500}>
                                        {priceObj?.component ?? '-'}
                                      </Text>
                                      <Text size="small" color="black" fontWeight={500}>
                                        {priceObj.component === 'Stitching Cost'
                                          ? `${priceObj.component_quantity} x ${priceObj.value} = `
                                          : ` `}
                                        {` ${
                                          moneyFormatSigns.rupee
                                        } ${convertNumberOrStringToPriceFormat(
                                          (priceObj?.component_quantity ?? 0) *
                                            (priceObj?.value ?? 0)
                                        )}`}
                                      </Text>
                                    </div>
                                  )
                                )}
                              </div>

                              <Text size="small" fontWeight={500} className="pl-2">
                                {`Delivery Date: ${
                                  itemObj?.delivery_date
                                    ? new Date(itemObj.delivery_date).toDateString()
                                    : '-'
                                }`}
                              </Text>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>

                  <div className="bg-[rgba(238,242,255,1)] rounded min-h-[40px] p-3 px-5">
                    <div className="flex items-center justify-between">
                      <Text color="black" fontWeight={600}>
                        Total:
                      </Text>
                      <Text color="black" fontWeight={600}>
                        {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                          data?.invoice?.order_summary?.total_order_amount ?? 0
                        )}`}
                      </Text>
                    </div>
                  </div>

                  <div className="bg-[rgba(238,242,255,1)] rounded min-h-[40px] p-3 px-5">
                    <div className="flex items-center justify-between">
                      <Text color="black" fontWeight={600}>
                        Advance (if any):
                      </Text>
                      <Text color="black" fontWeight={600}>
                        {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                          data?.invoice?.order_summary?.order_advance_recieved ?? 0
                        )}`}
                      </Text>
                    </div>
                  </div>

                  <div className="bg-[rgba(238,242,255,1)] rounded min-h-[40px] p-3 px-5">
                    <div className="flex items-center justify-between">
                      <Text color="black" fontWeight={600}>
                        Balance Due:
                      </Text>
                      <Text fontWeight={600} color="tertiary">
                        {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                          (data?.invoice?.order_summary?.total_order_amount ?? 0) -
                            (data?.invoice?.order_summary?.order_advance_recieved ?? 0)
                        )}`}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-[1rem] mb-[1.5rem]">
                <Text size="xxxl" fontWeight={600}>
                  Thank You for your business
                </Text>
                <Text fontWeight={600}>Terms and conditions</Text>
                {data?.invoice?.boutique_terms_and_condition?.conditions?.map(
                  (condition: string, index: number) => (
                    <Text key={index} fontWeight={500}>
                      - {condition}
                    </Text>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="md:w-[30%] f-fit md:flex hidden flex-col items-center mt-[20%] gap-[1rem]">
            <button
              onClick={handleUPIPayment}
              className="bg-white w-[50%] px-4 py-2 font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              Pay via UPI <img src={upi} alt="" className="h-[30px] aspect-auto" />
            </button>
            <button
              onClick={() => {
                handlePrint();
              }}
              className="bg-white px-4 w-[50%] py-2 font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              Print <img src={print} alt="" className="h-[25px] aspect-auto" />
            </button>
            <button
              onClick={() => handleShare(invoiceLink)}
              disabled={isSharing}
              className="bg-white px-4 py-2 w-[50%] font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              {isSharing ? 'Preparing...' : 'Send Bill'}
              {isSharing ? (
                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <RiWhatsappFill className="text-green-600 text-[1.2rem] cursor-pointer" />
              )}
            </button>
            <button
              onClick={() => {
                handleDownloadInvoice(
                  invoiceLink,
                  `${data?.invoice?.order_summary?.boutique_order_id ?? ''}_invoice.pdf`
                );
              }}
              className="bg-white px-4 py-2 w-[50%] font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              Download Pdf <BiSolidDownload color="var(--color-primary)" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
