import type { IconProps } from './types';

const RightArrowIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <g clipPath="url(#clip0_7894_31125)">
        <path d="M22.5 12L18.5 8V11H3.5V13H18.5V16L22.5 12Z" fill={color} />
      </g>
      <defs>
        <clipPath id="clip0_7894_31125">
          <rect width={width} height={height} fill={color} transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RightArrowIcon;
