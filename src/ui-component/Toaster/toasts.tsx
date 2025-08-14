import { toast } from 'react-toastify';

type ToastType = 'info' | 'success' | 'warning' | 'error';

export const toasts = (toastType: ToastType, message: string, toastId: string) => {
  switch (toastType) {
    case 'success':
      toast.success(message, { toastId });
      break;
    case 'info':
      toast.info(message, { toastId });
      break;
    case 'warning':
      toast.warning(message, { toastId });
      break;
    case 'error':
      toast.error(message, { toastId });
      break;
    default:
      break;
  }
};
