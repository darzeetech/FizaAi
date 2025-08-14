import type { IconProps } from './types';

const Alrefresh = (props: IconProps) => {
  const { width = '16', height = '16', className, ...rest } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" fill="#32A071" />
      <g clipPath="url(#clip0_checkmark)">
        <path
          d="M10.5 13.5L8.5 11.5L7.8 12.2L10.5 14.9L16.5 8.9L15.8 8.2L10.5 13.5Z"
          fill="#F2F8FD"
        />
      </g>
      <defs>
        <clipPath id="clip0_checkmark">
          <rect width="12" height="12" fill="white" transform="translate(6 6)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default Alrefresh;
