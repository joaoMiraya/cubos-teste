import { Link, useNavigate } from "react-router"
import { Input } from "../components/utils/Input"
import { Button } from "../components/utils/Button"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if(password.length >= 6 && email.length >= 3) {
            return setDisabled(false);
        }
        return setDisabled(true);
    }, [email, password]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(disabled) return;
        
        try {
            const { success } = await login(email, password);
            
            if(!success) {
                setError("Usuário ou senha inválidos");
                return;
            }
            navigate("/");
        } catch (error) {
            console.error("Erro no login:", error);
        }
    }

    return (
        <>
            <div className="min-h-dvh flex flex-col items-center justify-center w-full ">
                <form onSubmit={(e) => handleLogin(e)} className="w-full flex items-center justify-center">
                    <div className="flex flex-none order-none grow-0 xs:w-[412px] w-[90%] flex-col gap-[16px] dark:bg-dark-03 bg-[#EEEEF0] p-[16px] rounded-[4px]">
                            <Input
                                label="Nome/E-mail"
                                name="email"
                                type="text"
                                placeholder="Digite seu nome/E-mail"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <Input
                                label="Senha"
                                name="password"
                                type="password"
                                placeholder="Digite sua senha"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="text-red-700 text-sm">{error}</p>}
                            <div className="flex xs:flex-row flex-col justify-center xs:items-center xs:justify-between  gap-[8px]">
                                <Link to="/forgot-password" className="text-purple-d-09 underline">Esqueci minha senha</Link>
                                <Button
                                    disabled={disabled}
                                    text="Entrar"
                                    variant="primary"
                                    type="submit"
                                />
                            </div>

                    </div>
                </form>
            </div>
        </>
    )
}
