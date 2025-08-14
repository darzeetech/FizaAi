export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Accepted':
      return 'var(--color-maroon)';
    case 'Under Cutting':
      return 'var(--color-darkGoldenrod)';
    case 'Under Stitching':
      return 'var(--color-pumpkin)';
    case 'Under Finishing':
      return 'var(--color-denim)';
    case 'Completed':
    case 'Delivered':
      return 'var(--color-green)';
    default:
      return 'var(--color-black)';
  }
};

export const getStatusBackgroundColor = (status: string) => {
  switch (status) {
    case 'Accepted':
      return 'rgba(255, 235, 220, 0.60)';
    case 'Under Cutting':
      return '#FFFBE4;';
    case 'Under Stitching':
      return '#FFF7F0;';
    case 'Under Finishing':
      return 'rgba(110, 98, 244, 0.18)';
    case 'Completed':
      return '#EEF7FF';
    case 'Delivered':
      return '#EEFFEB';
    default:
      return 'var(--color-solitude)';
  }
};
