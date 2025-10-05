import { useState } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { useMovies } from "../../hooks/useMovies";

interface Props  {
    setShow: (show: boolean) => void;
}

export const Filters = (props: Props) => {
    const { setShow } = props;

      const { setFilters, clearFilters} = useMovies();
      
      const [localFilters, setLocalFilters] = useState({
        initialDate: '',
        finalDate: '',
        genre: '',
        duration: ''
      });
    
      const handleApplyFilters = () => {
        setFilters({
          genre: localFilters.genre || undefined,
          initialDate: localFilters.initialDate || undefined,
          finalDate: localFilters.finalDate || undefined,
          duration: localFilters.duration ? Number(localFilters.duration) : undefined,
        });
      };
    
      const handleClearFilters = () => {
        setLocalFilters({
            genre: '',
            initialDate: '',
            finalDate: '',
            duration: '',
        });
        clearFilters();
        setShow(false);
      };
    

    return(

        <div>
           <form className="flex flex-col gap-[8px]">
                <div>
                    <Input
                            label="Data Inicial"
                            type="date"
                            value={localFilters.initialDate}
                            onChange={(e) => setLocalFilters({ ...localFilters, initialDate: e.target.value })}
                    />
                    <Input 
                            label="Data Final"
                            type="date"
                            value={localFilters.finalDate}
                            onChange={(e) => setLocalFilters({ ...localFilters, finalDate: e.target.value })}
                    />
                    <Input 
                            label="Gênero"
                            type="text"
                            value={localFilters.genre}
                            onChange={(e) => setLocalFilters({ ...localFilters, genre: e.target.value })}
                    />
                    <Input 
                            label="Duração em minutos"    
                            type="text"
                            variant="time"
                            value={localFilters.duration}
                            onChange={(e) => setLocalFilters({ ...localFilters, duration: e.target.value })}
                    />
                </div>
                <div className="flex justify-end gap-[8px] mt-[16px]">
                    <Button onClick={() =>handleClearFilters()} text="Cancelar" variant="secondary" />
                    <Button onClick={() =>handleApplyFilters()} text="Aplicar Filtros" variant="primary" />
                </div>
           </form>
        </div>
    )
}
