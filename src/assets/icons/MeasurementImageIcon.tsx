import type { IconProps } from './types';

const MeasurementImageIcon = (props: IconProps) => {
  const { width = '24', height = '23', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 23" fill="none">
      <g clipPath="url(#MeasurementImageIconID)">
        <path
          /* eslint-disable-line */
          d="M18.4583 4.79167V18.2083H5.04167V4.79167H18.4583ZM18.4583 2.875H5.04167C3.9875 2.875 3.125 3.7375 3.125 4.79167V18.2083C3.125 19.2625 3.9875 20.125 5.04167 20.125H18.4583C19.5125 20.125 20.375 19.2625 20.375 18.2083V4.79167C20.375 3.7375 19.5125 2.875 18.4583 2.875ZM13.8008 11.3658L10.9258 15.0746L8.875 12.5925L6 16.2917H17.5L13.8008 11.3658Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="MeasurementImageIconID">
          <rect width="23" height="23" fill="white" transform="translate(0.25)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MeasurementImageIcon;
