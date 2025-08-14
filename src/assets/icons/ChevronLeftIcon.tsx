import type { IconProps } from './types';

const ChevronLeftIcon = (props: IconProps) => {
  const { width = '9', height = '16', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 9 16" fill="none">
      <path
        /* eslint-disable-line */
        d="M8.7525 1.9027L7.425 0.575195L0 8.0002L7.425 15.4252L8.7525 14.0977L2.655 8.0002L8.7525 1.9027Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronLeftIcon;
