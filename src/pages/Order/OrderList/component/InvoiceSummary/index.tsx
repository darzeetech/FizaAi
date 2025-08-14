import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import _isNil from 'lodash/isNil';
import { BiSolidDownload } from 'react-icons/bi';
import { RxCross2 } from 'react-icons/rx';
import { MdOutlineInsertLink } from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';

import { api } from '../../../../../utils/apiRequest';
import {
  convertNumberOrStringToPriceFormat,
  getValueFromLocalStorage,
  handleDownloadInvoice,
} from '../../../../../utils/common';
import { positiveNumberRegex } from '../../../../../utils/regexValue';
import { moneyFormatSigns } from '../../../../../utils/contant';

import { DropdownField, InputField } from '../../../../../components/FormComponents';
import { Button, Modal, ModalMethods, Text, toasts } from '../../../../../ui-component';
import type { OrderPriceBreakupType } from '../../../CreateOrder/type';

import { paymentModeOptions } from './constant';
import {
  InvoiceSummaryContainer,
  InvoiceSummaryContent,
  ModalBody,
  PaymentOptionItem,
} from './style';
import { RiWhatsappFill } from 'react-icons/ri';
import transtion from '../../../../../assets/images/money.png';
import transtion1 from '../../../../../assets/images/money1.png';
import print from '../../../../../assets/images/print.png';
import { MdDeleteOutline } from 'react-icons/md';
//import { useReactToPrint } from 'react-to-print';
//import print1 from '../../../../../assets/icons/print.png';

type InvoiceSummaryProps = {
  order_id: number;
  orderStatus: string;
  setIsLoading: (data: boolean) => void;
};
type PaymentSummary = {
  amount: number;
  id: number;
  paymentDate: string;
  paymentMode: number;
  createdAt: string;
};

