import { useEffect, useState } from "react";
import { Button } from "../../components/utils/Button"
import { SearchBar } from "./SearchBar"
import { CreateForm } from "./CreateForm";
import { Filters } from "../../components/utils/Filters";
import { useMovies } from "../../hooks/useMovies";
import useDebounce from "../../hooks/useDebounce";

export const HeadBar = () => {
    const [showForm, setShowForm] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const { updateSearch } = useMovies();
    const debouncedSearch = useDebounce(searchTerm, 500);

    useEffect(() => {
        updateSearch(debouncedSearch);
    }, [debouncedSearch, updateSearch]);


    return (
        <>
            <div className="relative w-full flex-wrap md:flex-nowrap flex items-center justify-end gap-[10px] p-[24px]">
                <SearchBar
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    type="text"
                    name="search"
                    placeholder="Pesquise por filmes" />
                <div className="flex gap-0.5 sm:gap-[10px] w-full md:w-auto">
                    <Button
                        class="flex-1 md:flex-none"
                        variant="secondary"
                        text="Filtros"
                        onClick={() => setShowFilters(!showFilters)}
                    />
                    <Button
                        class="flex-3 md:flex-none"
                        variant="primary"
                        text="Adicionar filme"
                        onClick={() => setShowForm(!showForm)}
                    />
                </div>
                
                <div
                className={`${showForm || showFilters ? "block" : "hidden"} fixed inset-0 z-[30]
                backdrop-blur-md bg-white/10 dark:bg-black/20`}
                ></div>           
                <aside className={`z-999 overflow-y-auto scroll-thin absolute top-0 right-0 dark:bg-dark-03 bg-[#EEEEF0] flex flex-col p-[16px] max-h-dvh min-w-full sm:min-w-[500px] ${showForm ? "block" : "hidden"}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[24px] text-dark-03 dark:text-dark-11">Adicionar Filme</h3>
                        <button onClick={() => setShowForm(!showForm)}
                            className="relative w-5 h-5 cursor-pointer group">
                            <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                            <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 -rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                        </button>
                    </div>
                    <CreateForm setShow={setShowForm} />
                </aside>
            </div>
            <aside
            className={`z-999 overflow-y-auto scroll-thin fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-[4px]
            dark:bg-dark-03 bg-[#EEEEF0] flex flex-col p-[16px] ${showFilters ? "block" : "hidden"}`}>
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[24px] text-dark-03 dark:text-dark-11">Filtros</h3>
                    <button onClick={() => setShowFilters(!showFilters)}
                        className="relative w-5 h-5 cursor-pointer group">
                        <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                        <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 -rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                    </button>
                </div>
                <Filters setShow={setShowFilters} />
            </aside>

        </>
    )
}