
interface IconProps {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const LeftArrowIcon: React.FC<IconProps> = ({
  className,
  fill = "#121113",
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
      <path d="M15 6L9 12L15 18" stroke={fill} strokeWidth="2"/>
    </svg>
  );
};