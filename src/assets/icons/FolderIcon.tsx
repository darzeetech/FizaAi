import type { IconProps } from './types';

const FolderIcon = (props: IconProps) => {
  const { width = '28', height = '28', color = 'var(--color-primary)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 28 28" fill="none">
      <g clipPath="url(#folderIconID)">
        <path
          /* eslint-disable-line */
          d="M23.333 6.99996H13.9997L11.6663 4.66663H4.66634C3.38301 4.66663 2.34467 5.71663 2.34467 6.99996L2.33301 21C2.33301 22.2833 3.38301 23.3333 4.66634 23.3333H23.333C24.6163 23.3333 25.6663 22.2833 25.6663 21V9.33329C25.6663 8.04996 24.6163 6.99996 23.333 6.99996ZM23.333 21H4.66634V9.33329H23.333V21Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="folderIconID">
          <rect width="28" height="28" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FolderIcon;
