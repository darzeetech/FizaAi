import type { IconProps } from './types';

const MinusIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#minusIconID)">
        <path d="M19 13H5V11H19V13Z" fill={color} fillOpacity="1" />
      </g>
      <defs>
        <clipPath id="minusIconID">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MinusIcon;
