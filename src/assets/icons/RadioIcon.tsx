import type { IconProps } from './types';

const RadioIcon = (props: IconProps) => {
  const { width = '20', height = '20', color = 'var(--color-primary)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <g clipPath="url(#radioIconID)">
        <path
          /* eslint-disable-line */
          d="M10.0003 1.66699C5.40033 1.66699 1.66699 5.40033 1.66699 10.0003C1.66699 14.6003 5.40033 18.3337 10.0003 18.3337C14.6003 18.3337 18.3337 14.6003 18.3337 10.0003C18.3337 5.40033 14.6003 1.66699 10.0003 1.66699ZM10.0003 16.667C6.31699 16.667 3.33366 13.6837 3.33366 10.0003C3.33366 6.31699 6.31699 3.33366 10.0003 3.33366C13.6837 3.33366 16.667 6.31699 16.667 10.0003C16.667 13.6837 13.6837 16.667 10.0003 16.667Z"
          fill={color}
        />
        <path
          /* eslint-disable-line */
          d="M9.99967 14.1663C12.3009 14.1663 14.1663 12.3009 14.1663 9.99967C14.1663 7.69849 12.3009 5.83301 9.99967 5.83301C7.69849 5.83301 5.83301 7.69849 5.83301 9.99967C5.83301 12.3009 7.69849 14.1663 9.99967 14.1663Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="radioIconID">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default RadioIcon;
