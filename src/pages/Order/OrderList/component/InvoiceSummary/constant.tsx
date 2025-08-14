import { BsCash } from 'react-icons/bs';
import { AiOutlineBank } from 'react-icons/ai';
import { RiBankCardFill } from 'react-icons/ri';
import { upiImage } from '../../../../../assets/images';

export const paymentModeOptions = [
  {
    label: 'Cash',
    value: 1,
    icon: <BsCash />,
  },
  {
    label: 'Bank Transfer',
    value: 2,
    icon: <AiOutlineBank />,
  },
  {
    label: 'Card Swipe',
    value: 3,
    icon: <RiBankCardFill />,
  },
  {
    label: 'UPI',
    value: 4,
    icon: <img src={upiImage} alt="upi" />,
  },
];
