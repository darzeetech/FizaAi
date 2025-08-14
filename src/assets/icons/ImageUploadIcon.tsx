import type { IconProps } from './types';

const ImageUploadIcon = (props: IconProps) => {
  const { width = '34', height = '34', color = 'var(--color-primary)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 34 34" fill="none">
      <g clipPath="url(#imageUploadID)">
        <path
          d="M26.9167 9.91683V14.1527C26.9167 14.1527 24.0975 14.1668 24.0833 
          14.1527V9.91683H19.8333C19.8333 9.91683 19.8475 7.09766 19.8333 
          7.0835H24.0833V2.8335H26.9167V7.0835H31.1667V9.91683H26.9167ZM22.6667 
          15.5835V11.3335H18.4167V7.0835H7.08333C5.525 7.0835 4.25 8.3585 4.25 
          9.91683V26.9168C4.25 28.4752 5.525 29.7502 7.08333 29.7502H24.0833C25.6417 
          29.7502 26.9167 28.4752 26.9167 26.9168V15.5835H22.6667ZM7.08333 26.9168L11.3333 
          21.2502L14.1667 25.5002L18.4167 19.8335L24.0833 26.9168H7.08333Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="imageUploadID">
          <rect width="34" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ImageUploadIcon;
