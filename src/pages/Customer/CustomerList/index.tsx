import { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';
import debounce from 'lodash/debounce';

import { api } from '../../../utils/apiRequest';
import {
  getValueFromLocalStorage,
  setDataAtKeyInNestedObject,
  validateDataBasedOnConfig,
  convertObjectToQueryString,
  convertUrlStringToObject,
} from '../../../utils/common';
import { updateCustomerDetails } from '../../Order/CreateOrder/reducer';
import { PlusIcon } from '../../../assets/icons';
import {
  Button,
  Loader,
  Modal,
  ModalMethods,
  Text,
  toasts,
  PaginationInfoType,
} from '../../../ui-component';

import { CustomerDetailsErrorType, CustomerDetailsType, listDataType } from '../types';

import Details from './components/Details';
import Card from './components/Card';

import { Container, ContentContainer, Header, ListContainer } from './style';
import { validateCustomerDetailsObject } from './constant';
import { FaSearch } from 'react-icons/fa';

// Add pagination constants
const pageSize = 20;
const defaultPaginationObj: PaginationInfoType = {
  currentPage: 1,
  pageCount: 1,
};

const CustomerList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createCustomerRef = useRef<ModalMethods>(null);

  const [listData, setListData] = useState<listDataType[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfoType>(defaultPaginationObj);
  const [urlQueryParams, setUrlQueryParams] = useState<Record<string, any>>({});
  const [totalCustomers, setTotalCustomers] = useState<number>(0);

  const [data, setData] = useState<CustomerDetailsType>();
  const [errorData, setErrorData] = useState<CustomerDetailsErrorType>();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle URL query parameters
  useEffect(() => {
    setUrlQueryParams(convertUrlStringToObject(location.search));
  }, [location.search]);

  // Handle pagination from URL
  useEffect(() => {
    if ('pageNo' in urlQueryParams) {
      setPaginationInfo((prev) => ({
        ...prev,
        currentPage: parseInt(urlQueryParams['pageNo']) || 1,
      }));
    }
  }, [JSON.stringify(urlQueryParams)]);

  useEffect(() => {
    void debouncedGetListData();
  }, [paginationInfo.currentPage]);

  const getListData = async (
    searchQuery?: string,
    currentPaginationInfo: PaginationInfoType = paginationInfo,
    size = pageSize
  ) => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      setIsloading(true);

      try {
        let response: {
          status: any;
          data: {
            customer_details: never[];
            boutique_customer_details: any;
            total_records_count: any;
            count: number;
          };
        };
        const pageCount = currentPaginationInfo.currentPage;

        if (searchQuery && searchQuery.length > 0) {
          response = await api.postRequest('search', {
            boutique_id: boutique_id,
            target_entity: 'customer',
            search_key: searchQuery,
          });

          if (response.status) {
            const customerData = response.data.customer_details || [];
            setListData(customerData);
            setTotalCustomers(customerData.length);
            setPaginationInfo({
              currentPage: 1,
              pageCount: getTotalPageCount(customerData.length, pageSize),
            });
          }
        } else {
          response = await api.getRequest(
            `customers/?boutique_id=${boutique_id}&sort=asc&page_count=${pageCount}&count=${size}`
          );

          if (response.status) {
            const customerData = !_isNil(response.data.boutique_customer_details)
              ? response.data.boutique_customer_details
              : [];

            // Use the count field from API response for total customers
            const totalCount = response.data.count || response.data.total_records_count || 0;

            setListData(customerData);
            setTotalCustomers(totalCount);
            setPaginationInfo((prev) => ({
              ...prev,
              pageCount: getTotalPageCount(totalCount, pageSize),
            }));
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', err.message, 'error-cutomer-list');
        }
        setListData([]);
        setTotalCustomers(0);
      }
      setIsloading(false);
    } else {
      toasts('info', 'Boutique Not Exist', 'boutique-not-exists');
    }
  };

  const debouncedGetListData = useCallback(
    debounce((...args) => {
      void getListData(...args);
    }, 500),
    [paginationInfo]
  );

  const getTotalPageCount = (totalRecords: number, pageSize: number) => {
    if (totalRecords === 0) {
      return 1;
    }

    return Math.ceil(totalRecords / pageSize);
  };

  const handlePageChange = (pageNumber: number) => {
    if (
      pageNumber !== paginationInfo.currentPage &&
      pageNumber > 0 &&
      pageNumber <= paginationInfo.pageCount
    ) {
      const queryString = convertObjectToQueryString({
        ...urlQueryParams,
        pageNo: pageNumber,
      });

      if (location.pathname.includes('select-customer')) {
        navigate(`/select-customer?${queryString}`);
      } else if (location.pathname.includes('customers')) {
        navigate(`/customers?${queryString}`);
      }
    }
  };

  const handleCardClick = (selectedCustomer: listDataType) => {
    if (location.pathname.includes('select-customer')) {
      dispatch(updateCustomerDetails({ data: selectedCustomer }));
      navigate(`/select-outfit`);
    }

    if (location.pathname.includes('customers')) {
      dispatch(updateCustomerDetails({ data: selectedCustomer }));
      // console.log('customer', selectedCustomer);
      navigate(`/selectcustomer`);
    }
  };

  const onModalSuccess = async () => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    const { isValid, errorData } = validateDataBasedOnConfig(validateCustomerDetailsObject, {
      ...data,
      boutique_id,
    });

    if (!isValid) {
      setErrorData(errorData as CustomerDetailsErrorType);
    }

    if (!_isUndefined(data) && !_isNil(boutique_id) && isValid) {
      const { customer_image_urls, ...rest } = data;

      const formattedData = {
        ...rest,
        age: +rest.age,
        phone_number: +rest.phone_number,
        customer_image_reference_id: customer_image_urls?.reference_id ?? '',
        boutique_id,
      };

      try {
        setIsloading(true);

        const response = await api.postRequest('customers/', formattedData);

        const { status } = response;

        if (status) {
          resetForm();
          createCustomerRef.current?.hide();
          void getListData(undefined, paginationInfo);
        }
      } catch (err) {
        if (err instanceof Error) {
          toasts('error', err.message, 'create-customer-error');
        }
      }

      setIsloading(false);
    }
  };

  const handleChange = (objList: Array<{ value: any; key: string }>) => {
    let updatedData = structuredClone(data);

    objList.forEach((currObj) => {
      const { value, key } = currObj;
      updatedData = setDataAtKeyInNestedObject(updatedData, key, value) as CustomerDetailsType;
    });

    setData(updatedData);
  };

  const resetForm = () => {
    setData(undefined);
    setErrorData(undefined);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);

    if (newQuery.length > 0) {
      void debouncedGetListData(newQuery, defaultPaginationObj);
    } else if (newQuery.length === 0) {
      void debouncedGetListData(undefined, paginationInfo);
    }
  };

  // Generate page numbers for pagination display
  const getVisiblePageNumbers = () => {
    const { currentPage, pageCount } = paginationInfo;
    const maxVisiblePages = 7;

    if (pageCount <= maxVisiblePages) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(pageCount, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <Container>
      <Header>
        <div className="relative w-[35%]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search by name or number"
            className="w-full py-2 pl-10 pr-4 bg-gray-50 font-inter font-[500] rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200 border-none placeholder:text-gray-500"
          />
        </div>

        <Button size="small" leadingIcon={<PlusIcon />} onClick={() => navigate('/addcustomer')}>
          Add Customer
        </Button>
      </Header>

      <ContentContainer>
        <Text fontWeight={500}>
          Select Customer ({searchQuery ? listData.length : totalCustomers})
        </Text>
        <ListContainer>
          {listData.map((data) => (
            <Card key={data.customer_id} data={data} onClick={handleCardClick} />
          ))}
        </ListContainer>
      </ContentContainer>

      {/* Enhanced Pagination Component */}
      {paginationInfo.pageCount > 1 && (
        <div
          className="pagination-container"
          style={{
            marginTop: '1px',
            marginBottom: '5px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            className="pagination-info hidden"
            style={{ marginRight: '20px', fontSize: '14px', color: '#666' }}
          >
            Showing {(paginationInfo.currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(paginationInfo.currentPage * pageSize, totalCustomers)} of {totalCustomers}{' '}
            customers
          </div>

          <div
            className="pagination-controls"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <button
              onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
              disabled={paginationInfo.currentPage === 1}
              className="pagination-btn"
              style={{
                padding: '8px 9px',
                border: '1px solid #ddd',
                backgroundColor: paginationInfo.currentPage === 1 ? '#f5f5f5' : '#fff',
                cursor: paginationInfo.currentPage === 1 ? 'not-allowed' : 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              Previous
            </button>

            {getVisiblePageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`pagination-btn ${
                  pageNum === paginationInfo.currentPage ? 'active' : ''
                }`}
                style={{
                  padding: '8px 9px',
                  // border: '1px solid #ddd',
                  // backgroundColor: pageNum === paginationInfo.currentPage ? '#007bff' : '#fff',
                  color: pageNum === paginationInfo.currentPage ? '#007bff' : '#000',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '14px',
                  minWidth: '40px',
                }}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
              disabled={paginationInfo.currentPage === paginationInfo.pageCount}
              className="pagination-btn"
              style={{
                padding: '8px 9px',
                border: '1px solid #ddd',
                backgroundColor:
                  paginationInfo.currentPage === paginationInfo.pageCount ? '#f5f5f5' : '#fff',
                cursor:
                  paginationInfo.currentPage === paginationInfo.pageCount
                    ? 'not-allowed'
                    : 'pointer',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal
        ref={createCustomerRef}
        title="Add new customer"
        onModalClose={() => {
          createCustomerRef.current?.hide();
          resetForm();
        }}
        onModalSuccess={onModalSuccess}
        saveButtonText="Save & Continue"
      >
        <Details
          data={data}
          errorData={errorData}
          setErrorData={setErrorData}
          handleChange={handleChange}
          setIsloading={setIsloading}
        />
      </Modal>
      <Loader showLoader={isLoading} />
    </Container>
  );
};

export default CustomerList;
