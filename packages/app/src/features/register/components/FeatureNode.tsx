import { motion } from 'framer-motion';

interface FeatureNodeProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  delay: number;
}

const FeatureNode = ({
  icon: Icon,
  title,
  subtitle,
  delay,
}: FeatureNodeProps) => (
  <motion.div
    className="flex items-center gap-6 rounded-4xl border bg-[var(--color-surface)] p-6"
    initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
    transition={{
      delay,
      duration: 0.4,
      type: 'keyframes',
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    whileHover={{
      scale: 1.02,
      y: -2,
      transition: { duration: 0.15, ease: 'easeOut' },
    }}
  >
    <motion.div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border bg-[var(--color-bg)]"
      whileHover={{
        scale: 1.1,
        rotate: 5,
        transition: { duration: 0.2, ease: 'easeOut' },
      }}
    >
      <Icon className="h-6 w-6 text-[var(--color-primary)]" />
    </motion.div>
    <div className="flex-1">
      <p className="text-base font-semibold text-[var(--color-fg)]">{title}</p>
      <p className="mt-1 text-sm text-[var(--color-accent)]">{subtitle}</p>
    </div>
  </motion.div>
);

export default FeatureNode;
