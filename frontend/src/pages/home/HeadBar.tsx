import { Button } from "../../components/utils/Button"
import { Input } from "../../components/utils/Input"


export const HeadBar = () => {
    return (
        <div className="w-full flex items-center justify-end gap-[10px]">
            <Input />
            <Button 
                variant="secondary"
                text="Filtros" />
            <Button
                variant="primary"
                text="Adicionar filme" />
        </div>
    )
}