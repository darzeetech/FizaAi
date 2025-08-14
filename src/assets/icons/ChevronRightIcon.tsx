import type { IconProps } from './types';

const ChevronRightIcon = (props: IconProps) => {
  const { width = '14', height = '14', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 14 14" fill="none">
      <g clipPath="url(#chevronRightID)">
        <path
          /* eslint-disable-line */
          d="M3.43018 2.40366L8.02684 7.00033L3.43018 11.597L4.66684 12.8337L10.5002 7.00033L4.66684 1.16699L3.43018 2.40366Z"
          fill={color}
          fillOpacity="0.5"
        />
      </g>
      <defs>
        <clipPath id="chevronRightID">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ChevronRightIcon;
