import { HeadBar } from "./HeadBar"
import { MovieList } from "./MovieList"

export const Home = () => {
    return (
        <div className="flex flex-col items-center">
            <HeadBar />
            <MovieList />
        </div>
    )
}