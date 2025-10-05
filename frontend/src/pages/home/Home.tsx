import { MovieProvider } from "../../context/movieContext"
import { HeadBar } from "./HeadBar"
import { MovieList } from "./MovieList"

export const Home = () => {
    return (
        <MovieProvider>
            <div className="flex flex-col items-center">
                <HeadBar />
                <MovieList />
            </div>
        </MovieProvider>
    )
}