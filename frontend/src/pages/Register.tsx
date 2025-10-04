import { Input } from "../components/utils/Input"
import { Button } from "../components/utils/Button"
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

type ErrorType = {
    id: string;
    message: string;
}

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<ErrorType[]>([]);

    const { isAuthenticated, register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(isAuthenticated) {
            navigate("/");
        }
    }, [isAuthenticated, navigate]);

    const handleValidate = (): boolean => {
        const newErrors: ErrorType[] = [];
        if (name.trim().length < 3) {
            newErrors.push({ 
                id: 'name', 
                message: "O nome deve ter pelo menos 3 caracteres." 
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            newErrors.push({ 
                id: 'email', 
                message: "Digite um e-mail válido." 
            });
        }

        if (password.length < 6) {
            newErrors.push({ 
                id: 'password', 
                message: "A senha deve ter pelo menos 6 caracteres." 
            });
        }

        if (password !== confirmPassword) {
            newErrors.push({ 
                id: 'confirmPassword', 
                message: "As senhas não coincidem." 
            });
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    }


    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!handleValidate()) return;
        try {
            const { success, error } = await register(email, name, password);

            if (!success) {
               return setErrors([{ id: 'form', message: error || 'Erro ao cadastrar.' }]);
            }

            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
        }
    }

    const getError = (fieldId: string): string | undefined => {
        return errors.find(err => err.id === fieldId)?.message;
    }

    return (
        <>
            <div className="min-h-dvh flex flex-col items-center justify-center">
                <form onSubmit={(e) => handleRegister(e)} className="w-full flex items-center justify-center">
                    <div className="flex flex-none order-none grow-0 xs:w-[412px] w-[90%] flex-col gap-[16px] dark:bg-dark-03 bg-[#EEEEF0] p-[16px] rounded-[4px]">
                        <Input
                            label="Nome"
                            name="name"
                            type="text"
                            placeholder="Digite seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {getError('name') && (
                            <span className="text-red-500 text-sm -mt-3">{getError('name')}</span>
                        )}

                        <Input
                            label="E-mail"
                            name="email"
                            type="email"
                            placeholder="Digite seu e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {getError('email') && (
                            <span className="text-red-500 text-sm -mt-3">{getError('email')}</span>
                        )}

                        <Input
                            label="Senha"
                            name="password"
                            type="password"
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {getError('password') && (
                            <span className="text-red-500 text-sm -mt-3">{getError('password')}</span>
                        )}

                        <Input
                            label="Confirmação de senha"
                            name="confirmPassword"
                            type="password"
                            placeholder="Digite sua senha novamente"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {getError('confirmPassword') && (
                            <span className="text-red-500 text-sm -mt-3">{getError('confirmPassword')}</span>
                        )}
                        
                        {getError('form') && (
                            <span className="text-red-500 text-sm -mt-3">{getError('form')}</span>
                        )}

                        <div className="flex items-center justify-end">
                            <Button
                                text="Cadastrar"
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