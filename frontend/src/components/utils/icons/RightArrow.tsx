
interface IconProps {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const RightArrowIcon: React.FC<IconProps> = ({
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
      <path d="M9 6L15 12L9 18" stroke={fill} strokeWidth="2"/>
    </svg>
  );
};