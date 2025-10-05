import { useMovies } from '../../hooks/useMovies';
import { Card } from '../../components/utils/Card';
import { NotFound } from '../NotFound';
import { Pagination } from '../../components/utils/Pagination';

export function MovieList() {
  const { 
    movies, 
    loading, 
    error, 
    pagination, 
    setPage,
    nextPage,
    prevPage,
  } = useMovies();
  
  if (loading) return <div>Carregando filmes...</div>;
  if (error) return <div>Erro ao carregar filmes: {error.message}</div>;

  return (
<div className="flex-1 w-full flex flex-col items-center gap-[24px]">
  <div className="flex w-[calc(100%-44px)] gap-[24px] flex-wrap bg-dark-alpha-03 p-[24px] max-w-[1366px] xl:mx-auto">
    {movies && movies.length > 0 ? (
      movies.map((movie) => <Card key={movie.id} {...movie} />)
    ) : (
      <NotFound message='Nenhum filme encontrado' />
    )}
  </div>
  <div className='mt-auto mb-[24px]'>
    {movies && movies.length > 0 && (
      <Pagination 
        currentPage={pagination.page} 
        totalPages={pagination.totalPages} 
        onPageChange={setPage}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />
    )}
  </div>
</div>

  );
}