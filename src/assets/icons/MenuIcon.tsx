import type { IconProps } from './types';

const MenuIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#menuIconID)">
        <path
          d="M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 
          13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z"
          fill={color}
          fillOpacity="0.8"
        />
      </g>
      <defs>
        <clipPath id="menuIconID">
          <rect width="24" height="24" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MenuIcon;
