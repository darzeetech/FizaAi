import { useEffect, useRef, useState } from 'react';
import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { BiPlusCircle, BiSolidMinusCircle } from 'react-icons/bi';

import { moneyFormatSigns } from '../../../../../utils/contant';
import {
  convertNumberOrStringToPriceFormat,
  convertObjectToQueryString,
  getValueAtKeyInNestedObject,
} from '../../../../../utils/common';
import {
  IconWrapper,
  Loader,
  Pagination,
  PaginationInfoType,
  Sheet,
  SheetMethods,
  Text,
} from '../../../../../ui-component';
import { ChevronRightIcon, CrossIcon, SortIcon } from '../../../../../assets/icons';
import { DateRangeField, DropdownField, Options } from '../../../../../components/FormComponents';
import { orderTableHeaders } from '../../constant';
import type { OrderItemListType, OutfitObjType } from '../../type';

import {
  FilterContainer,
  TableContainer,
  StyledTh,
  StyledCell,
  StyledTr,
  ArrowIconContainer,
  PaginationContainer,
  StatusContainer,
  StatusText,
  Container,
} from './style';
import OutfitSummaryDetails from '../OutfitSummaryDetails';
import InvoiceSummary from '../InvoiceSummary';
import { useLocation, useNavigate } from 'react-router-dom';

type OrderTableProps = {
  data: Array<Record<string, any>>;
  outfitData: OrderItemListType[];
  statusFilterOptions: Array<Options & { order: number }>;
  outfitStatus: Options[];
  updateOutfitStatus: (value: Options[]) => void;
  filterOptions: Record<string, any>;
  filterValue: Record<string, any>;
  updateFilter: (key: string, value: any) => void;
  pageInfo: PaginationInfoType;
  childTableIndex: number;
  setChildTableIndex: (index: number) => void;
  handlePageChange: (pageNum: number) => void;
  getOutfitData: (order_id: number) => void;
  handleSortColumn: (key: string) => void;
  urlQueryParams: Record<string, any>;
};

