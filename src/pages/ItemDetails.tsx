import logo from '../assets/images/logo darzee 4.png';

import { useState, useEffect } from 'react';
//import _isNil from 'lodash/isNil';

import { RiWhatsappFill } from 'react-icons/ri';
import print from '../assets/images/print.png';
import { BiSolidDownload } from 'react-icons/bi';
import { Text } from '../ui-component';
import { api } from '../utils/apiRequest';
import OutfitSummaryDetails from './Order/OrderList/component/OutfitSummaryDetails/indexc';

const ItemDetails = () => {
  const [data1, setData] = useState<Record<string, any>>();

  // Add these state variables
  const [currentItemId, setCurrentItemId] = useState(0);
  const [trackingId] = useState<string>(() => {
    const pathSegments = location.pathname.split('/');

    return pathSegments[pathSegments.length - 1];
  });

  // useEffect(() => {
  //   const fetchTrackingId = async () => {
  //     const trackingData = await getTrackingId(2964); // Replace with actual entity_id
  //     setTrackingId(trackingData.tracking_id);
  //   };

  //   fetchTrackingId();
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (trackingId) {
          const trackingDetails = await api.getRequest(
            `tracking/track/${trackingId}?is_invoice=false`
          );
          setData(trackingDetails?.data);
          setCurrentItemId(data1?.order_item_details_list[0]?.id);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error in data fetching:', error);
      }
    };

    fetchData();
  }, [location, currentItemId, trackingId]);

  // Create outfitList array with required data structure
  const outfitList =
    data1?.invoice?.order_summary?.order_item_summary_list?.map(
      (item: { outfit_type: any; id: any; outfit_alias: any }) => ({
        outfit_type: item.outfit_type,
        outfit_type_image_link: '', // Add image link if available
        item_id: item.id,
        outfit_alias: item.outfit_alias,
      })
    ) || [];

  // const getTrackingId = async (entityId: number) => {
  //   const response = await api.postRequest('tracking/track', {
  //     entity_id: entityId,
  //     entity_type: 'ORDER_ITEM',
  //   });

  //   return response.data;
  // };

  // eslint-disable-next-line no-console
  console.log(data1);

  // eslint-disable-next-line no-console
  //console.log(data1?.order_item_details_list[0]?.customer_details?.customer_name);

  return (
    <div className="bg-[#4D7AFF] w-full h-lvh md:py-[2rem] py-[1rem] md:px-[3rem] px-[.2rem]  overflow-y-scroll  ">
      <div className="w-full">
        <img src={logo} alt="logo" className="md:h-[70px] h-[50px] aspect-auto" />
        <p className="font-inter text-[13px] font-semibold italic leading-[15.73px] text-[#FFFFFF] ml-[2rem]">
          Powered by Darzee
        </p>
        <div className="fle hidden items-center gap-1">
          <Text fontWeight={600}>Tracking ID:</Text>
          <Text fontWeight={500} color="black">
            {trackingId || '-'}
          </Text>
        </div>
      </div>

      <div className="w-full h-fit mt-[.7rem] md:mt-[2rem] flex">
        <div className="md:w-[80%] w-[100%] h-fit bg-white rounded-md md:py-[3rem] py-[1rem] px-[.8rem] md:px-[6rem] ">
          <div className="w-full flex md:flex-row flex-col justify-between md:items-center">
            <div className="md:w-[75%] w-full">
              <p className="font-inter font-[700] text-[#525252] text-[2.5rem]  ">Item Details</p>
              <p className="font-inter font-[700] text-[#000000] text-[1.2rem]">
                {data1?.invoice?.boutique_name}
              </p>
            </div>
            <div className="md:w-[25%] w-full py-3">
              <div className="flex items-center md:justify-start justify-between gap-1">
                <Text fontWeight={600}>Customer Name:</Text>
                <Text fontWeight={500} color="black">
                  {data1?.order_item_details_list[0]?.customer_details?.customer_name ?? '-'}
                </Text>
              </div>
              <div className="flex items-center md:justify-start justify-between gap-1">
                <Text fontWeight={600}>Order Number:</Text>
                <Text fontWeight={500} color="black">
                  {data1?.order_item_details_list[0]?.boutique_order_id ?? '0'}
                </Text>
              </div>
            </div>
          </div>
          <OutfitSummaryDetails
            currentItemId={currentItemId}
            orderNumber={data1?.invoice?.order_summary?.order_id}
            boutiqueOrderId={data1?.invoice?.order_summary?.boutique_order_id}
            orderStatus={data1?.invoice?.order_status || ''}
            outfitList={outfitList}
            setCurrentItemId={setCurrentItemId}
            onOutfitSheetClose={() => {
              // Handle sheet close
              setCurrentItemId(0);
            }}
          />
        </div>
        <div className="md:w-[30%] f-fit md:fle hidden flex-col items-center mt-[20%] gap-[1rem]">
          <button className="bg-white px-4 w-[50%] py-2 font-inter font-[700] text-[1rem] text-[#4D7AFF] rounded-md flex items-center justify-center gap-2">
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
    </div>
  );
};
export default ItemDetails;
