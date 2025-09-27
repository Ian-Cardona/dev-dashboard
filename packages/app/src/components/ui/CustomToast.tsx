import { ToastContainer } from 'react-toastify';

const CustomToast = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      closeOnClick
      pauseOnHover
      closeButton={false}
      hideProgressBar
      toastClassName={() => `
        bg-[var(--color-surface)] border border-[var(--color-fg)]
        text-[var(--color-fg)] rounded-4xl p-4 text-sm font-medium
        shadow-lg mb-2 flex items-center gap-2 justify-between overflow-hidden
        cursor-pointer
      `}
    />
  );
};

export default CustomToast;
