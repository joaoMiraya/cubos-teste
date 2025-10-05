import React from "react";

interface CircularProgressProps {
  percentage: number; // 0 a 100
  size?: number;      // diâmetro do círculo
  strokeWidth?: number;
  color?: string;     // cor do preenchimento
  bgColor?: string;   // cor do fundo
}

export const Rating: React.FC<CircularProgressProps> = ({
  percentage,
  size = 130,
  strokeWidth = 8,
  color = "#FFE000", 
  bgColor = "#FFFFFF45",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle
          stroke={bgColor}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute flex items-baseline-last font-bold">
       <p className="text-[#FFE000] text-[24px]">{percentage}</p>
       <span className="text-white">%</span>
      </span>
    </div>
  );
};
