import _isNil from 'lodash/isNil';
import _isEmpty from 'lodash/isEmpty';

import { moneyFormatSigns } from '../../../../utils/contant';
import { convertNumberOrStringToPriceFormat } from '../../../../utils/common';
import { Text } from '../../../../ui-component';
import { StarIcon } from '../../../../assets/icons';

import type { CustomerDetailsType } from '../../type';

import { Container, CustomerBox } from './style';

type CustomerListBox = {
  customerList: CustomerDetailsType[];
};

const CustomerListBox = (props: CustomerListBox) => {
  const { customerList = [] } = props;

  const isEmptyList = customerList.length === 0;

  return (
    <Container isEmptyList={isEmptyList}>
      <div className="header">
        <div className="header-content">
          <StarIcon />
          <Text fontWeight={700}>Top Customer</Text>
        </div>
      </div>
      <div className="content">
        {customerList.map((customer) => (
          <CustomerBox key={customer.customer_id}>
            {!_isNil(customer.customer_profile_pic_link) &&
              !_isEmpty(customer.customer_profile_pic_link) && (
                <img src={customer.customer_profile_pic_link} alt="profile-pic" />
              )}
            <div className="customer-content">
              <div>
                <Text size="small" fontWeight={700}>
                  {customer.customer_name}
                </Text>
                <Text size="small">{customer.customer_phone_number}</Text>
              </div>
              <div className="sales-content">
                <Text size="small">Total Sales</Text>
                <div className="amount-container">
                  <Text size="small" fontWeight={700}>
                    {`${moneyFormatSigns.rupee} ${convertNumberOrStringToPriceFormat(
                      customer.sales_by_customer
                    )}`}
                  </Text>
                </div>
              </div>
            </div>
          </CustomerBox>
        ))}

        {isEmptyList && <Text fontWeight={500}>No Customer Exists</Text>}
      </div>
    </Container>
  );
};

export default CustomerListBox;
