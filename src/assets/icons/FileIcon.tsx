import type { IconProps } from './types';

const FileIcon = (props: IconProps) => {
  const { width = '24', height = '24', color = 'var(--color-white)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M18.5 4H5.5C4.94772 4 4.5 4.44772 4.5 5V21C4.5 21.5523 4.94772 22
        5.5 22H18.5C19.0523 22 19.5 21.5523 19.5 21V5C19.5 4.44772 19.0523 4 18.5 4Z"
        stroke={color}
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 2V5M15 2V5M8 9.5H16M8 13.5H14M8 17.5H12"
        stroke={color}
        strokeOpacity="0.8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FileIcon;
