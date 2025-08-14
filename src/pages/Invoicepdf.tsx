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
import OutfitSummaryDetails from './Order/OrderList/component/OutfitSummaryDetails/indexc';
import { api } from '../utils/apiRequest';
import { handleDownloadInvoice, getInitailsOfName } from '../utils/common';
import QRCode from 'react-qr-code';
import { useLocation } from 'react-router-dom';

//import print1 from '../assets/icons/print.png';
import icon from '../assets/icons/Vector.png';
import icon1 from '../assets/icons/Vector (1).png';
import icon2 from '../assets/icons/file_download.png';
import icon3 from '../assets/icons/Vector (2).png';

type PaymentSummary = {
  amount: number;
  id: number;
  paymentDate: string;
  paymentMode: number;
  createdAt: string;
};

const Invoicepdf = () => {
  const [data, setData] = useState<Record<string, any>>();

  const [trackingData, setTrackingData] = useState<Record<string, any>>();
  const [currentItemId, setCurrentItemId] = useState(0);
  const [trackingId, setTrackingId] = useState<string>('');
  const [invoiceLink, setInvoiceLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const order_id = trackingData?.invoice?.order_summary?.order_id;
  const location = useLocation();

  const pathSegments = location.pathname.split('/');
  const urlTrackingId = pathSegments[pathSegments.length - 1];
  const searchParams = new URLSearchParams(location.search);
  const isInvoice = searchParams.get('is_invoice') === 'true' || false;
  const [isPrinting, setIsPrinting] = useState(false);
  // eslint-disable-next-line no-console
  //console.log(urlTrackingId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Extract tracking ID from URL path
        //const pathSegments = location.pathname.split('/');
        //const urlTrackingId = pathSegments[pathSegments.length - 1];

        setTrackingId(urlTrackingId);

        if (urlTrackingId) {
          const trackingDetails = await api.getRequest(
            `tracking/track/${urlTrackingId}?is_invoice=${isInvoice}`
          );
          // eslint-disable-next-line no-console
          //console.log(trackingDetails?.data);
          setTrackingData(trackingDetails?.data);
          setData(trackingDetails?.data);
          setCurrentItemId(
            trackingDetails?.data?.invoice?.order_summary?.order_item_summary_list?.[0]?.id
          );

          setData((prevData) => ({
            ...prevData,
            tracking_info: trackingDetails?.data,
          }));
          //await getInvoiceLink();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in data fetching:', error);
      }
    };

    fetchData();
  }, [location, trackingId]);

  useEffect(() => {
    if (order_id && order_id > 0) {
      void getInvoiceLink();
    }
  }, [order_id]);

  const outfitList =
    data?.invoice?.order_summary?.order_item_summary_list?.map(
      (item: { outfit_type: any; id: any; outfit_alias: any }) => ({
        outfit_type: item.outfit_type,
        outfit_type_image_link: '',
        item_id: item.id,
        outfit_alias: item.outfit_alias,
      })
    ) || [];
  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const payload = {
        entityType: 'invoice',
        entityId: data?.invoice?.order_summary?.order_id,
        metaData: {
          boutiqueId: data?.invoice?.boutique_id,
        },
        printerTypeOrdinal: 2,
        copyTypeOrdinal: [2],
      };

      const response = await api.postRequest('order/print_invoice', payload);

      if (response?.status && response?.data?.pdfUrl) {
        window.open(response.data.pdfUrl, '_blank');
      }
    } catch (error) {
      toasts('error', 'Failed to print invoice', 'print-invoice-error');
    } finally {
      setIsPrinting(false);
    }
  };

  // const getTrackingId = async (entityId: number) => {
  //   const response = await api.postRequest('tracking/track', {
  //     entity_id: entityId,
  //     entity_type: 'ORDER',
  //   });

  //   return response?.data;
  // };

  const getInvoiceLink = async () => {
    try {
      const payload = {
        entity_type: 'invoice',
        entity_id: data?.invoice?.order_summary?.order_id,
        copy_type_ordinal: 2,
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
  //console.log(data);

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
    <div className="bg-[#4D7AFF] w-full h-lvh md:py-[2rem] py-[1rem] md:px-[3rem] px-[.2rem] overflow-y-scroll">
      <div className="w-full">
        <img src={logo} alt="logo" className="md:h-[70px] h-[50px] aspect-auto" />
        <p className="font-inter text-[13px] font-semibold italic leading-[15.73px] text-[#FFFFFF] ml-[2rem]">
          Powered by Darzee
        </p>
        <div className="fle hidden  items-center gap-1">
          <Text fontWeight={600}>Tracking ID:</Text>
          <Text fontWeight={500} color="black">
            {trackingId || '-'}
          </Text>
        </div>
      </div>
      <div className="w-full h-fit mt-[.7rem] md:mt-[2rem] flex">
        <div className="md:w-[70%] w-[100%] h-fit bg-white rounded-md md:py-[3rem] py-[1rem] px-[.8rem] md:px-[6rem]">
          <div className="w-full flex items-center justify-between ">
            <p className="font-inter font-[700] text-[#525252]  md:text-[2.5rem] text-[2.2rem]">
              Invoice
            </p>
            <div className="md:hidden flex items-center justify-between gap-4">
              {data?.invoice?.redirect_payment_link && (
                <img onClick={handleUPIPayment} src={upi} alt="" className="h-[28px] aspect-auto" />
              )}
              {isPrinting ? (
                <div className="h-[22px] w-[22px] border-2 border-block border-t-transparent rounded-full animate-spin" />
              ) : (
                <img
                  onClick={handlePrint}
                  src={icon}
                  alt=""
                  className="h-[22px] aspect-auto cursor-pointer"
                />
              )}
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
            <div className="w-[50%] flex flex-col  gap-2 justify-center items-start">
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
                  {data?.invoice?.boutique_address?.city}, {data?.invoice?.boutique_address?.state}{' '}
                  - {data?.invoice?.boutique_address?.postalCode}
                </Text>
                <Text fontWeight={500} color="#32343AB2">
                  {data?.invoice?.boutique_contact ?? 'phone no'}
                </Text>
              </div>
            </div>
            <div className="w-[50%] flex flex-col items-center justify-center gap-3">
              <img src={bg2} alt="bg2" className="h-[80px] aspect-auto hidden" />
              <>
                {!data?.invoice?.boutique_profile_pic_url ? (
                  <div className=" w-20 h-20 text-[1.2rem] font-semibold  flex justify-center items-center rounded-full bg-[rgba(77,122,255,0.2)]">
                    {getInitailsOfName(data?.invoice?.boutique_name).toUpperCase()}
                  </div>
                ) : (
                  <img
                    className="w-20 h-20 flex justify-center items-center rounded-full bg-[rgba(77,122,255,0.2)]"
                    src={data?.invoice?.boutique_profile_pic_url}
                    alt="profile-pic"
                  />
                )}
              </>
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
          <div className="w-full md:h-[70vh] h-full md:overflow-y-scroll flex flex-col md:p-[2rem] p-[.4rem] gap-10">
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
                <div className="w-full fle hidden gap-2 items-center mt-[.6rem]">
                  <Text fontWeight={600}>Last Updated:</Text>
                  <Text fontWeight={600}>26 Jan 2022 / 3:30 Pm</Text>
                </div>
                <div className="w-auto h-auto mt-[2rem]">
                  <p className="font-semibold text-[1.1rem] my-[1rem]">Pay via upi</p>
                  <QRCode
                    size={200}
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
                            <div className="flex items-center justify-between">
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
                                        (priceObj?.component_quantity ?? 0) * (priceObj?.value ?? 0)
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
            <div className="sm:p-[1rem] mb-[1.5rem]">
              <p className=" md:text-3xl text-[1.6rem] font-[600] leading-7 my-[1rem]">
                Thank You for your business
              </p>
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
          {data?.invoice?.redirect_payment_link && (
            <button
              onClick={handleUPIPayment}
              className="bg-white w-[50%] px-4 py-2 font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              Pay via UPI <img src={upi} alt="" className="h-[30px] aspect-auto" />
            </button>
          )}

          <button
            onClick={handlePrint}
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
      {!isInvoice && (
        <div className="w-full h-fit mt-[.7rem] md:mt-[2rem] flex">
          <div className="md:w-[70%] w-[100%] h-fit bg-white rounded-md md:py-[3rem] py-[1rem] px-[.8rem] md:px-[6rem]">
            <div className="w-full flex flex-col md:flex-row justify-between  md:items-center">
              <div>
                <p className="font-inter font-[700] text-[#525252] text-[2.5rem]">Item Details</p>
                <p className="font-inter font-[700] text-[#000000] text-[1.2rem]">
                  {data?.invoice?.boutique_name ?? 'Boutique name'}
                </p>
              </div>
              <div>
                <div className="flex items-center md:justify-start justify-between gap-1">
                  <Text fontWeight={600}>Customer Name:</Text>
                  <Text fontWeight={500} color="black">
                    {data?.invoice?.customer_name ?? '-'}
                  </Text>
                </div>
                <div className="flex items-center md:justify-start justify-between gap-1">
                  <Text fontWeight={600}>Order Number:</Text>
                  <Text fontWeight={500} color="black">
                    {data?.invoice?.order_summary?.boutique_order_id ?? '-'}
                  </Text>
                </div>
              </div>
            </div>
            <OutfitSummaryDetails
              currentItemId={currentItemId}
              orderNumber={data?.invoice?.order_summary?.order_id ?? 0}
              boutiqueOrderId={data?.invoice?.order_summary?.boutique_order_id ?? 0}
              orderStatus={trackingData?.order_status ?? ''}
              outfitList={outfitList}
              setCurrentItemId={setCurrentItemId}
              onOutfitSheetClose={() => setCurrentItemId(0)}
            />
          </div>
          <div className="md:w-[30%] f-fit md:fle hidden flex-col items-center mt-[20%] gap-[1rem]">
            <button
              onClick={handlePrint}
              className="bg-white px-4 w-[50%] py-2 font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2"
            >
              Print <img src={print} alt="" className="h-[25px] aspect-auto" />
            </button>
            <button className="bg-white px-4 py-2 w-[50%] font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2">
              Send Bill <RiWhatsappFill className="text-green-600 text-[1.2rem] cursor-pointer" />
            </button>
            <button className="bg-white px-4 py-2 w-[50%] font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2">
              Download Pdf <BiSolidDownload color="var(--color-primary)" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoicepdf;
