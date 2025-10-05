


export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t-[1px] border-[#F1E6FD30] h-[68px] flex items-center justify-center text-[1rem] dark:bg-dark-01 dark:text-dark-11 text-gray-11 bg-gray-01">
            <p>{currentYear} © Todos os direitos reservados a <strong className="font-semibold"> Cubos Movies</strong></p>
        </footer>
    )
}