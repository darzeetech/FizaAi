import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toaster = () => {
  return (
    <ToastContainer
      position="bottom-center"
      containerId={'toastContainer'}
      autoClose={3000}
      closeButton={true}
      icon={true}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      limit={5}
      theme="colored"
    />
  );
};

export default Toaster;
