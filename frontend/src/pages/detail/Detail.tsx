import { useParams, useNavigate } from 'react-router';
import { useMovies } from "../../hooks/useMovies";
import { useEffect, useState } from "react";
import type { MovieType } from "../../types/movie.types";
import { Button } from "../../components/utils/Button";
import { Rating } from "../../components/utils/Rating";
import { EditForm } from "../home/EditForm";

export const Detail = () => {
    const { id } = useParams<{ id: string }>();
    const {getById, loading, error, deleteMovie, refetch} = useMovies();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const [files, setFiles] = useState<{[key: string]: string}>({});
    const [openEdit, setOpenEdit] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        getById(Number(id)).then((data) => {
             setMovie(data);
             if(data) {
                const fileMap: {[key: string]: string} = {};
                data.files.forEach(file => {
                    fileMap[file.type] = file.url;
                });
                setFiles(fileMap);
             }
        }).catch((err) => {
            console.error(err);
        });
    }, [getById, id]);

    const handleDelete = () => {
        if(!movie) return;
        deleteMovie(movie.id).then(() => {
            refetch()
            navigate('/');
        }).catch((err) => {
            console.error(err);
            alert('Erro ao deletar filme.');
        });
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error: {error.message}</div>;
    if(!movie) return <div>No movie found</div>;

    function formatMinutes(minutes: number): string {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) return `${remainingMinutes}m`;
        if (remainingMinutes === 0) return `${hours}h`;
        return `${hours}h ${remainingMinutes}m`;
    }  

    function formatCurrency(value: number): string {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(value % 1_000_000_000 === 0 ? 0 : 1)}b`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}m`;
        } else if (value >= 1_000) {
            return `${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}k`;
        }
        return value.toString();
    }

    return (
        <div className="p-[32px] w-full">
            <div className="relative bg-dark-01 p-[32px] flex w-full">
                <img className=" absolute inset-0 w-full h-full object-cover max-h-[90%] opacity-20 z-10 invisible md:visible" src={files['background']} alt="" />
                <div className="w-full z-30 flex sm:flex-col flex-wrap">
                    <div className="mb-[8px] hidden  sm:flex sm:justify-between justify-center w-full flex-wrap items-center">
                        <div className="flex flex-col gap-[4px]">
                            <h1 className="text-4xl font-bold drop-shadow-2xl">{movie?.title}</h1>
                            <p className="drop-shadow-2xl">{movie?.subtitle}</p>
                        </div>
                        <div className="flex gap-[8px] w-full sm:w-fit py-[8px]">
                            <Button
                                text="Deletar"
                                variant="secondary"
                                class="flex-1 sm:flex-0"
                                onClick={handleDelete}
                            />
                            <Button
                                onClick={() => setOpenEdit(true)}
                                text="Editar"
                                variant="primary"
                                class="flex-2 sm:flex-0"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between flex-wrap z-20 text-[#FFF] w-full">
                        <img className="max-h-[540px] rounded-[4px]" src={files['poster']} alt={movie?.title} />
                        <div className=" p-[16px] flex flex-col gap-[8px] justify-around">
                            <p className="max-w-[200px] text-center">Dirigido por <strong className="text-purple-11">{movie.director}</strong></p>
                            <div className="bg-[#23222599] p-[16px] rounded-[4px] ">
                                <p>{movie?.synopsis}</p>
                            </div>
                            <div className="bg-[#23222599] p-[16px] flex flex-col gap-[8px] rounded-[4px] ">
                                <h3 className="font-bold text-[#B5B2BC]">Generos</h3>
                                <div className="flex flex-wrap gap-[8px]">
                                    {movie.genres.split(',').map((genre) => (
                                            <span key={genre} className="inline-block bg-[#C150FF2E] text-[#ECD9FA] rounded-[2px] p-[8px] py-1 text-sm font-semibold">{genre.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mb-[8px] flex sm:hidden py-[16px] sm:justify-between justify-center w-full flex-wrap items-center">
                            <div className="flex flex-col gap-[4px]">
                                <h1 className="text-4xl font-bold drop-shadow-2xl">{movie?.title}</h1>
                                <p className="drop-shadow-2xl">{movie?.subtitle}</p>
                            </div>
                            <div className="flex gap-[8px] w-full sm:w-fit py-[8px]">
                                <Button
                                    text="Deletar"
                                    variant="secondary"
                                    class="flex-1 sm:flex-0"
                                />
                                <Button
                                    text="Editar"
                                    variant="primary"
                                    class="flex-2 sm:flex-0"
                                />
                            </div>
                        </div>
                        <div className=" p-[16px] flex flex-col gap-[8px] justify-around ">
                           <div className="flex justify-center gap-[8px] sm:gap-[16px] flex-wrap">
                                <div className="bg-[#23222599] p-[16px] rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">CLASSIFICAÇÃO INDICATIVA</p>
                                    <p>{movie?.age_rating} anos</p>
                                </div>
                                <Rating percentage={movie?.rating} size={90} strokeWidth={6}/>
                            </div>

                           <div className="flex flex-wrap gap-[8px] sm:gap-[16px]">
                                <div className="bg-[#23222599] p-[16px] rounded-[4px] flex-1 flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">LANÇAMENTO</p>
                                    <p>{new Date(movie?.release_date).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-[#23222599] p-[16px] flex-1 rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">DURAÇÃO</p>
                                    <p>{formatMinutes(Number(movie?.duration))}</p>
                                </div>
                            </div>

                           <div className="flex flex-wrap gap-[8px] sm:gap-[16px]">
                                <div className="bg-[#23222599] flex-1 p-[16px] rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">SITUAÇÃO</p>
                                    <p>{new Date(movie?.release_date).toLocaleDateString() < new Date().toLocaleDateString() ? 'Lançado' : 'Em breve'}</p>
                                </div>
                                <div className="bg-[#23222599] p-[16px] flex-1 rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">IDIOMA</p>
                                    <p>{movie?.language}</p>
                                </div>
                            </div>

                           <div className="flex flex-wrap gap-[8px] sm:gap-[16px]">
                                <div className="bg-[#23222599] flex-1 p-[16px] rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">ORÇAMENTO</p>
                                    <p>{formatCurrency(movie?.budget)}</p>
                                </div>
                                <div className="bg-[#23222599] p-[16px] flex-1 rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">RECEITA</p>
                                    <p>{formatCurrency(movie?.revenue)}</p>
                                </div>
                                <div className="bg-[#23222599] p-[16px] flex-1 rounded-[4px] flex flex-col gap-[8px]">
                                    <p className="font-bold text-[#B5B2BC]">LUCRO</p>
                                    <p>{formatCurrency(movie?.revenue - movie?.budget)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                className={`${openEdit ? "block" : "hidden"} fixed inset-0 z-[30]
                backdrop-blur-md bg-white/10 dark:bg-black/20`}
                ></div>           
                <aside className={`z-999 overflow-y-auto scroll-thin absolute top-0 right-0 dark:bg-dark-03 bg-[#EEEEF0] flex flex-col p-[16px] max-h-dvh min-w-full sm:min-w-[500px] 
                        ${openEdit ? "block" : "hidden"}`}>
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[24px] text-dark-03 dark:text-dark-11">Editar Filme</h3>
                        <button onClick={() => setOpenEdit(!openEdit)}
                            className="relative w-5 h-5 cursor-pointer group">
                            <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                            <span className="absolute left-0 top-1/2 block h-[2px] w-full bg-gray-800 dark:bg-gray-200 -rotate-45 transition-transform duration-200 group-hover:opacity-80"></span>
                        </button>
                    </div>
                        <EditForm setShow={setOpenEdit} movie={movie} />
                </aside>
            </div>
            <div className="w-full aspect-video mt-[32px]">
                <h3 className="font-bold text-[#FFF]">Trailer</h3>
                <iframe className="w-full h-full" src={files['trailer']} title="Trailer" allowFullScreen />
            </div>
        </div>
    );
};