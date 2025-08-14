import type { IconProps } from './types';

const CalenderIcon = (props: IconProps) => {
  const { width = '16', height = '16', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
      <g clipPath="url(#CalenderIconID)">
        <path
          /* eslint-disable-line */
          d="M13.333 1.99996H12.6663V0.666626H11.333V1.99996H4.66634V0.666626H3.33301V1.99996H2.66634C1.93301 1.99996 1.33301 2.59996 1.33301 3.33329V14C1.33301 14.7333 1.93301 15.3333 2.66634 15.3333H13.333C14.0663 15.3333 14.6663 14.7333 14.6663 14V3.33329C14.6663 2.59996 14.0663 1.99996 13.333 1.99996ZM13.333 14H2.66634V6.66663H13.333V14ZM13.333 5.33329H2.66634V3.33329H13.333V5.33329Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="CalenderIconID">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default CalenderIcon;
