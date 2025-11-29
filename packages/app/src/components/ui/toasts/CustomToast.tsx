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
        bg-[var(--color-surface)] border border-[var(--color-accent)]/20
        text-[var(--color-fg)] rounded-lg p-4 text-sm font-medium
        shadow-lg mb-2 flex items-center gap-3 justify-between overflow-hidden
        cursor-pointer
      `}
      progressClassName={() => 'bg-[var(--color-primary)]'}
    />
  );
};

export default CustomToast;
