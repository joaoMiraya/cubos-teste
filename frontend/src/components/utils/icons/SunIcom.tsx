
interface IconProps {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const SunIcon: React.FC<IconProps> = ({
  className,
  fill = "#EEEEF0",
  width = 24,
  height = 24,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
        <circle cx="12" cy="12" r="4" fill={fill}/>
        <path d="M12 5V3" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M12 21V19" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M16.95 7.04996L18.3643 5.63574" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M5.63608 18.3644L7.05029 16.9502" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 12L21 12" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M3 12L5 12" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M16.95 16.95L18.3643 18.3643" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
        <path d="M5.63608 5.63559L7.05029 7.0498" stroke={fill}strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
};