import { Link } from "react-router";

interface Props {
    message?: string;
}

export const NotFound = ({ message }: Props) => {
    return (
        <div className="w-dvw h-auto flex flex-col items-center justify-center gap-4">
            {!message &&
                <>
                    <h2 className="text-[32px] font-bold">Página não encontrada</h2>
                    <Link to="/" className="text-purple-d-09 underline">Voltar para a página inicial</Link>
                </>
            }
            {message && 
                <>
                    <p className="text-[16px] text-gray-600">{message}</p>
                    <p className="text-[14px] text-gray-500">Por favor, tente novamente mais tarde.</p>
                </>
            }
        </div>
    )
}   