import React, { useState } from "react";

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    label?: string;
    name?: string;
    className?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    variant?: 'currency' | 'time';
}

export const Input = (props: InputProps) => {
    const [internalValue, setInternalValue] = useState(props.value || "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (props.variant === "currency") {
            const numericValue = value.replace(/\D/g, '');
            const formatted = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(Number(numericValue) / 100);
            setInternalValue(formatted);
            if (props.onChange) {
                props.onChange({ ...e, target: { ...e.target, value: formatted } });
            }
        } else if (props.variant === "time") {

            const numericValue = value.replace(/\D/g, '');
            setInternalValue(numericValue);
            if (props.onChange) {
                props.onChange({ ...e, target: { ...e.target, value: numericValue } });
            }
        } else {
            setInternalValue(value);
            if (props.onChange) props.onChange(e);
        }
    };

    return (
        <div className={`flex flex-col justify-start dark:text-[#EEEEF0] text-[#211F26] ${props.className}`}>
            {props.label && <label className="text-[12.8px] mb-[8px] font-bold">{props.label}</label>}
            <input
                className="focus:border-purple-d-09 dark:focus:caret-purple-d-09 border-[1px] dark:border-[#3C393F] border-[#BCBAC7] rounded-[4px] dark:bg-dark-02 bg-[#D0CDD7] p-[12px] h-[40px]" 
                {...props}
                value={internalValue}
                onChange={handleChange}
            />
        </div>
    );
};
