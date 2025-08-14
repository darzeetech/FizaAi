import { FaChevronLeft } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaBirthdayCake } from 'react-icons/fa';
import { PiWhatsappLogoLight } from 'react-icons/pi';
import { MdDeleteOutline } from 'react-icons/md';
import { MdOutlineEmail } from 'react-icons/md';
import { FaPenToSquare } from 'react-icons/fa6';
import { LuMapPin } from 'react-icons/lu';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { GrCircleAlert } from 'react-icons/gr';
import { IoMenu } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import _isNil from 'lodash/isNil';
import { getValueFromLocalStorage } from '../../../utils/common';
import { api } from '../../../utils/apiRequest';
import { toasts } from '../../../ui-component';

import { TbRulerMeasure } from 'react-icons/tb';

//import measurement from '../../../assets/images/Mesurements.png';
import SelectOutfita from 'pages/Order/CreateOrder/components/SelectOutfita';
//import CreateOrder from 'pages/Order/CreateOrder/CreateOrder';

import OrderList from 'pages/Order/OrderList';
import { useDispatch } from 'react-redux';
import { updateOrderDetails } from 'pages/Order/CreateOrder/reducer';

const CustomerOrders = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the order details from Redux
  const { customer_details } = useSelector((state) => state.createOrderReducer);
  // eslint-disable-next-line no-console
  //console.log('check', customer_details);

  const [isLoading, setIsloading] = useState(false);
  const [listData, setListData] = useState(() => {
    try {
      const savedCustomer = localStorage.getItem('currentCustomerDetails');

      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch {
      return null;
    }
  });

  const [ordersswitch, setordersswitch] = useState(true);
  const [measurementswitch, setmeasurementswitch] = useState(false);

  // useEffect(() => {
  //   const getListData = async () => {
  //     const boutique_id = getValueFromLocalStorage('boutique_id');

  //     if (!_isNil(boutique_id)) {
  //       setIsloading(true);

  //       try {
  //         // eslint-disable-next-line no-console
  //         console.log('customer', customer_details);
  //         const response = await api.getRequest(`customers/${customer_details?.customer_id}`);
  //         // eslint-disable-next-line no-console
  //         console.log(response);
  //         const { status, data } = response;

  //         if (status) {
  //           setListData(!_isNil(data) ? data : []);
  //           localStorage.setItem('currentCustomerDetails', JSON.stringify(data));
  //         }
  //       } catch (err) {
  //         if (err instanceof Error) {
  //           toasts('error-cutomer-list');
  //         }
  //       }
  //       setIsloading(true);
  //     } else {
  //       toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
  //     }
  //   };

  //   getListData();
  // }, [customer_details]);

  useEffect(() => {
    const getListData = async () => {
      const boutique_id = getValueFromLocalStorage('boutique_id');
      const customerId = customer_details?.customer_id;

      if (!boutique_id || !customerId) {
        navigate('/customers');

        return;
      }

      setIsloading(true);
      try {
        const response = await api.getRequest(`customers/${customerId}`);
        const { status, data } = response;

        if (status && data) {
          setListData(data);
          localStorage.setItem('currentCustomerDetails', JSON.stringify(data));
        }
      } catch (err) {
        navigate('/customers');
      } finally {
        setIsloading(true);
      }
    };

    getListData();
  }, [customer_details, navigate]);

  const deleteCustomer = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      try {
        const response = await api.deleteRequest(`customers/${customer_details?.customer_id}`);
        const { status } = response;

        if (status) {
          //toasts('success', 'Customer deleted successfully', 'customer-deleted');
          navigate('/customers');
        }
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', 'Failed to delete customer', 'error-customer-delete');
        }
      }
    } else {
      toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
      setpopup(!popup);
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

  useEffect(() => {
    return () => {
      localStorage.removeItem('currentCustomerDetails');
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-scroll pb-[5rem]  ">
      {/* popup */}
      {popup && (
        <div className=" w-full absolute h-screen  bg-[#756f6f98]  flex flex-col  z-[900] cursor-none ">
          <div className="sm:w-[400px] h-[300px] mt-[100px] mx-[30%] bg-white cursor-pointer rounded-md relative flex flex-col items-center  ">
            <RxCross2
              onClick={() => setpopup(!popup)}
              className=" absolute m-[1rem] text-[2rem] right-0"
            />
            <p className="font-inter font-[600] text-[1rem] mt-[30%]">
              Do you really want to delete the customer?
            </p>
            <div onClick={() => setpopup(!popup)}></div>
            <div className="font-inter font-[600] text-[.9rem] flex gap-5 mt-[20%] ">
              <button
                onClick={deleteCustomer}
                className="bg-[#4D7AFF] px-3 py-1 rounded-md text-white"
              >
                Delete
              </button>
              <button
                onClick={() => setpopup(!popup)}
                className="border border-[#000000] px-3 py-1 rounded-md"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
      <div className=" w-full h-[60px] flex items-center justify-between px-[2rem] border-b-2 ">
        <div
          onClick={() => navigate('/customers')}
          className=" font-inter font-[600] text-[1rem]  flex items-center gap-3 cursor-pointer"
        >
          <FaChevronLeft />
          <p>Customer List</p>
        </div>
        <button
          type="submit"
          onClick={() => {
            dispatch(
              updateOrderDetails({
                data: {
                  customer_id: listData?.customer_id,
                  boutique_id: getValueFromLocalStorage('boutique_id'),
                },
              })
            );
            navigate('/select-outfit');
          }}
          className="bg-[#4D7AFF] px-[1.5rem] py-[4px] rounded-md text-white font-[400]"
        >
          Create Order
        </button>
      </div>
      <div className="w-full h-fit flex  justify-between bg-[#F8F8FD] ">
        {isLoading && (
          <div className="w-[30%] h-[500px] p-[1rem] bg-white">
            <div className="w-full h-fit flex gap-2">
              <div className="w-[25%] flex items-center justify-center text-white ">
                <div className="size-[3.5rem] bg-[#3F3F70] rounded-full flex items-center justify-center">
                  <p className="font-inter font-[600] text-[1.2rem]">
                    {listData?.customer_name?.substring(0, 2).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="w-[75%] flex flex-col font-inter ">
                <p className="font-[600] text-[1.2rem] text-[#323232]">
                  {listData?.customer_name || 'Customer Name'}
                </p>
                <p className="font-[500] text-[.95rem] text-[#525252]">
                  {listData?.country_code} {listData?.phone_number}
                </p>
                <p className="font-[500] text-[.95rem] text-[#525252] flex items-center gap-3">
                  <FaBirthdayCake className="text-[#323232]" />
                  {listData?.dob || 'Not Available'}
                </p>
                <div className="flex w-full h-fit items-center gap-3 mt-2">
                  <div
                    onClick={() =>
                      window.open(
                        `https://wa.me/${listData?.country_code}${listData?.phone_number?.replace(
                          /\D/g,
                          ''
                        )}`,
                        '_blank'
                      )
                    }
                    className="size-9 border-2 border-[#00000066] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <PiWhatsappLogoLight className="text-[1.7rem] font-bold" />
                    {/* <img src={whatapp} alt="" className="size-5 font-semibold" /> */}
                  </div>

                  <div
                    onClick={() => (window.location.href = `mailto:${listData?.email}`)}
                    className="size-9 border-2 border-[#00000066] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <MdOutlineEmail className="text-[1.4rem]" />
                  </div>
                  <div
                    onClick={() => setpopup(!popup)}
                    className="size-9 border-2 border-[#00000066] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <MdDeleteOutline className="text-[1.4rem]" />
                  </div>
                  <div
                    onClick={() => navigate('/editcustomer')}
                    className="size-9 border-2 border-[#00000066] rounded-md flex items-center justify-center cursor-pointer"
                  >
                    <FaPenToSquare className="text-[1.2rem] " />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-fit my-[1.2rem] font-inter flex flex-col gap-2">
              <div className="w-full flex items-center text-[#525252]  ">
                <MdOutlineEmail className="w-[20%] size-5 " />
                <p className="w-[80%] font-[500] text-[.95rem]">
                  {listData?.email || 'Email not available'}
                </p>
              </div>
              <div className="w-full flex items-center text-[#525252]">
                <LuMapPin className="w-[20%] size-6  flex items-start" />
                <div className="w-[80%]">
                  <p className="w-full font-[500] leading-5 text-[.95rem]">
                    {listData?.address?.address_line2}
                  </p>
                  <p className="w-full font-[500] leading-5 text-[.95rem]">
                    {listData?.address?.address_line1 || 'Address not available'}
                  </p>
                </div>
              </div>
              <div className="w-full h-fit flex items-center justify-between flex-wrap font-inter my-[1rem] ">
                <div className="w-[32%] h-fit flex flex-col items-center">
                  <div className="flex gap-1.5 items-center">
                    <GrCircleAlert className="text-[#E47005]" />
                    <p className="font-[500] text-[.8rem]">Pending</p>
                  </div>
                  <ruppes className="text-[#E47005] font-[500] text-[.9rem]">
                    ₹ {listData?.total_pending_amount || '0'}
                  </ruppes>
                </div>
                <div className="w-[33%] h-fit flex flex-col items-center">
                  <div className="flex gap-1.5 items-center">
                    <FaArrowTrendUp className="text-[#0DA74C]" />
                    <p className="font-[500] text-[.8rem]">Revenue</p>
                  </div>
                  <ruppes className="text-[#0DA74C] font-[500] text-[.9rem]">
                    ₹ {listData?.revenue || '0'}
                  </ruppes>
                </div>
                <div className="w-[32%] h-fit flex flex-col items-center">
                  <div className="flex gap-1.5 items-center">
                    <MdOutlineShoppingCart className="text-[#1A52F5]" />
                    <p className="font-[500] text-[.8rem]">Orders</p>
                  </div>
                  <ruppes className="text-[#1A52F5] font-[500] text-[.9rem]">
                    {listData?.orders_count || '0'}
                  </ruppes>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-[68%] h-[500px] bg-white p-[1rem]">
          <div className="flex gap-4 font-inter font-[700] text-[.9rem] ">
            <button
              onClick={() => {
                setmeasurementswitch(false);
                setordersswitch(true);
              }}
              className={`rounded-md flex items-center gap-1 ${
                measurementswitch
                  ? 'border-2 border-[#32323266] px-3 py-1 text-black'
                  : 'border-2 border-[#4D7AFF] px-3 py-1 text-[#4D7AFF]'
              }`}
            >
              <IoMenu className={`text-[1.5rem] font-bold  `} />
              Orders
            </button>
            <button
              onClick={() => {
                setmeasurementswitch(true);
                setordersswitch(false);
              }}
              className={`rounded-md flex items-center gap-1 ${
                measurementswitch
                  ? 'border-2 border-[#4D7AFF] px-3 py-1 text-[#4D7AFF]'
                  : 'border-2 border-[#32323266] px-3 py-1 text-black'
              }`}
            >
              <TbRulerMeasure className={`text-[1.3rem] font-bold  -rotate-45  `} />
              Measurements
            </button>
          </div>
          <div className="text-black w-full h-fit">
            {ordersswitch && <OrderList />}

            {measurementswitch && <SelectOutfita />}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CustomerOrders;
