interface DoubleArrowLogoProps {
  className?: string;
}

const DevDashboardSvg = ({ className = 'h-5 w-5' }: DoubleArrowLogoProps) => {
  return (
    <svg
      className={className}
      viewBox="0 0 103 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0H21L71 50L21 100H0L50 50L0 0Z" fill="#F4A274" />
      <path d="M32 0H53L103 50L53 100H32L82 50L32 0Z" fill="#E76E3C" />
    </svg>
  );
};

export default DevDashboardSvg;
