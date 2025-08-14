import type { IconProps } from './types';

const MicIcon = (props: IconProps) => {
  const { width = '17', height = '16', color = 'var(--color-primary)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 17 16" fill="none">
      <g clipPath="url(#MicIconID)">
        <path
          /* eslint-disable-line */
          d="M8.5 9.33301C9.60667 9.33301 10.5 8.43967 10.5 7.33301V3.33301C10.5 2.22634 9.60667 1.33301 8.5 1.33301C7.39333 1.33301 6.5 2.22634 6.5 3.33301V7.33301C6.5 8.43967 7.39333 9.33301 8.5 9.33301Z"
          fill={color}
        />
        <path
          /* eslint-disable-line */
          d="M11.833 7.33301C11.833 9.17301 10.3397 10.6663 8.49967 10.6663C6.65967 10.6663 5.16634 9.17301 5.16634 7.33301H3.83301C3.83301 9.68634 5.57301 11.6197 7.83301 11.9463V13.9997H9.16634V11.9463C11.4263 11.6197 13.1663 9.68634 13.1663 7.33301H11.833Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="MicIconID">
          <rect width="16" height="16" fill="white" transform="translate(0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default MicIcon;
