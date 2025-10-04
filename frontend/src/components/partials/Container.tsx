import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="relative dark:bg-dark-01 dark:text-dark-11 text-gray-11 bg-gray-01 min-h-screen
        bg-[url('/background.png')] bg-cover bg-center">
      
      <div className="absolute inset-0 bg-gradient-to-t dark:from-black dark:via-black/90 dark:to-black/90 from-black via-gray-alpha-11 to-gray-alpha-12"></div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
