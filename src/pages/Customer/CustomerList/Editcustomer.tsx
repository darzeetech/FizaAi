import { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import { api } from '../../../utils/apiRequest';
import 'react-phone-number-input/style.css';
import { getValueFromLocalStorage } from '../../../utils/common';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';
import { toasts, Modal, ModalMethods, Text } from '../../../ui-component';

import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';
import { useRef } from 'react';

import { BsPerson } from 'react-icons/bs';
import { MdOutlineLocalPhone } from 'react-icons/md';
import { CgMail } from 'react-icons/cg';
import { FaBirthdayCake } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FaMapMarkerAlt } from 'react-icons/fa';

import { parsePhoneNumberFromString } from 'libphonenumber-js';

//import { useLocation } from 'react-router-dom';

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  lat: string;
  lon: string;
  postal_code: string;
}

interface FormData {
  age: string;
  phone_number: string;
  country_code: string;
  customer_name: string;
  gender: string;
  customer_image_reference_id: string;
  boutique_id: string;
  email: string;
  dob: string;
  address: Address;
}

export default function Editcustomer() {
  //const location = useLocation();
  const { customer_details } = useSelector((state: any) => state.createOrderReducer);
  const [isLoading, setIsloading] = useState(false);
  const [listData, setListData] = useState<FormData | null>(null);

  // Use location state data if available, otherwise fall back to Redux store data
  //const customerData = location?.state?.customerData || customer_details;

  useEffect(() => {
    const getListData = async () => {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      if (!_isNil(boutique_id)) {
        setIsloading(true);

        try {
          const response = await api.getRequest(`customers/${customer_details?.customer_id}`);

          const { status, data } = response;

          if (status) {
            setListData(!_isNil(data) ? data : []);
          }
        } catch (err) {
          if (err instanceof Error) {
            toasts('error', 'Failed to fetch customer list', 'error-customer-list');
          }
        }
        setIsloading(false);
      } else {
        toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
      }
    };
    getListData();
  }, [customer_details]);
  // eslint-disable-next-line no-console
  console.log('Data being passed:', listData);
  const genderOptions = [
    { value: 'MALE', label: 'Male' },
    { value: 'FEMALE', label: 'Female' },
    { value: 'OTHER', label: 'Other' },
  ];
  const initialFormData: FormData = {
    age: listData?.age?.toString() || '',
    phone_number: listData?.phone_number || '',
    country_code: listData?.country_code || '',
    customer_name: listData?.customer_name || '',
    gender: listData?.gender?.toUpperCase() || '',
    customer_image_reference_id: '',
    boutique_id: '',
    email: listData?.email || '',
    dob: listData?.dob || '',
    address: {
      id: listData?.address?.id?.toString() || '',
      address_line1: listData?.address?.address_line1 || '',
      address_line2: listData?.address?.address_line2 || '',
      city: listData?.address?.city || '',
      state: listData?.address?.state || '',
      country: listData?.address?.country || '',
      lat: listData?.address?.lat || '',
      lon: listData?.address?.lon || '',
      postal_code: listData?.address?.postal_code || '',
    },
  };
  // Add a new useEffect to update formData when listData changes
  useEffect(() => {
    if (listData) {
      setFormData({
        age: listData?.age?.toString() || '',
        phone_number: listData?.phone_number || '',
        country_code: listData?.country_code || '',
        customer_name: listData?.customer_name || '',
        gender: listData?.gender?.toUpperCase() || '',
        customer_image_reference_id: '',
        boutique_id: '',
        email: listData?.email || '',
        dob: listData?.dob || '',
        address: {
          id: listData?.address?.id?.toString() || '',
          address_line1: listData?.address?.address_line1 || '',
          address_line2: listData?.address?.address_line2 || '',
          city: listData?.address?.city || '',
          state: listData?.address?.state || '',
          country: listData?.address?.country || '',
          lat: listData?.address?.lat || '',
          lon: listData?.address?.lon || '',
          postal_code: listData?.address?.postal_code || '',
        },
      });
    }
  }, [listData]);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  // eslint-disable-next-line no-console
  //console.log(formData);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'radio' ? value : (e.target as HTMLInputElement).value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
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
          phone_number: phoneNumber,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        country_code: '',
        phone_number: '',
      }));
    }
  };

  const onModalSuccess = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isUndefined(formData) && !_isNil(boutique_id)) {
      const formattedData = {
        ...formData,
        name: formData.customer_name,
        gender: formData.gender.toLowerCase(),
        age: +formData.age,
        boutique_id,
        phone_number: formData.phone_number || null,
      };

      try {
        setIsloading(true);
        // eslint-disable-next-line no-console
        // console.log(formattedData);

        const response = await api.putRequest(
          `customers/${customer_details?.customer_id}`,
          formattedData
        );

        const { status } = response;

        if (status) {
          navigate('/customers');
        }
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', err.message, 'create-customer-error');
        }
      }

      setIsloading(false);
    }
  };

  const libraries: 'places'[] = ['places'];

  const inputref = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB35wnM9wsXAVK_4grcu9tU0T2Eg5Fy75k',
    libraries: libraries,
  });

  // eslint-disable-next-line no-console
  //console.log(isLoaded);
  const handleOnPlacesChanged = () => {
    if (inputref.current) {
      const places = inputref.current.getPlaces();

      if (places && places.length > 0) {
        const selectedPlace = places[0];
        // eslint-disable-next-line no-console
        //console.log('Selected address:', selectedPlace);
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            address_line1: selectedPlace.formatted_address || '',
            city:
              selectedPlace.address_components?.find((c) => c.types.includes('locality'))
                ?.long_name || '',
            state:
              selectedPlace.address_components?.find((c) =>
                c.types.includes('administrative_area_level_1')
              )?.long_name || '',
            country:
              selectedPlace.address_components?.find((c) => c.types.includes('country'))
                ?.long_name || '',
            postal_code:
              selectedPlace.address_components?.find((c) => c.types.includes('postal_code'))
                ?.long_name || '',
            lat: String(selectedPlace.geometry?.location?.lat() || ''),
            lon: String(selectedPlace.geometry?.location?.lng() || ''),
          },
        }));
      }
    }
  };

  const closeModalRef = useRef<ModalMethods>(null);

  const handleModalClose = () => {
    closeModalRef.current?.hide();
    navigate('/customers');
  };

  const handleModalSuccess = async () => {
    await onModalSuccess();
    closeModalRef.current?.hide();
    navigate('/customers');
  };

  return (
    <div className="w-full h-screen overflow-scroll pb-[5rem]  ">
      <div className=" w-full h-[60px] flex items-center justify-between px-[2rem] border-b-2 ">
        <div
          onClick={() => closeModalRef.current?.show()}
          className=" font-inter font-[600] text-[1rem]  flex items-center gap-3 cursor-pointer"
        >
          <FaChevronLeft />
          <p>Add Customer</p>
        </div>
        <button
          onClick={onModalSuccess}
          type="submit"
          className="bg-[#4D7AFF] px-[1.5rem] py-[4px]  rounded-md text-white font-[400]"
        >
          Save
        </button>
      </div>
      {!isLoading && (
        <form onSubmit={onModalSuccess} className="w-[70%]  flex gap-8 mt-[1rem] ml-[2rem] p-4 ">
          <div className="w-[50%] flex flex-col h-fit gap-4  ">
            <div className="w-full">
              <label
                htmlFor="name"
                className="font-inter text-[.9rem] font-[600] text-[#323232] flex items-center gap-3"
              >
                <BsPerson className="text-[1.1rem] font-semibold" />
                Full Name*
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="phone_number"
                className="font-inter text-[.9rem] font-[600] text-[#323232] flex items-center gap-3"
              >
                <MdOutlineLocalPhone className="text-[1.1rem] font-semibold" /> Phone Number
              </label>
              <PhoneInput
                defaultCountry="IN"
                value={`${formData.country_code}${formData.phone_number}`}
                onChange={handlePhoneChange}
                international
                countryCallingCodeEditable={false}
                className="w-full h-12   rounded-md border-1 border-gray-300  "
                inputStyle={{
                  width: '100%',
                  height: '100%',
                  fontSize: '1.3rem',
                  border: '1px solid black',
                  Background: '#3b36360a',
                }}
                buttonStyle={{ background: '#3b36360a', border: '1px solid black' }}
                dropdownStyle={{ width: '350px' }}
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="email"
                className="font-inter text-[.9rem] font-[600] text-[#323232] flex items-center gap-3"
              >
                <CgMail className="text-[1.1rem] font-semibold" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              />
            </div>
            <div className="w-full">
              <label
                htmlFor="dob"
                className="font-inter text-[.9rem] font-[600] text-[#323232] flex items-center gap-3"
              >
                <FaBirthdayCake className="text-[1.1rem] font-semibold" /> Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
              />
            </div>
            <div className="w-full">
              <label className="font-inter text-[.9rem] font-[600] text-[#323232]">Gender</label>
              <div className="mt-2 space-y-2 flex gap-4  items-baseline">
                {genderOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`gender-${option.value.toLowerCase()}`}
                      name="gender"
                      type="radio"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleChange}
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                    />
                    <label
                      htmlFor={`gender-${option.value.toLowerCase()}`}
                      className="ml-3 block text-[.9rem] font-medium text-gray-700"
                    >
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-[50%] flex flex-col h-fit ">
            <div className="w-full h-fit flex flex-col  gap-4 ">
              <div>
                <h2 className="font-inter text-[.9rem] font-[600] text-[#323232] flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[1.1rem] font-semibold" /> Address Information
                </h2>
                <input
                  type="text"
                  id="address_line2"
                  name="address_line2"
                  placeholder="House Number/ Landmark"
                  value={formData.address.address_line2}
                  onChange={handleAddressChange}
                  className=" mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
                />
              </div>
              <div className="w-full ">
                <div className="w-full relative h-fit items-center  ">
                  <FcGoogle className=" absolute right-4 text-[1.5rem] mt-4 bg-[#fbf6f6] my-[1rem] " />
                  {isLoaded && (
                    <StandaloneSearchBox
                      onLoad={(ref) => (inputref.current = ref)}
                      onPlacesChanged={handleOnPlacesChanged}
                    >
                      <input
                        type="text"
                        placeholder="Search Address"
                        className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
                      />
                    </StandaloneSearchBox>
                  )}
                </div>
              </div>

              <div className="w-full h-fit flex items-center gap-6 mt-4">
                <div className="w-[50%]">
                  <label
                    htmlFor="city"
                    className="font-inter text-[.9rem] font-[600] text-[#323232]"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
                  />
                </div>
                <div className="w-[50%]">
                  <label
                    htmlFor="state"
                    className="font-inter text-[.9rem] font-[600] text-[#323232]"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
                  />
                </div>
              </div>

              <div className="w-[48%] ">
                <label
                  htmlFor="postal_code"
                  className="font-inter text-[.9rem] font-[600] text-[#323232]"
                >
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={formData.address.postal_code}
                  onChange={handleAddressChange}
                  className="mt-1.5  w-full rounded-md border-2 border-[#32343A1A] shadow-sm bg-[#3b36360a] focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-3 py-2"
                />
              </div>
            </div>
          </div>
        </form>
      )}
      <Modal
        ref={closeModalRef}
        size="small"
        saveButtonText="Save"
        closeButtonText="Go back without saving"
        showCloseIcon={true}
        onModalClose={handleModalClose}
        onModalSuccess={handleModalSuccess}
      >
        <div className="p-4">
          <Text color="black" fontWeight={700}>
            Do you want to save your changes?
          </Text>
        </div>
      </Modal>
    </div>
  );
}
