import { motion } from 'framer-motion';

interface FeatureNodeProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  delay: number;
  index: number;
}

const FeatureNode = ({
  icon: Icon,
  title,
  subtitle,
  delay,
}: FeatureNodeProps) => (
  <motion.div
    className="group flex items-start gap-5 rounded-2xl border border-[var(--color-accent)]/15 bg-[var(--color-surface)] p-5 transition-all duration-300 hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface)]/95"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      delay,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
    whileHover={{
      y: -2,
      transition: { duration: 0.2, ease: 'easeOut' },
    }}
  >
    <motion.div
      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--color-accent)]/10 bg-[var(--color-bg)] transition-all duration-300 group-hover:border-[var(--color-primary)]/20 group-hover:bg-[var(--color-primary)]/5"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: delay + 0.1,
        duration: 0.4,
        ease: 'easeOut',
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.15, ease: 'easeOut' },
      }}
    >
      <Icon className="h-6 w-6 text-[var(--color-primary)] transition-colors duration-300 group-hover:text-[var(--color-primary)]" />
    </motion.div>
    <div className="flex-1 pt-1">
      <h3 className="text-base font-semibold text-[var(--color-fg)] transition-colors duration-300 group-hover:text-[var(--color-primary)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-accent)]">
        {subtitle}
      </p>
    </div>
  </motion.div>
);

export default FeatureNode;
