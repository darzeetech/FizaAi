import { FaChevronLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { InputField, BulkImageUploadField, RadioField } from '../../components/FormComponents';
//import type { RootState } from '../../store';
import ProfilePicUpload from './components/ProfilePicUpload';
import { TAILOR_OPTIONS } from './contant';
import { AiOutlineShop } from 'react-icons/ai';
import { MdOutlinePerson2 } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { getValueFromLocalStorage } from '../../utils/common';
import _isNil from 'lodash/isNil';
//import _isUndefined from 'lodash/isUndefined';
import { toasts, Loader } from '../../ui-component';
import { api } from '../../utils/apiRequest';
import { updateBoutiqueData } from './reducer';
import { ImageObjType } from '../../../src/components/FormComponents';

interface FormData {
  boutique_type: string;
  boutique_name: string;
  tailor_count: number;
  boutique_image_reference_id: Record<string, string>[];
  include_gst_in_price: boolean;
  include_delivery_date: boolean;
  gst_number: any;
  boutique_phone_number: number;
  upi_id: string;
  admin_tailor_name?: string;
  admin_tailor_profile_pic_url?: string;
  admin_tailor_ref_id?: string;
  shop_images_ref_id: string[];
  shop_image_urls: string[];
  boutique_address: {
    state: string;
    city: string;
    postal_code: string;
    country: string;
    address_line1: string;
    address_line2: string;
  };
  tailor: {
    tailor_name: string;
    language: string;
    tailor_profile_pic_reference_id: ImageObjType;
  };
  boutique_terms_and_condition: {
    condition1: string;
    condition2: string;
    condition3: string;
  };
}

const UpdateProfile = () => {
  const dispatch = useDispatch();
  //const { onboardingReducer } = useSelector((state: RootState) => state);
  //const { boutiqueData } = onboardingReducer;

  const [isLoading, setIsLoading] = useState(false);
  const [listData, setListData] = useState<FormData | null>(null);

  useEffect(() => {
    const getListData = async () => {
      const boutique_id = getValueFromLocalStorage('boutique_id');

      if (!_isNil(boutique_id)) {
        setIsLoading(true);
        try {
          const response = await api.getRequest(`boutique/${boutique_id}`);
          const { status, data } = response;

          if (status) {
            setListData(!_isNil(data) ? data : null);
          }
        } catch (err) {
          if (err instanceof Error) {
            toasts('error', 'Failed to fetch boutique data', 'error-boutique-data');
          }
        }
        setIsLoading(false);
      } else {
        toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
      }
    };
    getListData();
  }, []);
  // eslint-disable-next-line no-console
  // console.log('Data being passed:', listData);

  //const { profileData } = onboardingReducer;
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    boutique_type: '',
    boutique_name: '',
    tailor_count: 0,
    boutique_image_reference_id: [],
    include_gst_in_price: false,
    include_delivery_date: false,
    gst_number: null,
    boutique_phone_number: 0,
    upi_id: '',
    shop_images_ref_id: [],
    shop_image_urls: [],
    boutique_address: {
      state: '',
      city: '',
      postal_code: '',
      country: '',
      address_line1: '',
      address_line2: '',
    },
    tailor: {
      tailor_name: '',
      language: '',
      tailor_profile_pic_reference_id: {},
    },
    boutique_terms_and_condition: {
      condition1: '',
      condition2: '',
      condition3: '',
    },
  });

  useEffect(() => {
    if (listData) {
      setFormData({
        boutique_type: String(listData.boutique_type) || '',
        boutique_name: listData.boutique_name || '',
        tailor_count: listData.tailor_count || 0,
        boutique_image_reference_id:
          listData.shop_image_urls?.map((url, index) => ({
            url: url,
            reference_id: listData.shop_images_ref_id[index],
            short_lived_url: url,
          })) || [],
        shop_images_ref_id: listData.shop_images_ref_id || [],
        shop_image_urls: listData.shop_image_urls || [],
        include_gst_in_price: listData.include_gst_in_price || false,
        include_delivery_date: listData.include_delivery_date || false,
        gst_number: null,
        boutique_phone_number: listData.boutique_phone_number || 0,
        upi_id: listData.upi_id || '',
        boutique_address: {
          state: listData.boutique_address?.state || '',
          city: listData.boutique_address?.city || '',
          postal_code: listData.boutique_address?.postal_code || '',
          country: listData.boutique_address?.country || '',
          address_line1: listData.boutique_address?.address_line1 || '',
          address_line2: listData.boutique_address?.address_line2 || '',
        },
        tailor: {
          tailor_name: listData.admin_tailor_name || '',
          language: listData.tailor?.language || '',
          tailor_profile_pic_reference_id: {
            url: listData.admin_tailor_profile_pic_url || '',
            reference_id: listData.admin_tailor_ref_id || '',
            short_lived_url: listData.admin_tailor_profile_pic_url || '',
          },
        },
        boutique_terms_and_condition: {
          condition1: listData.boutique_terms_and_condition?.condition1 || '',
          condition2: listData.boutique_terms_and_condition?.condition2 || '',
          condition3: listData.boutique_terms_and_condition?.condition3 || '',
        },
      });
    }
  }, [listData]);

  const handleChange = (value: any, key: string) => {
    setFormData((prev) => {
      const keys = key.split('.');

      return keys.length === 1
        ? { ...prev, [key]: value }
        : {
            ...prev,
            [keys[0]]: {
              ...(prev[keys[0] as keyof FormData] as Record<string, any>),
              [keys[1]]: value,
            },
          };
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!boutique_id) {
      toasts('error', 'Boutique ID not found', 'boutique-id-missing');

      return false; // Prevent form submission
    }

    try {
      setIsLoading(true);
      const formattedData = {
        ...formData,
        boutique_id,
        shop_images_ref_id: formData.boutique_image_reference_id.map(
          (img) => img.reference_id || img.url
        ),
        shop_image_urls: formData.boutique_image_reference_id.map((img) => img.url),
        boutique_image_reference_id: formData.boutique_image_reference_id.map(
          (img) => img.reference_id || img.url
        ),
        tailor: {
          ...formData.tailor,
          tailor_profile_pic_reference_id:
            formData.tailor.tailor_profile_pic_reference_id.reference_id ||
            formData.tailor.tailor_profile_pic_reference_id.url ||
            '',
        },
        boutique_terms_and_condition: {
          condition1: formData.boutique_terms_and_condition.condition1,
          condition2: formData.boutique_terms_and_condition.condition2,
          condition3: formData.boutique_terms_and_condition.condition3,
        },
      };

      const response = await api.putRequest(`boutique/${boutique_id}`, formattedData);

      if (response.status) {
        dispatch(updateBoutiqueData({ boutiqueData: response.data }));
        toasts('success', 'Profile updated successfully', 'profile-update-success');
        window.location.reload(); // Execute reload first
      }

      return false; // Prevent form submission
    } catch (err) {
      toasts('error', err instanceof Error ? err.message : 'Update failed', 'update-profile-error');
    } finally {
      setIsLoading(false);
      //navigate(-1);
    }

    return false; // Prevent form submission
  };

  return (
    <div className="w-full h-screen overflow-scroll pb-[5rem] relative">
      <form onSubmit={handleSubmit}>
        <div className="w-full h-[50px] flex items-center justify-between px-[2rem] border-b-2">
          <div
            onClick={() => navigate(-1)}
            className="font-inter font-[600] text-[1rem] flex items-center gap-3 cursor-pointer"
          >
            <FaChevronLeft />
            <p>Edit Profile</p>
          </div>
          <button
            type="submit"
            className="bg-[#4D7AFF] px-[1.5rem] py-[4px] rounded-md text-white font-[400]"
          >
            Save
          </button>
        </div>

        <div className="p-6 flex flex-col gap-3 w-[60%] ml-[1rem]">
          <ProfilePicUpload
            value={formData.tailor.tailor_profile_pic_reference_id}
            onChange={(value: ImageObjType) =>
              handleChange(value, 'tailor.tailor_profile_pic_reference_id')
            }
          />

          <div className="w-[70%] flex flex-col gap-2">
            <p className="flex items-center gap-2 font-inter font-[600] text-[.8rem]">
              <AiOutlineShop className="text-[1.1rem]" />
              Boutique Name*
            </p>
            <InputField
              label=""
              placeholder="Enter Your Shop Name"
              type="text"
              required={true}
              value={formData.boutique_name}
              onChange={(value) => handleChange(value, 'boutique_name')}
            />
          </div>

          <div className="w-[70%] flex flex-col gap-2">
            <p className="flex items-center gap-2 font-inter font-[600] text-[.8rem]">
              <MdOutlinePerson2 className="text-[1.1rem]" />
              Full Name*
            </p>
            <InputField
              label=""
              placeholder="Enter Your Full Name"
              type="text"
              required={true}
              value={formData.tailor.tailor_name}
              onChange={(value) => handleChange(value, 'tailor.tailor_name')}
            />
          </div>

          <RadioField
            label="Type of Tailor"
            type="radio"
            required={true}
            value={formData.boutique_type}
            options={TAILOR_OPTIONS}
            onChange={(value) => handleChange(value, 'boutique_type')}
          />

          <BulkImageUploadField
            label="Upload Shop Picture"
            placeholder="Upload Shop Picture"
            type="file"
            required={false}
            multiple={true}
            maxUpload={3}
            fileTypeRequired={false}
            value={formData.boutique_image_reference_id}
            onChange={(value) => handleChange(value, 'boutique_image_reference_id')}
          />
        </div>
      </form>
      {<Loader showLoader={isLoading} />}
    </div>
  );
};

export default UpdateProfile;