const InvoiceSummary = ({ order_id, orderStatus, setIsLoading }: InvoiceSummaryProps) => {
  const ref = useRef<ModalMethods>(null);
  const editModalRef = useRef<ModalMethods>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Group all state hooks
  const [invoiceLink, setInvoiceLink] = useState('');
  const [data, setData] = useState<Record<string, any>>();
  const [recieveAmount, setRecieveAmount] = useState<string | undefined>();
  const [err, setErr] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<Record<string, any>>(paymentModeOptions[0]);
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<number[]>([]);
  // First useState for printer type (A4 Printer=1, Thermal=2)
  const [printerType, setPrinterType] = useState(2);

  // Second useState for copy type (Worker=1, Customer=2, Person=3)
  const [copyType, setCopyType] = useState(3); // Default to Personal Copy (3)
  const [whatsappOption, setWhatsappOption] = useState<boolean>(true);
  const [popup, setpopup] = useState(false);
  const [popupw, setpopupw] = useState(false);
  const [link, setlink] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  //const [trackingId, setTrackingId] = useState<string>('');
  //const [trackingUrl, setTrackingUrl] = useState<string>('');
  const [shareMessage, setShareMessage] = useState<string>('');
  const [shareMessage2, setShareMessage2] = useState<string>('');

  const [referenceId, setReferenceId] = useState('');

  const entity_id = data?.order_summary?.boutique_order_id;

  const getTrackingDetails = async () => {
    try {
      const payload = {
        entity_id: entity_id,
        entity_type: 'ORDER',
        is_invoice: whatsappOption,
      };

      const response = await api.postRequest('tracking/track', payload);

      if (response.status) {
        //const { tracking_id, tracking_url, share_message } = response.data;
        const { share_message } = response.data;

        // Set all values first
        await Promise.all([
          //setTrackingId(tracking_id),
          //setTrackingUrl(tracking_url),
          setShareMessage(share_message),
        ]);
        // Then trigger share after states are updated
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'tracking-error');
      }
    }
  };

  const getTrackingDetails2 = async () => {
    try {
      const payload = {
        entity_id: entity_id,
        entity_type: 'ORDER',
        is_invoice: false,
      };

      const response = await api.postRequest('tracking/track', payload);

      if (response.status) {
        //const { tracking_id, tracking_url, share_message } = response.data;
        const { share_message } = response.data;

        // Set all values first
        await Promise.all([
          //setTrackingId(tracking_id),
          //setTrackingUrl(tracking_url),
          setShareMessage2(share_message),
        ]);
        // Then trigger share after states are updated
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'tracking-error');
      }
    }
  };

  useEffect(() => {
    if (entity_id && entity_id > 0) {
      void getTrackingDetails();
      void getTrackingDetails2();
    }
  }, [entity_id]);

  // Group all effects
  useEffect(() => {
    if (popup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [popup]);

  useEffect(() => {
    if (popupw) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [popupw]);

  useEffect(() => {
    if (link) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [link]);

  useEffect(() => {
    if (!_isNil(order_id)) {
      void getInvoiceLink();
      void getInvoiceDetails();
    }
  }, [order_id]);

  // Update the print button click handler
  // const handlePrint = () => {
  //   if (reactToPrintFn) {
  //     reactToPrintFn();
  //   }
  // };

  const handlePrint1 = async () => {
    try {
      const boutiqueId = getValueFromLocalStorage('boutique_id');
      const payload = {
        entityType: 'invoice',
        entityId: order_id,
        metaData: {
          boutiqueId,
        },
        printerTypeOrdinal: printerType,
        copyTypeOrdinal: [copyType],
      };
      // eslint-disable-next-line no-console
      //console.log('Print Invoice Request Initiated');

      const response = await api.postRequest('order/print_invoice', payload);

      if (!response?.status) {
        throw new Error(response?.message || 'Failed to generate invoice');
      }

      //  For Thermal Printer (ESC/POS)
      if (printerType == 1) {
        if (response.isRawHex && response.rawHex) {
          // Convert hex back to Uint8Array
          const uint8Array = new Uint8Array(
            response.rawHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16))
          );

          const blob = new Blob([uint8Array], {
            type: 'application/octet-stream',
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice_${order_id}.escpos`;

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } else {
          throw new Error('ESC/POS content missing in response');
        }
      }
      // 🟢 For A4 Printer
      else {
        if (response?.data?.pdfUrl) {
          window.open(response.data.pdfUrl, '_blank');
        } else {
          throw new Error('PDF URL not found in response');
        }
      }

      setpopup(false);
    } catch (error) {
      toasts(
        'error',
        error instanceof Error ? error.message : 'Failed to print invoice',
        'print-invoice-error'
      );
    }
  };

  const getInvoiceLink = async () => {
    try {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const payload = {
        entity_type: 'invoice',
        entity_id: order_id,
        meta_data: {
          boutique_id,
        },
      };

      setIsLoading(true);
      const response = await api.postRequest(`storage/file/link`, payload);

      const { status, data } = response;

      if (status) {
        setInvoiceLink(data.link);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-invoice-link-error');
      }
    }

    setIsLoading(false);
  };

  const getInvoiceDetails = async () => {
    try {
      setIsLoading(true);
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const response = await api.getRequest(
        `order/${order_id}/invoice_detail?boutique_id=${boutique_id}`
      );

      const { status, data } = response;

      if (status) {
        setData(data);
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'get-invoice-summary-error');
      }
    }

    setIsLoading(false);
  };

  const handleChange = (value: string, errMsg?: string) => {
    setRecieveAmount(value);
    setErr(errMsg);
  };

  const handleConfirmBtn = () => {
    if (!_isNil(err) && !_isNil(recieveAmount)) {
      ref.current?.show();
    } else {
      toasts('error', 'Please fill correct amount', 'amount-error');
    }
  };

  const handleModalClose = () => {
    ref.current?.hide();
  };

  const handleModalSave = async () => {
    try {
      const payload = {
        payment_mode: paymentMethod.value,
        payment_date: moment(new Date()).format('YYYY/DD/MM'),
        amount: parseFloat(recieveAmount ?? '0'),
      };
      const boutique_id = getValueFromLocalStorage('boutique_id');
      setIsLoading(true);

      const response = await api.postRequest(
        `order/${order_id}/recieve_payment?boutique_id=${boutique_id}`,
        payload
      );
      const { status } = response;

      if (status) {
        ref.current?.hide();

        void getInvoiceDetails();
        setRecieveAmount('');
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'recieve-payment-err');
      }
    }

    setIsLoading(false);
  };

  const CustomOption = (props: any) => {
    const { innerProps, innerRef, isSelected } = props;

    return (
      <PaymentOptionItem $isSelected={isSelected as boolean} ref={innerRef} {...innerProps}>
        <div className="img">{props.data.icon}</div>
        <div className="revision-text">
          <Text color={isSelected ? 'white' : 'black'} fontWeight={600}>
            {props.data.label}
          </Text>
        </div>
      </PaymentOptionItem>
    );
  };

  const handleSelectPayment = (value: any) => {
    setPaymentMethod(value);
  };

  //eslint-disable-next-line
  // const handleShare = (link: string) => {
  //   // const whatsappURL = `whatsapp://send?text=${encodeURIComponent(link)}`;
  //   // window.location.href = whatsappURL;

  //   const customerPhone = data?.customer_phone_number?.replace(/\D/g, ''); // Remove non-digits
  //   // eslint-disable-next-line no-console
  //   //console.log(customerPhone);
  //   const whatsappURL = customerPhone
  //     ? `https://wa.me/${customerPhone}?text=${encodeURIComponent(link)}`
  //     : `https://wa.me/?text=${encodeURIComponent(link)}`;
  //   window.open(whatsappURL, '_blank');
  // };

  const handleShare = async (link: string) => {
    try {
      setIsSharing(true); // Show loader
      const response = await fetch(link);
      const blob = await response.blob();
      const file = new File([blob], `${data?.order_summary.boutique_order_id ?? ''}_invoice.pdf`, {
        type: 'application/pdf',
      });

      const customerPhone = data?.customer_phone_number?.replace(/\D/g, '');

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
      setIsSharing(false); // Hide loader
    }
  };

  // const handleShare1 = async () => {
  //   try {
  //     setIsSharing(true);
  //     // eslint-disable-next-line no-console
  //     console.log(data);
  //     const customerPhone = data?.customer_phone_number?.replace(/\D/g, '');
  //     // eslint-disable-next-line no-console
  //     console.log(customerPhone);

  //     if (navigator.share) {
  //       await navigator.share({
  //         text: shareMessage,
  //       });
  //     } else {
  //       const whatsappURL = customerPhone
  //         ? `https://wa.me/${customerPhone}?text=${encodeURIComponent(shareMessage)}`
  //         : `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
  //       window.open(whatsappURL, '_blank');
  //     }
  //   } catch (error) {
  //     // eslint-disable-next-line no-console
  //     console.error('Error sharing message:', error);
  //   } finally {
  //     setIsSharing(false);
  //   }
  // };

  const handleShare1 = async () => {
    try {
      setIsSharing(true);
      const customerPhone = data?.customer_phone_number?.replace(/\D/g, '');

      // Create WhatsApp URL based on option
      const whatsappURL = `https://wa.me/${customerPhone}?text=${encodeURIComponent(
        whatsappOption ? shareMessage : shareMessage2
      )}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error sharing message:', error);
    } finally {
      setIsSharing(false);
    }
  };
  const handleEditButton = () => {
    navigate(`/orders/${order_id}?formType=edit`);
  };

  if (_isNil(data)) {
    return null;
  }

  // eslint-disable-next-line no-console
  //console.log(data);

  const handleDeleteTransaction = (paymentId: number) => {
    // Use callback form of setState to ensure we have latest state
    setSelectedPaymentIds((prevIds) => {
      const newIds = [...prevIds, paymentId];
      // eslint-disable-next-line no-console
      //console.log(newIds); // Log the updated array here

      return newIds;
    });

    // Rest of the function remains same
    const updatedPaymentList = data?.order_summary?.payment_summary_response_list.filter(
      (payment: PaymentSummary) => payment.id !== paymentId
    );

    setData({
      ...data,
      order_summary: {
        ...data.order_summary,
        payment_summary_response_list: updatedPaymentList,
      },
    });
  };

  //const [checks, setchecks] = useState(true);

  const whatappshare = async () => {
    try {
      await getTrackingDetails();
      await handleShare1();
      setpopupw(false);
    } catch (error) {
      // Handle any errors that occur during the process
      toasts('error', 'Failed to share tracking details', 'tracking-share-error');
    }
  };

  // Add this function before the return statement in the InvoiceSummary component

  const handleSaveReferenceId = async () => {
    try {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const payload = {
        order_id: order_id,
        boutique_id: parseInt(boutique_id),
        other_reference_id: referenceId,
      };

      setIsLoading(true);

      const response = await api.putRequest(`order/${order_id}`, payload);

      if (response.status) {
        toasts('success', 'Reference ID saved successfully', 'save-reference-success');
        setlink(false); // Close the popup

        // Refresh the invoice summary data
        void getInvoiceDetails();
      }
    } catch (err) {
      if (err instanceof Error) {
        toasts('error', err.message, 'save-reference-error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line no-console
  //console.log(trackingId);
  // eslint-disable-next-line no-console
  //console.log(trackingUrl);
  // eslint-disable-next-line no-console
  //console.log(shareMessage);

  return (
    <InvoiceSummaryContainer>
      {/* popup */}
      {popup && (
        <div className="w-full absolute h-screen bg-[#756f6f98] flex flex-col z-[900]">
          <div className="w-[450px] rounded-lg border bg-white shadow-sm mt-[5rem] -ml-[13rem]">
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
              {/* Printer Type Selection */}
              <div className="flex justify-between mb-4 mx-[2rem]">
                {/* A4 Printer Option */}
                <div
                  onClick={() => setPrinterType(2)}
                  className={`flex flex-col items-center cursor-pointer w-[45%] ${
                    printerType === 2 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`rounded-full p-3 ${
                      printerType === 2 ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                      />
                    </svg>
                  </div>
                  <span className="mt-2 text-[17px] font-medium">A4 Printer</span>
                </div>

                {/* Thermal Printer Option */}
                <div
                  onClick={() => setPrinterType(1)}
                  className={`flex flex-col items-center cursor-pointer w-[45%] ${
                    printerType === 1 ? 'text-blue-500' : 'text-gray-500'
                  }`}
                >
                  <div
                    className={`rounded-full p-3 ${
                      printerType === 1 ? 'bg-blue-500' : 'bg-gray-200'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <span className="mt-2 text-[17px] font-medium">Thermal</span>
                </div>
              </div>

              {/* Copy Type Options */}
              {/* Worker Copy Option */}
              <div
                onClick={() => setCopyType(1)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
                 ${
                   copyType === 1 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                 }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
                     ${
                       copyType === 1 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                     }`}
                  >
                    {copyType === 1 && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Personal Copy</span>
                </div>
              </div>

              {/* Customer Copy Option */}
              <div
                onClick={() => setCopyType(2)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
                 ${
                   copyType === 2 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                 }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
                     ${
                       copyType === 2 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                     }`}
                  >
                    {copyType === 2 && (
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
                onClick={() => setCopyType(3)}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
                 ${
                   copyType === 3 ? 'border-blue-500 bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                 }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
                     ${
                       copyType === 3 ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                     }`}
                  >
                    {copyType === 3 && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Worker Copy</span>
                </div>
              </div>

              {/* Print Button */}
              <button
                onClick={handlePrint1}
                className="mt-2 w-full flex items-center justify-center gap-3 rounded-lg font-inter font-[500] text-[1.2rem] bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Print
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {popupw && (
        <div className=" w-full absolute h-screen    bg-[#756f6f98]  flex flex-col  z-[900] ">
          <div className="w-[400px] rounded-lg border bg-white shadow-sm mt-[6rem] -ml-[12rem]">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-[1.25rem] font-inter font-[700] text-[#4F4F4F]">
                Select an Option
              </h2>
              <button className="rounded-lg p-1 hover:bg-gray-100">
                <RxCross2 onClick={() => setpopupw(!popupw)} className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 p-4">
              {/* Customer Copy Option */}
              <div
                onClick={() => {
                  setWhatsappOption(true);
                }}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
            ${
              whatsappOption === true
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
              ${
                whatsappOption === true
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300'
              }`}
                  >
                    {whatsappOption === true && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Send Invoice</span>
                </div>
              </div>

              {/* Personal Copy Option */}
              <div
                onClick={() => {
                  setWhatsappOption(false);
                }}
                className={`cursor-pointer rounded-lg border p-4 transition-colors
            ${
              whatsappOption === false
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-sm border
              ${
                whatsappOption === false
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-300'
              }`}
                  >
                    {whatsappOption === false && (
                      <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium">Send Invoice + Item Details</span>
                </div>
              </div>

              {/* Print Button */}
              <button
                onClick={whatappshare}
                className="mt-2 w-full flex items-center justify-center gap-3 rounded-lg font-inter font-[500] text-[1.2rem] bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Send Invoice{' '}
                <RiWhatsappFill className="text-green-60 text-[1.2rem] cursor-pointer" />
              </button>
            </div>
          </div>
        </div>
      )}

      {link && (
        <div className=" w-full absolute h-screen    bg-[#756f6f98]  flex flex-col  z-[900] ">
          <div className="w-[400px] rounded-lg border bg-white shadow-sm mt-[6rem] -ml-[12rem]">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-[1.25rem] flex items-center font-inter font-[700] text-[#4F4F4F]">
                <MdKeyboardArrowLeft
                  onClick={() => setlink(!link)}
                  className="text-[2rem] font-bold cursor-pointer"
                />{' '}
                Link Reference ID
              </h2>
              <button className="rounded-lg p-1 hover:bg-gray-100">
                <RxCross2 onClick={() => setlink(!link)} className="h-5 w-5 font-semibold" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 p-4 flex flex-col">
              {/* Input Field */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  className="w-full h-12 px-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={8}
                />
              </div>
              <p className="text-sm text-gray-600 ">Maximum 8 Digit Alpha-Numeric</p>

              {/* Print Button */}
              <button
                onClick={handleSaveReferenceId}
                className="mt-2 w-full flex items-center justify-center gap-3 rounded-lg font-inter font-[500] text-[1.2rem] bg-blue-500 py-2 text-white transition-colors hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="invoice-header">
        <Text fontWeight={500}> Order Details</Text>
        <div className="header-btn-container">
          {orderStatus === 'Drafted' && (
            <Button appearance="outlined" onClick={handleEditButton}>
              Edit
            </Button>
          )}
          <Button
            appearance="outlined"
            className="flex items-center gap-2"
            onClick={() => editModalRef.current?.show()}
          >
            <p className=" font-inter font-[600]">Edit</p>
            <img src={transtion1} alt="tran" className="size-5" />
          </Button>

          <Button
            appearance="outlined"
            onClick={() => {
              handleDownloadInvoice(
                invoiceLink,
                `${data?.order_summary.boutique_order_id ?? ''}_invoice.pdf`
              );

              //   window.open(invoiceLink, '_blank');
            }}
            trailingIcon={<BiSolidDownload color="var(--color-primary)" size={16} />}
          >
            <p className=" font-inter font-[600]"> Download pdf</p>
          </Button>
          <Button
            onClick={() => setpopup(!popup)}
            appearance="outlined"
            className=" flex gap-2 items-center"
          >
            <p className=" font-inter font-[600]"> Print</p>
            <img src={print} alt="tran" className="size-5" />
          </Button>
          <Button
            onClick={() => setpopupw(!popupw)}
            appearance="outlined"
            className=" flex gap-2 items-center"
          >
            <p className=" font-inter font-[600]"> send Link</p>
            <RiWhatsappFill className="text-green-600 text-[1.2rem] cursor-pointer" />
          </Button>
          <p onClick={() => handleShare(invoiceLink)} className=" hidden"></p>
          <button
            onClick={() => handleShare(invoiceLink)}
            //appearance="outlined"
            className="fle hidden  gap-2"
            disabled={isSharing}
          >
            <p className="font-inter font-[600]">{isSharing ? 'Preparing...' : 'send bill'}</p>
            {isSharing ? (
              <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <RiWhatsappFill className="text-green-600 text-[1.2rem] cursor-pointer" />
            )}
          </button>
        </div>
      </div>
      <InvoiceSummaryContent ref={contentRef}>
        <div className="content-container">
          <div>
            <Text fontWeight={600} size="xxxl">
              Invoice
            </Text>
            <Text fontWeight={700}>{data?.boutique_name ?? '-'}</Text>
          </div>
          <div className="invoice-right-info">
            <div className="invoice-info-text">
              <Text fontWeight={600}>Invoice Date:</Text>
              <Text fontWeight={500} color="black">
                {!_isNil(data?.invoice_date_time)
                  ? new Date(data?.invoice_date_time).toDateString()
                  : '-'}
              </Text>
            </div>
            <div className="invoice-info-text">
              <Text fontWeight={600}>Invoice Number:</Text>
              <Text fontWeight={500} color="black">
                {data?.order_summary.invoice_no}
              </Text>
            </div>
          </div>
        </div>

        <div className=" w-full flex justify-between p-[2rem] ">
          <div className="customer-info ">
            <div className="customer-info-text">
              <Text fontWeight={600}>Customer Name:</Text>
              <Text fontWeight={500} color="black">
                {data?.customer_name ?? '-'}
              </Text>
            </div>
            <div className="customer-info-text">
              <Text fontWeight={600}>Order Number:</Text>
              <button
                className=" flex items-center gap-2 text-[#4D7AFF] border-b-2 border-[#4D7AFF] "
                onClick={() => setlink(!link)}
              >
                <Text fontWeight={500} color="" className="flex items-center gap-2">
                  {data?.order_summary.boutique_order_id ?? '-'}
                  <MdOutlineInsertLink className="text-[1.2rem] font-bold" />
                  {data?.order_summary.other_reference_id
                    ? data?.order_summary.other_reference_id
                    : 'Link ID'}
                </Text>{' '}
              </button>
            </div>
            <div className="customer-info-text">
              <Text fontWeight={600}>Order Received Date:</Text>
              <Text fontWeight={500} color="black">
                {!_isNil(data?.recieve_date_time)
                  ? new Date(data?.recieve_date_time).toDateString()
                  : '-'}
              </Text>
            </div>
            {/* <div className="customer-info-text">
              <Text fontWeight={600}>Payment Mode:</Text>
              <Text fontWeight={500} color="black">
                {paymentModeOptions.find((option) => option.value === (data?.payment_mode || 1))
                  ?.label ?? '-'}
              </Text>
            </div> */}
            <div className=" w-[100%] mt-[3rem] ">
              <div className="flex items-center gap-2">
                <Text fontWeight={700} size="medium" color="#525252">
                  Transactions
                </Text>
                <img src={transtion} alt="tran" className="size-5" />
              </div>

              {data?.order_summary?.payment_summary_response_list?.map(
                (payment: PaymentSummary, index: number) => (
                  <div key={index} className="w-full ">
                    <div className="w-full flex gap-2 ">
                      <Text fontWeight={600} size="small">
                        {moment(payment.createdAt).format('Do MMM YYYY, h:mm A')}
                      </Text>
                      <div className="flex gap-1">
                        <Text fontWeight={600} size="small" color="#30BC00">
                          ₹ {payment.amount}
                        </Text>
                        <Text fontWeight={600} size="small">
                          received via
                        </Text>
                      </div>
                      <Text fontWeight={600} size="small" color="#323233" className="">
                        {paymentModeOptions.find(
                          (option) => option.value === (payment.paymentMode || 1)
                        )?.label ?? '-'}
                      </Text>
                    </div>
                  </div>
                )
              )}
            </div>
            {/* <div className="w-full flex gap-2 items-center mt-[2rem]">
              <Text fontWeight={600}>Last Updated:</Text>
              <Text fontWeight={600}>26 Jan 2022 / 3:30 Pm</Text>
            </div> */}
          </div>

          <div className="amount-summary-container">
            <div className="outfit-summary-amount-box">
              <Text size="large" fontWeight={600}>
                Order Summary
              </Text>
              <div className="outfit-price-list">
                {data?.order_summary.order_item_summary_list.map((itemObj: any, index: number) => {
                  const total =
                    itemObj?.price_breakup?.reduce(
                      (sum: number, currPriceObj: OrderPriceBreakupType) =>
                        sum + (currPriceObj?.value ?? 0) * currPriceObj.component_quantity,
                      0
                    ) ?? 0;

                  return (
                    <div key={index}>
                      <div className="amount-item">
                        <Text color="black" fontWeight={700}>
                          {itemObj.outfit_alias}
                        </Text>
                        <Text color="black" fontWeight={700}>
                          {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                            total ?? 0
                          )}`}
                        </Text>
                      </div>

                      <div className="price-breakup-list">
                        {itemObj?.price_breakup?.map(
                          (priceObj: OrderPriceBreakupType, index: number) => (
                            <div key={index} className="amount-item">
                              <Text size="small" color="black" fontWeight={500}>
                                {priceObj.component}
                              </Text>
                              <Text size="small" color="black" fontWeight={500}>
                                {priceObj.component === 'Stitching Cost'
                                  ? `${priceObj.component_quantity} x ${priceObj.value} = `
                                  : ` `}
                                {` ${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                                  priceObj.component_quantity * (priceObj?.value ?? 0)
                                )}`}
                              </Text>
                            </div>
                          )
                        )}
                      </div>

                      <Text size="small" fontWeight={500} className="date-field-style">
                        {`Delivery Date: ${new Date(itemObj.delivery_date).toDateString()}`}{' '}
                      </Text>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="amount-box">
              <div className="amount-item">
                <Text color="black" fontWeight={600}>
                  Total:
                </Text>
                <Text color="black" fontWeight={600}>
                  {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                    data?.order_summary?.total_order_amount ?? 0
                  )}`}
                </Text>
              </div>
            </div>

            <div className="amount-box">
              <div className="amount-item">
                <Text color="black" fontWeight={600}>
                  Advance (if any):
                </Text>
                <Text color="black" fontWeight={600}>
                  {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                    data?.order_summary?.order_advance_recieved ?? 0
                  )}`}
                </Text>
              </div>
            </div>

            <div className="amount-box">
              <div className="amount-item">
                <Text color="black" fontWeight={600}>
                  Balance Due:
                </Text>
                <Text fontWeight={600} color="tertiary">
                  {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                    (data?.order_summary?.total_order_amount ?? 0) -
                      (data?.order_summary?.order_advance_recieved ?? 0)
                  )}`}
                </Text>
              </div>
            </div>

            {data?.order_summary?.total_order_amount !==
              data?.order_summary?.order_advance_recieved &&
              orderStatus !== 'Drafted' && (
                <>
                  <div className="advance-amount-box">
                    <Text color="black" fontWeight={600}>
                      Recieve Balance Due
                    </Text>
                    <InputField
                      type="text"
                      required={false}
                      value={recieveAmount}
                      placeholder="0"
                      className="amount-field"
                      regex={positiveNumberRegex}
                      onChange={(value, errorMsg) => handleChange(value, errorMsg)}
                    />
                  </div>
                  <div className="btn-container">
                    <Button onClick={handleConfirmBtn}>Confirm</Button>
                  </div>
                </>
              )}
          </div>
        </div>
        <div className="footer-content">
          <Text size="xxxl" fontWeight={600}>
            Thank You for your business
          </Text>
          <Text fontWeight={600}>Terms and conditions</Text>
          <Text fontWeight={500}>
            *Once confirmed, any advance amount paid towards the order cannot be refunded.
          </Text>
          <Text fontWeight={500}>*Goods once sold will not be taken back.</Text>
          <Text fontWeight={500}>
            *We do not give a guarantee of colors. We advise dry cleaning only.
          </Text>
        </div>
      </InvoiceSummaryContent>

      <Modal
        ref={ref}
        size="medium"
        title="Select mode of payment"
        onModalClose={handleModalClose}
        onModalSuccess={handleModalSave}
      >
        <ModalBody>
          <DropdownField
            label=""
            options={paymentModeOptions}
            value={
              !_isNil(paymentMethod)
                ? { label: paymentMethod.label, value: paymentMethod.value }
                : undefined
            }
            onChange={handleSelectPayment}
            CustomOption={CustomOption}
          />
        </ModalBody>
      </Modal>
      <Modal
        ref={editModalRef}
        size="medium"
        title="Delete Transactions            "
        onModalClose={() => {
          editModalRef.current?.hide();
          void getInvoiceDetails();
        }}
        onModalSuccess={async () => {
          try {
            //const boutique_id = getValueFromLocalStorage('boutique_id');
            // eslint-disable-next-line no-console
            console.log(selectedPaymentIds);
            setIsLoading(true);

            const response = await api.postRequest(`order/${order_id}/delete_payment`, {
              payment_ids: selectedPaymentIds,
            });

            if (response.status) {
              toasts('success', 'Transactions deleted successfully', 'delete-transaction-success');
              void getInvoiceDetails();
              setSelectedPaymentIds([]);
            }
          } catch (err) {
            if (err instanceof Error) {
              toasts('error', err.message, 'delete-transaction-error');
            }
          }
          setIsLoading(false);
          editModalRef.current?.hide();
        }}
      >
        <ModalBody>
          <div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 text-sm font-medium text-muted-foreground">
                <div>Transaction Date</div>
                <div className="flex items-center justify-center">Amount</div>
                <div>Payment Mode</div>
                <div></div>
              </div>
              {data?.order_summary?.payment_summary_response_list.map(
                (payment: PaymentSummary, index: number) => (
                  <div key={index} className="grid grid-cols-4 items-center text-sm">
                    <Text fontWeight={600} size="small">
                      {moment(payment.createdAt).format('Do MMM YYYY, h:mm A')}
                    </Text>
                    <Text
                      fontWeight={600}
                      size="small"
                      color="#30BC00"
                      className="flex items-center justify-center"
                    >
                      ₹ {payment.amount}
                    </Text>
                    <Text fontWeight={600} size="small" className="">
                      {paymentModeOptions.find(
                        (option) => option.value === (payment.paymentMode || 1)
                      )?.label ?? '-'}
                    </Text>
                    <button
                      className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-md border border-slate-300  px-[2px] py-[2.6px] bg-white flex items-center justify-center gap-2 w-[70%]"
                      onClick={() => handleDeleteTransaction(payment.id)}
                    >
                      <MdDeleteOutline /> Delete
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
    </InvoiceSummaryContainer>
  );
};

export default InvoiceSummary;
