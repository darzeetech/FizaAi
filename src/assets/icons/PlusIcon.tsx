import type { IconProps } from './types';

const PlusIcon = (props: IconProps) => {
  const { width = '21', height = '20', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 21 20" fill="none">
      <g clipPath="url(#plusIconID)">
        <path
          /* eslint-disable-line */
          d="M16.3332 10.8337H11.3332V15.8337H9.6665V10.8337H4.6665V9.16699H9.6665V4.16699H11.3332V9.16699H16.3332V10.8337Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="plusIconID">
          <rect width="20" height="20" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlusIcon;
