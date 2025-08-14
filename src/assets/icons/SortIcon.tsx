import type { IconProps } from './types';

const SortIcon = (props: IconProps) => {
  const { width = '8', height = '13', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 8 13" fill="none">
      <g clipPath="url(#SortIconID)">
        <path
          /* eslint-disable-line */
          d="M1.01836 7.31255H6.92704C7.45833 7.31255 7.72397 7.97017 7.34909 8.35356L4.39475 11.375C4.16138 11.6137 3.78402 11.6137 3.55314 11.375L0.596314 8.35356C0.221435 7.97017 0.487078 7.31255 1.01836 7.31255ZM7.34909 4.64653L4.39475 1.62505C4.16138 1.38638 3.78402 1.38638 3.55314 1.62505L0.596314 4.64653C0.221435 5.02993 0.487078 5.68755 1.01836 5.68755H6.92704C7.45833 5.68755 7.72397 5.02993 7.34909 4.64653Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="SortIconID">
          <rect width="7.94444" height="13" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SortIcon;