const OrderTable = ({
  data,
  outfitData,
  statusFilterOptions,
  outfitStatus,
  updateOutfitStatus,
  filterOptions = {},
  filterValue,
  updateFilter,
  getOutfitData,
  pageInfo,
  childTableIndex,
  setChildTableIndex,
  handlePageChange,
  handleSortColumn,
  urlQueryParams,
}: OrderTableProps) => {
  const navigate = useNavigate();
  const ref = useRef<SheetMethods>(null);
  const invoiceSheetRef = useRef<SheetMethods>(null);

  const [currentItemId, setCurrentItemId] = useState(-1);
  const [currentOrderId, setCurrentOrderId] = useState(-1);
  const [invoiceOrderId, setInvoiceOrderId] = useState(-1);

  const [isLoading, setIsLoading] = useState(false);
  const [currentOutfitList, setCurrentOutfitList] = useState<OutfitObjType[]>([]);

  useEffect(() => {
    const orderFilterDiv = document.getElementById('order-filter-container');
    const orderTableBody = document.getElementById('order-table-body');

    if (!_isNil(orderTableBody)) {
      orderTableBody.style.height = `calc(100vh - ${
        (orderFilterDiv?.clientHeight ?? 0) + 196 + 12
      }px)`;
    }
  });

  useEffect(() => {
    if ('invoiceOrderId' in urlQueryParams) {
      setInvoiceOrderId(parseInt(urlQueryParams['invoiceOrderId']));
    } else {
      setInvoiceOrderId(-1);
    }

    if ('orderId' in urlQueryParams) {
      setCurrentOrderId(parseInt(urlQueryParams['orderId']));
      setChildTableIndex(
        data.findIndex((obj) => obj.order_id === parseInt(urlQueryParams['orderId']))
      );
    } else {
      setCurrentOrderId(-1);
      setChildTableIndex(-1);
    }

    if ('itemId' in urlQueryParams) {
      setCurrentItemId(parseInt(urlQueryParams['itemId']));
    } else {
      setCurrentItemId(-1);
    }
  }, [JSON.stringify(urlQueryParams), JSON.stringify(data)]);

  useEffect(() => {
    if (invoiceOrderId !== -1) {
      invoiceSheetRef.current?.show();
    }
  }, [invoiceOrderId]);

  useEffect(() => {
    if (currentItemId !== -1 && outfitData.length > 0) {
      setCurrentOutfitList(
        outfitData.map((obj) => {
          return {
            outfit_type: obj.outfit_type,
            outfit_type_image_link: obj.outfit_type_image_link,
            item_id: obj.id,
            outfit_alias: obj.outfit_alias,
          };
        })
      );

      ref.current?.show();
    }
  }, [currentItemId, JSON.stringify(outfitData)]);

  useEffect(() => {
    if (currentOrderId !== -1) {
      void getOutfitData(currentOrderId);
    }
  }, [currentOrderId]);

  const getCellValue = (
    header: Record<string, any>,
    rowData: Record<string, any>,
    isParentRow = true
  ) => {
    const { key, isParent, isChild } = header;

    if (isParentRow) {
      if (isParent) {
        if (key === 'order_item_details') {
          return `${rowData[key].length ?? 0} Items`;
        } else if (key === 'openChildTable') {
          return '';
        } else if (key === 'total_amount') {
          const amount =
            getValueAtKeyInNestedObject(rowData, 'order_amount_details.total_amount') ?? '0';

          return `${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
            amount as string
          )}`;
        } else if (key === 'boutique_order_id') {
          return rowData['other_reference_id']
            ? `${rowData['boutique_order_id']} ~ ${rowData['other_reference_id']}`
            : rowData['boutique_order_id'];
        }

        const value = getValueAtKeyInNestedObject(rowData, key);

        return (value ?? '-') as unknown as string;
      }
    } else {
      if (isChild) {
        let value;

        if (key === 'order_item_details') {
          value = getValueAtKeyInNestedObject(rowData, 'outfit_type');

          return (value ?? '-') as unknown as string;
        } else if (key === 'total_amount') {
          const amount = getValueAtKeyInNestedObject(rowData, 'item_price') ?? '0';

          return `${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
            amount as string
          )}`;
        }

        value = getValueAtKeyInNestedObject(rowData, key);

        if (key.includes('date') && !_isNil(value)) {
          return new Date(value as unknown as string).toDateString();
        }

        return (value ?? '-') as unknown as string;
      }
    }

    return '';
  };

  const handleShowChildTable = (index: number) => {
    const order_id = data[index].order_id;
    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      orderId: childTableIndex === index ? null : order_id,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const handleDeleteOutfitStatus = (value: string) => {
    updateOutfitStatus(outfitStatus.filter((currStatus) => currStatus.value !== value));
  };

  const handleOpenOufitDetails = (id: number) => {
    setCurrentOutfitList(
      outfitData.map((obj) => {
        return {
          outfit_type: obj.outfit_type,
          outfit_type_image_link: obj.outfit_type_image_link,
          item_id: obj.id,
          outfit_alias: obj.outfit_alias,
        };
      })
    );

    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      itemId: id,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const handleOpenInvoiceDetails = (id: number) => {
    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      invoiceOrderId: id,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const onInvoiceSheetClose = () => {
    invoiceSheetRef.current?.hide();

    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      invoiceOrderId: null,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }
  };

  const onOutfitSheetClose = () => {
    ref.current?.hide();

    const queryString = convertObjectToQueryString({
      ...urlQueryParams,
      itemId: null,
    });

    if (location.pathname.includes('orders-list')) {
      navigate(`/orders-list?${queryString}`);
    } else if (location.pathname.includes('selectcustomer')) {
      navigate(`/selectcustomer?${queryString}`);
    }

    if (currentOrderId !== -1) {
      void getOutfitData(currentOrderId);
    }
  };

  const currentOrderDetails = data.filter((item) => item.order_id === currentOrderId);

  const invoiceOrderDetails = data.filter((item) => item.order_id === invoiceOrderId);

  const location = useLocation();
  // Create a filtered headers array based on location
  const filteredHeaders = orderTableHeaders.filter((header) => {
    if (location.pathname.includes('selectcustomer')) {
      return !['customer_details.customer_name', 'customer_details.phone_number'].includes(
        header.key
      );
    }

    return true;
  });

  // eslint-disable-next-line no-console
  //console.log(outfitData);

  return (
    <Container isBottomPadding={false}>
      <FilterContainer id="order-filter-container">
        {statusFilterOptions.length > 0 && (
          <div className="status-filter">
            <DropdownField
              label="Outfit Status"
              placeholder="Outfit Status"
              options={statusFilterOptions.sort((a, b) => a.order - b.order)}
              isMulti={true}
              hideSelectedOptions={true}
              isClearable={false}
              value={!_isNil(outfitStatus) ? outfitStatus : undefined}
              onChange={(value) => updateOutfitStatus(value)}
            />
          </div>
        )}
        {filterOptions.deliveryDateFilter && (
          <div className="status-filter">
            <DateRangeField
              label="Delivery Date"
              placeholder="Select Date"
              dateFormat="dd/MM/yyyy"
              valueFormat="isoString"
              value={filterValue?.deliveryDateFilter}
              onChange={(startDate, endDate) =>
                updateFilter('deliveryDateFilter', { startDate, endDate })
              }
            />
          </div>
        )}
        <div className="status-chip-container">
          {!_isNil(outfitStatus) &&
            outfitStatus.length > 0 &&
            outfitStatus.map((status, index) => (
              <div key={index} className="status-chip">
                <Text size="small" fontWeight={500}>
                  {status.label}
                </Text>
                <IconWrapper onClick={() => handleDeleteOutfitStatus(status.value)}>
                  <CrossIcon />
                </IconWrapper>
              </div>
            ))}
        </div>
      </FilterContainer>
      <TableContainer>
        <thead>
          <tr>
            {filteredHeaders.map((header, index) => (
              <StyledTh
                key={index}
                width={header.key === 'openChildTable' || header.key === 'openDetails' ? 5 : 10}
              >
                <div className="header-td-container">
                  <Text fontWeight={600} color="white">
                    {header.label}
                  </Text>
                  {header.isSort && (
                    <IconWrapper onClick={() => handleSortColumn(header.key)}>
                      <SortIcon />
                    </IconWrapper>
                  )}
                </div>
              </StyledTh>
            ))}
          </tr>
        </thead>
        <tbody className="" id="order-table-body">
          {data.map((row, index) => (
            <>
              <StyledTr key={index} isEven={index % 2 === 0}>
                {orderTableHeaders
                  .filter((header) => {
                    if (location.pathname.includes('selectcustomer')) {
                      return ![
                        'customer_details.customer_name',
                        'customer_details.phone_number',
                      ].includes(header.key);
                    }

                    return true;
                  })
                  .map((header, headerIndex) => (
                    <StyledCell
                      key={index + headerIndex}
                      width={
                        header.key === 'openChildTable' || header.key === 'openDetails' ? 5 : 10
                      }
                    >
                      {header.key === 'openChildTable' && (
                        <ArrowIconContainer onClick={() => handleShowChildTable(index)}>
                          {childTableIndex === index ? <BiSolidMinusCircle /> : <BiPlusCircle />}
                        </ArrowIconContainer>
                      )}

                      {header.key === 'openDetails' && (
                        <ArrowIconContainer onClick={() => handleOpenInvoiceDetails(row.order_id)}>
                          <ChevronRightIcon />
                        </ArrowIconContainer>
                      )}

                      {header.key !== 'openChildTable' && header.key !== 'openDetails' && (
                        <Text fontWeight={600}>{getCellValue(header, row)}</Text>
                      )}
                    </StyledCell>
                  ))}
              </StyledTr>

              {childTableIndex === index &&
                !_isNil(row.order_item_details) &&
                outfitData.map((childRow: Record<string, any>, childRowIndex: number) => (
                  <StyledTr
                    key={childRowIndex + childRowIndex}
                    isChildTable={true}
                    isEven={index % 2 === 0}
                  >
                    {location.pathname.includes('selectcustomer') && (
                      <StyledCell width={5}></StyledCell>
                    )}

                    {/* Start mapping data from third column */}
                    {orderTableHeaders
                      .slice(location.pathname.includes('selectcustomer') ? 3 : 0)
                      .map((header, headerIndex) => {
                        const cellValue = getCellValue(header, childRow, false);
                        // eslint-disable-next-line no-console
                        // console.log(cellValue);

                        return (
                          <StyledCell
                            key={index + headerIndex}
                            width={
                              header.key === 'openChildTable' || header.key === 'openDetails'
                                ? 5
                                : 10
                            }
                          >
                            {header.key === 'openDetails' && (
                              <ArrowIconContainer
                                onClick={() => handleOpenOufitDetails(childRow.id)}
                              >
                                <ChevronRightIcon />
                              </ArrowIconContainer>
                            )}

                            {header.key === 'status' && (
                              <StatusContainer status={cellValue}>
                                <div className="circle" />
                                <StatusText fontWeight={600} status={cellValue}>
                                  {cellValue}
                                </StatusText>
                              </StatusContainer>
                            )}
                            {header.key !== 'openDetails' && header.key !== 'status' && (
                              <Text fontWeight={600}>{cellValue}</Text>
                            )}
                          </StyledCell>
                        );
                      })}
                  </StyledTr>
                ))}
            </>
          ))}

          {data.length === 0 && (
            <Text className="empty-list" fontWeight={500}>
              No Data found for current filters.
            </Text>
          )}
          <div className="h-[7rem] bg-white  w-full  "></div>
        </tbody>
      </TableContainer>

      <PaginationContainer>
        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </PaginationContainer>

      <Sheet ref={ref} onClose={onOutfitSheetClose}>
        <OutfitSummaryDetails
          currentItemId={currentItemId}
          orderNumber={currentOrderId}
          boutiqueOrderId={
            !_isNil(currentOrderDetails) && !_isEmpty(currentOrderDetails)
              ? currentOrderDetails[0].boutique_order_id
              : -1
          }
          outfitList={currentOutfitList}
          setCurrentItemId={setCurrentItemId}
          orderStatus={
            !_isNil(currentOrderDetails) && !_isEmpty(currentOrderDetails)
              ? currentOrderDetails[0].order_status
              : ''
          }
          onOutfitSheetClose={onOutfitSheetClose}
        />
      </Sheet>

      <Sheet ref={invoiceSheetRef} onClose={onInvoiceSheetClose}>
        <InvoiceSummary
          order_id={invoiceOrderId}
          setIsLoading={setIsLoading}
          orderStatus={
            !_isNil(invoiceOrderDetails) && !_isEmpty(invoiceOrderDetails)
              ? invoiceOrderDetails[0].order_status
              : ''
          }
        />
      </Sheet>
      <Loader showLoader={isLoading} />
    </Container>
  );
};

export default OrderTable;
