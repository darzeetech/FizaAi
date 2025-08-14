import { ReactNode } from 'react';
import _isNil from 'lodash/isNil';
import { Text } from '../../../../ui-component';
import { Box } from './style';

export type InfoBox = {
  label: string;
  icon: ReactNode;
  amount: string;
  amountTextColor?: string;
  amountLeadingIcon?: ReactNode;
};

export const InfoBox = (props: InfoBox) => {
  const {
    label,
    icon,
    amount,
    amountTextColor = 'var(--color-nightRider)',
    amountLeadingIcon,
  } = props;

  return (
    <Box>
      {icon}
      <div>
        <Text size="small" fontWeight={600}>
          {label}
        </Text>
        <div className="amount-container">
          {!_isNil(amountLeadingIcon) && amountLeadingIcon}
          <Text size="medium" color={amountTextColor} fontWeight={700}>
            {amount}
          </Text>
        </div>
      </div>
    </Box>
  );
};
