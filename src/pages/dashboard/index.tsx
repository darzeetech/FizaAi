import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import _isNil from 'lodash/isNil';

import { RootState } from '../../store';
import { api } from '../../utils/apiRequest';
import { getValueFromLocalStorage } from '../../utils/common';

import { SingleDateField } from '../../components/FormComponents';
import { toasts, Loader, Text, Button, IconWrapper } from '../../ui-component';
import { createOrderFromAppQR, createOrderNews } from '../../assets/images';
import { CrossIcon } from '../../assets/icons';

import { updateDashboardData } from './reducer';

import GlobalInfo from './component/GlobalInfo';
import CustomerListBox from './component/CustomerListBox';
import OrderSalesChart from './component/OrderSalesChart';
import WeeklySales from './component/WeeklySalesChart';

import { Container, InfoContainer, FilterContainer } from './style';
import ChartComponent from './component/chart-component';
import TopCustomersChart from './component/top-customers-chart';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { dashboardReducer } = useSelector((state: RootState) => state);
  const { dashboardDetails } = dashboardReducer;

  const [showNewFeaturePopup, setShowNewFeaturePopup] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const {
    customer_dashboard,
    ledger_dashboard_data,
    weekwise_sales_split,
    is_active = true,
  } = dashboardDetails || {};

  const [selectedDate, setSelectedDate] = useState<number>(new Date().getTime());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const date = new Date(selectedDate);

    const month = date.getMonth() + 1;
    // Adding 1 because months are zero-based (0 = January, 1 = February, ...)

    const year = date.getFullYear();

    void fetchDashboardDetials(month, year);
    void fetchNewDashboardData(month, year);
  }, [selectedDate]);

  const fetchDashboardDetials = async (month: number, year: number) => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      try {
        setIsLoading(true);
        const response = await api.getRequest(
          `boutique/${boutique_id}/report?month=${month}&year=${year}`
        );

        const { data, status } = response;

        if (status) {
          dispatch(updateDashboardData({ data }));
        }
      } catch (error) {
        if (error instanceof Error) {
          toasts('error', error.message, 'update-boutique-error');
        }
      }

      setIsLoading(false);
    } else {
      toasts('info', 'boutique Not Exist', 'boutique-not-exist');
    }
  };

  const fetchNewDashboardData = async (month: number, year: number) => {
    const boutique_id = getValueFromLocalStorage('boutique_id');

    if (!_isNil(boutique_id)) {
      try {
        setIsLoading(true);
        const response = await api.getRequest(
          `dashboard?boutiqueId=${boutique_id}&month=${month}&year=${year}`
        );

        const { data, status } = response;

        if (status && data) {
          setDashboardData(data);
        }
      } catch (error) {
        if (error instanceof Error) {
          toasts('error', error.message, 'dashboard-data-error');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      toasts('info', 'boutique Not Exist', 'boutique-not-exist');
    }
  };

  // const fetchNewDashboardData = async (month: number, year: number) => {
  //   const boutique_id = getValueFromLocalStorage('boutique_id');
  //   // eslint-disable-next-line no-console
  //   console.log(month, year);

  //   if (!_isNil(boutique_id)) {
  //     try {
  //       setIsLoading(true);
  //       const response = await api.getRequest(`dashboard?boutiqueId=${92}&month=${4}&year=${2025}`);

  //       const { data, status } = response;

  //       if (status && data) {
  //         setDashboardData(data);
  //       }
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         toasts('error', error.message, 'dashboard-data-error');
  //       }
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   } else {
  //     toasts('info', 'boutique Not Exist', 'boutique-not-exist');
  //   }
  // };

  // eslint-disable-next-line no-console
  // console.log(dashboardData);

  return (
    <Container $showImg={!is_active}>
      <FilterContainer>
        <SingleDateField
          placeholder="Select Month"
          dateFormat="MM/yy"
          value={selectedDate}
          onChange={(value) => setSelectedDate(value as number)}
        />

        <Button onClick={() => navigate('/select-customer')}>Create Order</Button>
      </FilterContainer>
      <InfoContainer>
        <GlobalInfo
          customer_dashboard={customer_dashboard}
          ledger_dashboard_data={ledger_dashboard_data}
          dashboardData={dashboardData}
        />
      </InfoContainer>

      <InfoContainer bgColor={'var(--color-lavender)'}>
        <CustomerListBox customerList={dashboardDetails?.top_customer_data || []} />
        <OrderSalesChart data={dashboardDetails?.order_type_sales_split || []} />
        <WeeklySales
          data={weekwise_sales_split?.weekly_sales || []}
          total_sales={weekwise_sales_split?.total_sales || 0}
          max_bar_graph_length={weekwise_sales_split?.max_bar_graph_length || ''}
        />
      </InfoContainer>

      <div className="bg-[#F8F8FD] flex flex-col md:flex-row   gap-3 p-5 ">
        <ChartComponent chartData={dashboardData?.graphDataDashboard?.data?.[4] || undefined} />
        <ChartComponent chartData={dashboardData?.graphDataDashboard?.data?.[1] || undefined} />
        <ChartComponent chartData={dashboardData?.graphDataDashboard?.data?.[2] || undefined} />
      </div>
      <div className="bg-[#F8F8FD] flex flex-col md:flex-row   gap-3 p-5 ">
        <TopCustomersChart chartData={dashboardData?.graphDataDashboard?.data?.[0] || undefined} />
      </div>

      {!is_active && (
        <div className="order-qr-style">
          <div className="text-content">
            <Text className="header-text" color="white" size="xxxl">
              Create Orders from App
            </Text>
            <div>
              <Text className="content-text" color="white">
                Step 1. Scan the QR code and download the Darzee App
              </Text>
              <Text className="content-text" color="white">
                Step 2. Login
              </Text>
              <Text className="content-text" color="white">
                Step 3. Create an order in the Darzee App
              </Text>
              <div className="step-4">
                <Text className="content-text" color="white">
                  Step 4. After order is created
                </Text>
                <div className="click-here-text" onClick={() => location.reload()}>
                  <Text className="content-text" color="primary">
                    click here{' '}
                  </Text>
                </div>

                <Text className="content-text" color="white">
                  or refresh page
                </Text>
              </div>
            </div>
            <Text className="content-text" color="white">
              We are currently working on the desktop version of the Darzee App. We will keep
              releasing updates on regular intervals.
            </Text>

            <div className="news-text">
              <img src={createOrderNews} alt="news-pic" />
              <Text className="content-text" color="var(--color-paleVioletRed)" fontWeight={700}>
                Good News: Our Mobile App is fully loaded.
              </Text>
            </div>
          </div>
          <img className="qr-img" src={createOrderFromAppQR} alt="create-order-app-qr" />
        </div>
      )}
      {is_active && showNewFeaturePopup && (
        <div className="order-qr-style hidden">
          <div className="text-content">
            <Text className="header-text" color="white" size="xxxl">
              Edit customers, edit profile and create portfolio using Darzee Mobile App
            </Text>
            <div>
              <Text className="content-text" color="white">
                We are currently working on the desktop version of the Darzee App. We will keep
                releasing updates on regular intervals.
              </Text>
            </div>

            <div className="news-text">
              <img src={createOrderNews} alt="news-pic" />
              <Text className="content-text" color="var(--color-paleVioletRed)" fontWeight={700}>
                Good News: Our Mobile App is fully loaded.
              </Text>
            </div>
          </div>
          <div className="qr-img-container">
            <img className="qr-img" src={createOrderFromAppQR} alt="create-order-app-qr" />
            <IconWrapper className="cross-icon" onClick={() => setShowNewFeaturePopup(false)}>
              <CrossIcon />
            </IconWrapper>
          </div>
        </div>
      )}
      {<Loader showLoader={isLoading} />}
    </Container>
  );
};

export default Dashboard;
