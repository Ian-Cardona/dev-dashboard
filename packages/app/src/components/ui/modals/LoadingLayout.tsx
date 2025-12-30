import { motion } from 'framer-motion';

export const LoadingLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center">
        <motion.div
          className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-primary)]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <img src="/devdashboard.svg" alt="DevDB" className="h-8 w-8" />
        </motion.div>
        <p className="mt-6 text-base text-[var(--color-accent)]">Loading...</p>
      </div>
    </div>
  );
};
