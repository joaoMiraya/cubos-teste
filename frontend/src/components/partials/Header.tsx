import { Link, useLocation, useNavigate } from "react-router"
import { Logo } from "../utils/Logo"
import { Button } from "../utils/Button"
import { useTheme } from "../../hooks/useTheme";
import { SunIcon } from "../utils/icons/SunIcom";
import { useAuth } from "../../hooks/useAuth";
import { MinLogo } from "../utils/MinLogo";


export const Header = () => {
    const { toggleTheme } = useTheme();
    const { isAuthenticated, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigate = () => {
        if(location.pathname === "/login") {
            return navigate("/register");
        }
        return navigate("/login");
    };

    return (
        <>
            <header className="xs:h-[72px] py-[1rem] px-[16px] flex-wrap flex items-center justify-between dark:bg-[#12111380] border-b-[1px] border-[#F1E6FD30] ">
                <Link className="flex items-center gap-2 group" to="/">
                    <Logo className="xs:flex hidden group-hover:opacity-80" fill="#EEEEF0" width={160} />
                    <MinLogo className=" flex xs:hidden group-hover:opacity-80" fill="#EEEEF0" width={36} />
                    <h1 className="font-bold text-[20px] text-dark-12 group-hover:opacity-80">Movies</h1>
                </Link>
                <div className="flex gap-[16px] ml-[16rem]">
                    <Button 
                        text={<SunIcon fill="#F1DDFFFA"/>}
                        onClick={toggleTheme}
                        variant="secondary"
                    />
                    {(!isAuthenticated && location.pathname !== "/login") &&
                        <Button 
                            text="Entrar"
                            onClick={() => handleNavigate()}
                            variant="primary"
                        />
                    }
                    {(!isAuthenticated && location.pathname === "/login") &&
                        <Button 
                            text="Cadastrar"
                            onClick={() => handleNavigate()}
                            variant="primary"
                        />
                    }
                    {(isAuthenticated) &&
                        <Button 
                            text="Logout"
                            onClick={() => logout()}
                            variant="primary"
                        />
                    }
                </div>
            </header>
        </>
    )
}