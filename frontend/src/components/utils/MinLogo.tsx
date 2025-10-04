
interface LogotypeProps {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}

export const MinLogo: React.FC<LogotypeProps> = ({
  className,
  fill = "#EEEEF0",
  width = 36,
  height = 35,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 36 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
        <path d="M2.8129 8.04774C2.8129 5.32247 5.09492 3.10528 7.89986 3.10528H27.7406C30.5457 3.10528 32.8276 5.32247 32.8276 8.04774V27.325C32.8276 30.0502 30.5457 32.2674 27.7406 32.2674H7.89986C5.09492 32.2674 2.8129 30.0502 2.8129 27.325V8.04774ZM7.89986 35H27.7406C32.0967 35 35.6406 31.5573 35.6406 27.325V8.04774C35.6406 3.81546 32.0967 0.372299 27.7406 0.372299H7.89986C3.54383 0.372299 0 3.81546 0 8.04774V27.325C0 31.5573 3.54383 35 7.89986 35Z" fill={fill}/>
    </svg>
  );
};