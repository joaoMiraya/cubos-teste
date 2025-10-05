import { SearchIcon } from "../../components/utils/icons/SearchIcon";

interface InputProps {
    type?: string;
    placeholder?: string;
    value?: string;
    label?: string;
    name?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchBar = (props: InputProps) => {

    return (
        
        <div className="relative flex flex-col justify-start dark:text-[#EEEEF0] w-full md:max-w-[488px] text-[#211F26]">
           <label className="text-[12.8px] mb-[8px] font-bold">{props.label}</label>
            <input
                className="focus:border-purple-d-09 dark:focus:caret-purple-d-09 border-[1px] dark:border-[#3C393F] border-[#BCBAC7]  rounded-[4px] dark:bg-dark-02 bg-[#D0CDD7] p-[12px] h-[44px]" 
                {...props}
                />
                <button className="absolute top-1/2 right-[12px] -translate-y-1/2 h-full cursor-pointer">
                    <SearchIcon fill="#B5B2BC" />
                </button>
        </div>
    )
}