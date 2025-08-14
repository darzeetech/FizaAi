import type { IconProps } from './types';

const ChevronDownFilledIcon = (props: IconProps) => {
  const { width = '11', height = '6', color = 'var(--color-nightRider)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 11 6" fill="none">
      <path
        /* eslint-disable-line */
        d="M0.707031 0.583008L5.4987 5.37467L10.2904 0.583008H0.707031Z"
        fill={color}
      />
    </svg>
  );
};

export default ChevronDownFilledIcon;
