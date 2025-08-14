//import _isNil from 'lodash/isNil';
import { Text } from '../../../../ui-component';
import {
  PendingAmountIcon,
  FolderIcon,
  CheckmarkIcon,
  PersonAddIcon,
} from '../../../../assets/icons';
import { convertNumberOrStringToPriceFormat } from '../../../../utils/common';
import { InfoBox } from '../InfoBox';
import PersonAddIcon1 from '../../../../assets/icons/PersonAddIcon1';

type GlobalInfoProps = {
  customer_dashboard: Record<string, any>;
  ledger_dashboard_data: Record<string, any>;
  dashboardData?: Record<string, any> | null;
};

const GlobalInfo = (props: GlobalInfoProps) => {
  const { dashboardData } = props;

  // Return null if dashboardData is not available
  if (!dashboardData) {
    return null;
  }

  return (
    <>
      <InfoBox
        icon={
          <Text size="xxxl" fontWeight={500} color="var(--color-islamicGreen)">
            &#8377;
          </Text>
        }
        label={dashboardData?.amount_received?.title || 'Amount Received'}
        amount={
          dashboardData?.amount_received?.data !== undefined &&
          dashboardData?.amount_received?.data !== null
            ? convertNumberOrStringToPriceFormat(
                Number(dashboardData.amount_received.data).toFixed(2)
              )
            : '-'
        }
        amountTextColor="var(--color-islamicGreen)"
      />

      <InfoBox
        icon={<PendingAmountIcon />}
        label={dashboardData?.total_sales?.title || 'Total Sales'}
        amount={
          dashboardData?.total_sales?.data !== undefined &&
          dashboardData?.total_sales?.data !== null
            ? convertNumberOrStringToPriceFormat(Number(dashboardData.total_sales.data).toFixed(2))
            : '-'
        }
        amountTextColor="var(--color-tertiary)"
        amountLeadingIcon={
          <Text size="medium" fontWeight={700} color="var(--color-tertiary)">
            &#8377;
          </Text>
        }
      />

      <InfoBox
        icon={<FolderIcon />}
        label={dashboardData?.orders_received?.title || 'Orders Received'}
        amount={dashboardData?.orders_received?.data ?? '-'}
        amountTextColor="var(--color-primary)"
      />

      <InfoBox
        icon={<CheckmarkIcon />}
        label={dashboardData?.orders_closed?.title || 'Orders Closed'}
        amount={dashboardData?.orders_closed?.data ?? '-'}
        amountTextColor="#30BC00"
      />

      <InfoBox
        icon={<PersonAddIcon />}
        label={dashboardData?.new_customers?.title || 'New Customers'}
        amount={dashboardData?.new_customers?.data ?? '-'}
        amountTextColor="var(--color-bondiBlue)"
        amountLeadingIcon={
          <Text size="large" fontWeight={700} color="var(--color-bondiBlue)">
            +
          </Text>
        }
      />

      <InfoBox
        icon={<PersonAddIcon1 />}
        label={dashboardData?.total_customers?.title || 'Total Customers'}
        amount={dashboardData?.total_customers?.data ?? '-'}
        amountTextColor="#4D7AFF"
      />
    </>
  );
};

export default GlobalInfo;
