import type { IconProps } from './types';

const DashboardIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#dashboardID)">
        <path
          d="M3 13H11V3H3V13ZM3 21H11V15H3V21ZM13 21H21V11H13V21ZM13 3V9H21V3H13Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="dashboardID">
          <rect width="24" height="24" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DashboardIcon;
