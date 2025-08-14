import type { IconProps } from './types';

const DeleteIcon = (props: IconProps) => {
  const { width = '25', height = '24', color = 'var(--color-tertiary)' } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none">
      <g clipPath="url(#DeleteIconID)">
        <path
          /* eslint-disable-line */
          d="M16.0869 9V19H8.08691V9H16.0869ZM14.5869 3H9.58691L8.58691 4H5.08691V6H19.0869V4H15.5869L14.5869 3ZM18.0869 7H6.08691V19C6.08691 20.1 6.98691 21 8.08691 21H16.0869C17.1869 21 18.0869 20.1 18.0869 19V7Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="DeleteIconID">
          <rect width="24" height="24" fill="white" transform="translate(0.0869141)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DeleteIcon;
