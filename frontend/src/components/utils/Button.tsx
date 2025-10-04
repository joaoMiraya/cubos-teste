import type React from "react";

interface ButtonProps {
    text: string | React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export const Button = (props: ButtonProps) => {

    return (
        <button
            type={props.type || "button"}
            disabled={props.disabled}
            className={`
                min-w-[64px] min-h-[44px] p-[10px] flex items-center justify-center
                rounded-[2px] transition-colors text-[16px] font-normal text-[#FFFFFF]
                ${props.disabled ? "bg-dark-09 cursor-not-allowed" : props.variant === "primary"
                ? "bg-purple-d-09 hover:bg-purple-d-10 cursor-pointer"
                : "dark:bg-purple-da-02 bg-purple-12 dark:hover:bg-[#C150FF2E] hover:bg-purple-11 cursor-pointer"}
            `}
            onClick={props.onClick}
            >
            {props.text}
        </button>
    )
}