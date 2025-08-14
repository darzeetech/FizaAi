import type { IconProps } from './types';

const ManagePortfolioIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#managePortfoliID)">
        <path
          d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1
           21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14.14 11.86L11.14 15.73L9 13.14L6
            17H18L14.14 11.86Z"
          fill={color}
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <clipPath id="managePortfoliID">
          <rect width="24" height="24" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ManagePortfolioIcon;
