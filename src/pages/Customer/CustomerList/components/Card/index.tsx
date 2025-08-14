import _isEmpty from 'lodash/isEmpty';

import { getInitailsOfName } from '../../../../../utils/common';
import { ChevronRightIcon } from '../../../../../assets/icons';
import { Text } from '../../../../../ui-component';

import { listDataType } from '../../../types';

import { CardContainer } from './style';

type CardProps = {
  data: listDataType;
  onClick: (data: listDataType) => void;
};

const Card = (props: CardProps) => {
  const { data, onClick } = props;

  const { customer_name, phone_number, profile_pic_link, country_code } = data;

  return (
    <CardContainer onClick={() => onClick(data)}>
      <>
        {_isEmpty(profile_pic_link) ? (
          <div className="profile-pic">{getInitailsOfName(customer_name).toUpperCase()}</div>
        ) : (
          <img className="profile-pic" src={profile_pic_link} alt="profile-pic" />
        )}
      </>
      <div className="content">
        <Text color="black" fontWeight={700}>
          {customer_name}
        </Text>
        <Text size="small" fontWeight={600}>
          {country_code}
          {phone_number}
        </Text>
      </div>
      <ChevronRightIcon />
    </CardContainer>
  );
};

export default Card;
