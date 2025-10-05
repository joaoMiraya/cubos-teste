interface SelectProps {
    label?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    options: { value: string; label: string }[];
}

export const Select = (props: SelectProps) => {
    const { label, options, className, ...rest } = props;

    return (
        <div className={`flex flex-col justify-start dark:text-[#EEEEF0] text-[#211F26] ${className}`}>
            {label && <label className="text-[12.8px] mb-[8px] font-bold">{label}</label>}

            <select
                className="focus:border-purple-d-09 dark:focus:caret-purple-d-09 border-[1px] dark:border-[#3C393F] border-[#BCBAC7] rounded-[4px] dark:bg-dark-02 bg-[#D0CDD7] px-[12px] h-[40px]"
                {...rest}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
