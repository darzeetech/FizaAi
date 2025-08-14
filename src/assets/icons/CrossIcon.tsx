const CrossIcon = (props: any) => {
  const { width = '16px', height = '16px', color = 'var(--color-black)' } = props;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      stroke={color}
      strokeWidth="2"
      fill="none"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export default CrossIcon;
