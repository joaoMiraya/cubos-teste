
interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    label?: string;
    name?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = (props: InputProps) => {

    return (
        <div className="flex flex-col gap-[8px] justify-start dark:text-[#EEEEF0] text-[#211F26]">
            <label className="text-[12.8px] font-bold">{props.label}</label>
            <input
                className="focus:border-purple-d-09 dark:focus:caret-purple-d-09 border-[1px] dark:border-[#3C393F] border-[#BCBAC7]  rounded-[4px] dark:bg-dark-02 bg-[#D0CDD7] p-[12px] h-[40px]" 
                {...props}
            />
        </div>
    )
}