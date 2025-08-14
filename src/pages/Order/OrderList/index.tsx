import { useCallback, useEffect, useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import _reduce from 'lodash/reduce';
import _isNil from 'lodash/isNil';
import debounce from 'lodash/debounce';
import { FaSearch } from 'react-icons/fa';

import {
  convertObjectToQueryString,
  convertUrlStringToObject,
  getValueFromLocalStorage,
} from '../../../utils/common';
import { api } from '../../../utils/apiRequest';
import { Button, Loader, PaginationInfoType, Tabs, toasts } from '../../../ui-component';
import type { Options } from '../../../components/FormComponents';

import OrderTable from './component/OrderTable';
import type { OrderItemListType, OrderListType } from './type';
import { OrderListStyled } from './style';
import { defaultPaginationObj, pageSize, tabListConfig } from './constant';
import { useSelector } from 'react-redux';

const OrderList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get the order details from Redux
  const { customer_details } = useSelector((state: any) => state.createOrderReducer);

  const [data, setListData] = useState<OrderListType[]>([]);
  const [outfitData, setOutfitData] = useState<OrderItemListType[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [childTableIndex, setChildTableIndex] = useState(-1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfoType>(defaultPaginationObj);
  const [outfitStatusFilter, setOutfitStatusFilter] = useState<Record<number, Options[]>>({
    0: [],
  });
  const [filterValues, setFilterValues] = useState<Record<number, Record<string, any>>>({
    0: {},
  });
  const [isLoading, setIsLoading] = useState(false);

  const [urlQueryParams, setUrlQueryParams] = useState<Record<string, any>>({});

  const tabNames = tabListConfig.map((item) => item.label);

  useEffect(() => {
    setUrlQueryParams(convertUrlStringToObject(location.search));
  }, [location.search]);

  useEffect(() => {
    if ('tabName' in urlQueryParams) {
      const index = tabListConfig.findIndex(
        (obj) => obj.label.toLowerCase() === urlQueryParams['tabName'].toLowerCase()
      );

      setActiveIndex(index === -1 ? 0 : index);
    }

    if ('pageNo' in urlQueryParams) {
      setPaginationInfo({
        ...paginationInfo,
        currentPage: parseInt(urlQueryParams['pageNo']),
      });
    }
  }, [JSON.stringify(urlQueryParams)]);

  useEffect(() => {
    if ('status' in urlQueryParams) {
      const statusList = urlQueryParams['status'].split(' ');
      const statusOptions = tabListConfig[activeIndex].statusFilterOptions;

      setOutfitStatusFilter({
        ...outfitStatusFilter,
        [activeIndex]: statusOptions.filter((obj) => statusList.includes(obj.value)),
      });
    } else {
      setOutfitStatusFilter({
        ...outfitStatusFilter,
        [activeIndex]: [],
      });
    }

    if ('filters' in urlQueryParams) {
      const filters = JSON.parse(urlQueryParams['filters']);
      setFilterValues({
        ...filterValues,
        [activeIndex]: {
          ...filterValues[activeIndex],
          ...filters,
        },
      });
    } else {
      setFilterValues({ [activeIndex]: {} });
    }
  }, [JSON.stringify(urlQueryParams), activeIndex]);

  useEffect(() => {
    const currentStatusOptions = outfitStatusFilter[activeIndex];
    let queryParams = {};

    if (_isNil(currentStatusOptions) || currentStatusOptions.length === 0) {
      queryParams = {
        ...tabListConfig[activeIndex].queryFilters,
      };
    } else {
      queryParams = {
        ...tabListConfig[activeIndex].queryFilters,
        order_item_status_list: outfitStatusFilter[activeIndex]
          .map((options) => options.value)
          .join(','),
      };
    }

    const currentFilterOptions = filterValues[activeIndex];

    if (!_isNil(currentFilterOptions) && !_isNil(currentFilterOptions.deliveryDateFilter)) {
      const { startDate, endDate } = currentFilterOptions.deliveryDateFilter;
      queryParams = {
        ...queryParams,
        delivery_date_from: startDate,
        delivery_date_till: endDate,
      };
    }

    void debouncedGetOrderList(queryParams, paginationInfo);
  }, [
    JSON.stringify(outfitStatusFilter),
    JSON.stringify(paginationInfo.currentPage),
    JSON.stringify(filterValues),
  ]);

  const getOrderList = async (
    queryParams: Record<string, any> = {},
    paginationInfo: PaginationInfoType = defaultPaginationObj,
    size = pageSize,
    searchQuery?: string
  ) => {
    try {
      setIsLoading(true);
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const queryString = _reduce(
        queryParams,
        (querString, value, key) => querString + `${key}=${value}&`,
        ''
      );

      const pageCount = paginationInfo.currentPage;
      let response;
      const customerId = customer_details?.customer_id;

      if (searchQuery) {
        response = await api.postRequest('search', {
          boutique_id: boutique_id,
          target_entity: 'order',
          search_key: searchQuery,
        });

        if (response.status) {
          // eslint-disable-next-line no-console
          //console.log(response);
          const orderData = response?.data?.order_detail_response?.data || [];
          setListData(orderData);
          const mappedData = orderData.map((order: any) => ({
            ...order,
            order_item_details: new Array(order.order_item_count || 0),
          }));
          setListData(mappedData);
          setPaginationInfo({
            ...paginationInfo,
            pageCount: getTotalPageCount(response.data.order_details?.length ?? 0, pageSize),
          });
        }
      } else {
        if (location.pathname.includes('orders-list')) {
          response = await api.getRequest(
            `order/?${queryString}count=${size}&page_count=${pageCount}&boutique_id=${boutique_id}`
          );
        } else if (location.pathname.includes('selectcustomer')) {
          response = await api.getRequest(
            `order/?${queryString}count=${size}&page_count=${pageCount}&boutique_id=${boutique_id}&customer_id=${customerId}`
          );
        }

        const { status, data } = response;

        if (status) {
          setListData(data?.data ?? []);
          setPaginationInfo({
            ...paginationInfo,
            pageCount: getTotalPageCount(data?.total_records_count ?? 0, pageSize),
          });
          setChildTableIndex(-1);
        } else {
          setListData([]);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'order-list-error');
      }
      setListData([]);
    }
    setIsLoading(false);
  };
  const debouncedGetOrderList = useCallback(
    debounce((...args) => {
      void getOrderList(...args);
    }, 1000),
    []
  );

  const getOutfitData = (order_id: number) => {
    const currentStatusOptions = outfitStatusFilter[activeIndex];
    let queryParams: Record<string, any> = { order_id };

    if (_isNil(currentStatusOptions) || currentStatusOptions.length === 0) {
      queryParams = {
        ...queryParams,
        // ...tabListConfig[activeIndex].queryFilters,
      };
    } else {
      queryParams = {
        ...queryParams,
        // ...tabListConfig[activeIndex].queryFilters,
        order_item_status_list: outfitStatusFilter[activeIndex]
          .map((options) => options.value)
          .join(','),
      };
    }

    void makeOutfitDataRequest(queryParams);
  };

  const makeOutfitDataRequest = async (queryParams: Record<string, any> = {}) => {
    try {
      setIsLoading(true);
      const boutique_id = getValueFromLocalStorage('boutique_id');

      const queryString = _reduce(
        queryParams,
        (querString, value, key) => querString + `${key}=${value}&`,
        ''
      );

      const response = await api.getRequest(`order_item?${queryString}boutique_id=${boutique_id}`);

      const { status, data } = response;

      if (status) {
        setOutfitData(data?.data ?? []);
        // eslint-disable-next-line no-console
        console.log(data?.data);
      }
    } catch (error) {
      if (error instanceof Error) {
        toasts('error', error.message, 'order-list-error');
      }
    }

    setIsLoading(false);
  };

  const onTabChange = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
      setPaginationInfo(defaultPaginationObj);
      clearChildTableData();
      handleScroll(); // Add scroll to top

      const updatedQueryString = convertObjectToQueryString({
        tabName: tabListConfig[index].label,
      });

      if (location.pathname.includes('orders-list')) {
        navigate(`/orders-list?${updatedQueryString}`);
      } else if (location.pathname.includes('selectcustomer')) {
        navigate(`/selectcustomer?${updatedQueryString}`);
      }
    }
  };

  const getTotalPageCount = (totalRecords: number, pageSize: number) => {
    const num = totalRecords / pageSize;

    return Math.floor(num) + (totalRecords % pageSize === 0 ? 0 : 1);
  };

  const handlePageChange = (pageNumber: number) => {
    clearChildTableData();

    if (pageNumber !== paginationInfo.currentPage) {
      const queryString = convertObjectToQueryString({
        ...urlQueryParams,
        pageNo: pageNumber,
      });

      if (location.pathname.includes('orders-list')) {
        navigate(`/orders-list?${queryString}`);
      } else if (location.pathname.includes('selectcustomer')) {
        navigate(`/selectcustomer?${queryString}`);
      }
    }
  };

  const handleSortColumn = (key: string) => {
    const currentStatusOptions = outfitStatusFilter[activeIndex];
    let queryParams: Record<string, any> = {
      sort_key: key,
    };

    if (_isNil(currentStatusOptions) || currentStatusOptions.length === 0) {
      queryParams = {
        ...queryParams,
        ...tabListConfig[activeIndex].queryFilters,
      };
    } else {
      queryParams = {
        ...queryParams,
        ...tabListConfig[activeIndex].queryFilters,
        order_item_status_list: outfitStatusFilter[activeIndex]
          .map((options) => options.value)
          .join(','),
      };
    }

    void getOrderList(queryParams, paginationInfo);
  };

  const updateOutfitStatusFilter = (value: Options[]) => {
    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      status: value.map((obj) => obj.value).join(' '),
      pageNo: 1,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const updateFilter = (key: string, value: any) => {
    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      filters: JSON.stringify({ [key]: value }),
      pageNo: 1,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const clearChildTableData = () => {
    setOutfitData([]);
    setChildTableIndex(-1);
  };

  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setSearchQuery(newQuery);

    if (newQuery.length > 0) {
      void debouncedGetOrderList({}, defaultPaginationObj, pageSize, newQuery);
    } else {
      void debouncedGetOrderList({}, defaultPaginationObj);
    }
  };

  // eslint-disable-next-line no-console
  // console.log('data', data);
  const handleScroll = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const [statusCounts, setStatusCounts] = useState({
    active: 0,
    past_due: 0,
    upcoming: 0,
    pending_payment: 0,
    delivered: 0,
    draft: 0,
  });

  const fetchOrderStatusCounts = async () => {
    //const specificDate = '2024-12-31T10:43:17';
    const specificDate = new Date().toISOString().slice(0, 19);

    const queryParams = `order/status/count?delivery_date_from=${specificDate}&delivery_date_till=${specificDate}`;

    const response = await api.getRequest(queryParams);

    if (response.status) {
      setStatusCounts({
        active: response.data.active_order_count,
        past_due: response.data.past_due_order_count,
        upcoming: response.data.upcoming_order_count,
        pending_payment: response.data.pending_payment_order_count,
        delivered: response.data.delivered_order_count,
        draft: response.data.draft_order_count,
      });
    }
  };

  useEffect(() => {
    fetchOrderStatusCounts();
  }, []);

  return (
    <OrderListStyled>
      {!location.pathname.includes('selectcustomer') && (
        <div className="relative w-[35%] mt-[.7rem] ml-[.7rem]">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search by Order or Customer  Name"
            className="w-full py-2 pl-10 pr-4 bg-gray-50 font-inter font-[500] rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-200 border-none placeholder:text-gray-500"
          />
        </div>
      )}
      <Tabs
        defaultIndex={activeIndex}
        isSticky={false}
        tabNameList={tabNames}
        tabCounts={{
          active: statusCounts.active,
          'past due': statusCounts.past_due,
          upcoming: statusCounts.upcoming,
          'pending payment': statusCounts.pending_payment,
          delivered: statusCounts.delivered,
          draft: statusCounts.draft,
        }}
        onTabChange={onTabChange}
      >
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
        <OrderTable
          data={data}
          outfitData={outfitData}
          statusFilterOptions={tabListConfig[activeIndex].statusFilterOptions}
          outfitStatus={outfitStatusFilter[activeIndex]}
          updateOutfitStatus={updateOutfitStatusFilter}
          filterOptions={tabListConfig[activeIndex].dateFilterOptions ?? {}}
          filterValue={filterValues[activeIndex]}
          updateFilter={updateFilter}
          pageInfo={paginationInfo}
          handlePageChange={handlePageChange}
          getOutfitData={getOutfitData}
          childTableIndex={childTableIndex}
          setChildTableIndex={setChildTableIndex}
          handleSortColumn={handleSortColumn}
          urlQueryParams={urlQueryParams}
        />
      </Tabs>
      {location.pathname.includes('orders-list') && (
        <Button className="create-order-btn" onClick={() => navigate('/select-customer')}>
          Create Order
        </Button>
      )}
      <Loader showLoader={isLoading} />
    </OrderListStyled>
  );
};

export default OrderList;
