import { Request, Response } from 'express';
import { MovieService } from '../services/movieService';
import { UserService } from '../services/userService';
import { CreateMovieDTO } from '../DTOs/movieDTO';
import { S3FileManager } from '../shared/external/fileService';
import { FileService } from '../services/fileService';
import { FileEnum } from '../constants/fileEnum';
import { generateRandomString } from '../shared/validators';
import { ListMoviesParams, MulterFiles } from '../@types/custom';

export class MovieController {
  constructor(
    private movieService: MovieService,
    private userService: UserService,
    private s3UploadService: S3FileManager,
    private fileService: FileService,
  ) {}


  list = async (req: Request, res: Response): Promise<Response> => {
    try {
      const ownerId = req.userId;

      const duration = req.query.duration as string | undefined;
      const initial_date = req.query.initial_date as string | undefined;
      const final_date = req.query.final_date as string | undefined;
      const search = req.query.search as string | undefined;
      const genre = req.query.genre as string | undefined;
      const page = req.query.page as string | undefined;
      const limit = req.query.limit as string | undefined;

      if (initial_date && isNaN(Date.parse(initial_date))) {
        return res.status(400).json({ error: 'Invalid initial_date parameter' });
      }
      if (final_date && isNaN(Date.parse(final_date))) {
        return res.status(400).json({ error: 'Invalid final_date parameter' });
      }
      if (duration && isNaN(Number(duration))) {
        return res.status(400).json({ error: 'Invalid duration parameter' });
      }
      if (search && search.length > 100) {
        return res.status(400).json({ error: 'Search term too long' });
      }
      if (page && isNaN(Number(page))) {
        return res.status(400).json({ error: 'Invalid page parameter' });
      }
      if (limit && isNaN(Number(limit))) {
        return res.status(400).json({ error: 'Invalid limit parameter' });
      }

      const params: ListMoviesParams = {
        ownerId: Number(ownerId),
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
      };

    if (duration) params.duration = Number(duration);
    if (initial_date) params.initial_date = new Date(initial_date);
    if (final_date) params.final_date = new Date(final_date);
    if (genre) params.genre = genre;
    if (search) params.search = search;

    const result = await this.movieService.getAll(params);
    
    return res.json(result);;
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching movies', details: (error as Error).message });
    }
  }

  create = async (req: Request, res: Response): Promise<Response> => {
    let uploadedFiles: any = null;

    try {
      const {
        title,
        original_title,
        subtitle,
        director,
        synopsis,
        duration,
        age_rating,
        rating,
        genres,
        release_date,
        language,
        revenue,
        budget,
      } = req.body as CreateMovieDTO;

      const ownerId = req.userId;

      const user = await this.userService.getUserById(Number(ownerId));
      
      if (!user || user.hasErrors()) {
        return res.status(400).json({ error: 'Invalid user' });
      }

      const files = req.files as MulterFiles;

      if (files && (files.poster || files.background || files.trailer)) {
        try {
          uploadedFiles = await this.s3UploadService.uploadMovieFiles({
            poster: files.poster?.[0],
            background: files.background?.[0],
            trailer: files.trailer?.[0],
          });
        } catch (uploadError) {
          return res.status(500).json({ 
            error: 'Error uploading files', 
            details: (uploadError as Error).message 
          });
        }
      }

      const movie = await this.movieService.createMovie({
        title,
        original_title,
        subtitle,
        director,
        synopsis,
        duration,
        rating,
        genres,
        age_rating,
        release_date,
        language,
        revenue,
        budget,
        user,
      });

      if (movie.hasErrors()) {
        if (uploadedFiles) {
          await this.s3UploadService.deleteMovieFiles({
            posterKey: uploadedFiles.posterKey,
            backdropKey: uploadedFiles.backdropKey,
            trailerKey: uploadedFiles.trailerKey,
          });
        }
        return res.status(400).json({ errors: movie.getNotification().getErrors() });
      }

      const fileRecords = [];

      if (uploadedFiles?.posterUrl) {
        const posterFile = await this.fileService.createFile({
          name: generateRandomString(5),
          url: uploadedFiles.posterUrl,
          type: FileEnum.POSTER,
          key: uploadedFiles.posterKey,
          alt_text: `${title} Poster`,
          movie: movie, // Associa ao filme criado
        });

        if (posterFile.hasErrors()) {
          // Rollback: deleta filme e arquivos do S3
          await this.movieService.delete(movie.id!);
          await this.s3UploadService.deleteMovieFiles({
            posterKey: uploadedFiles.posterKey,
            backdropKey: uploadedFiles.backdropKey,
            trailerKey: uploadedFiles.trailerKey,
          });
          return res.status(400).json({ errors: posterFile.getNotification().getErrors() });
        }

        fileRecords.push(posterFile);
      }

      if (uploadedFiles?.backdropUrl) {
        const backdropFile = await this.fileService.createFile({
          name: generateRandomString(5),
          url: uploadedFiles.backdropUrl,
          type: FileEnum.BACKGROUND,
          key: uploadedFiles.backdropKey,
          alt_text: `${title} Backdrop`,
          movie: movie,
        });

        if (backdropFile.hasErrors()) {
          await this.movieService.delete(movie.id!);
          await this.s3UploadService.deleteMovieFiles({
            posterKey: uploadedFiles.posterKey,
            backdropKey: uploadedFiles.backdropKey,
            trailerKey: uploadedFiles.trailerKey,
          });
          return res.status(400).json({ errors: backdropFile.getNotification().getErrors() });
        }

        fileRecords.push(backdropFile);
      }

      if (uploadedFiles?.trailerUrl) {
        const trailerFile = await this.fileService.createFile({
          name: generateRandomString(5),
          url: uploadedFiles.trailerUrl,
          type: FileEnum.TRAILER,
          key: uploadedFiles.trailerKey,
          alt_text: `${title} Trailer`,
          movie: movie,
        });

        if (trailerFile.hasErrors()) {
          await this.movieService.delete(movie.id!);
          await this.s3UploadService.deleteMovieFiles({
            posterKey: uploadedFiles.posterKey,
            backdropKey: uploadedFiles.backdropKey,
            trailerKey: uploadedFiles.trailerKey,
          });
          return res.status(400).json({ errors: trailerFile.getNotification().getErrors() });
        }

        fileRecords.push(trailerFile);
      }

      const movieWithFiles = await this.movieService.getById(movie.id!);

      return res.status(201).json(movieWithFiles);

    } catch (error) {
      if (uploadedFiles) {
        try {
          await this.s3UploadService.deleteMovieFiles({
            posterKey: uploadedFiles.posterKey,
            backdropKey: uploadedFiles.backdropKey,
            trailerKey: uploadedFiles.trailerKey,
          });
        } catch (cleanupError) {
          console.error('Error during cleanup:', cleanupError);
        }
      }

      return res.status(500).json({ error: (error as Error).message });
    }
  }

  getById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID' });
      }
      
      const movie = await this.movieService.getById(Number(id));
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }
      
      return res.json(movie);
    }
    catch (error) {
      return res.status(500).json({ error: (error as Error).message });
    }
  }

  // delete = async (req: Request, res: Response): Promise<Response> => {
  //   try {
  //     const { id } = req.params;
  //     if (isNaN(Number(id))) {
  //       return res.status(400).json({ error: 'Invalid ID' });
  //     }

  //     // Busca o filme para pegar as keys dos arquivos
  //     const movie = await this.movieService.getById(Number(id));
      
  //     if (movie) {
  //       // Deleta os arquivos do S3 antes de deletar o filme
  //       await this.s3UploadService.deleteMovieFiles({
  //         posterKey: movie.posterKey,
  //         backdropKey: movie.backdropKey,
  //         trailerKey: movie.trailerKey,
  //       });
  //     }

  //     await this.movieService.delete(Number(id));

  //     return res.status(204).send();
  //   } catch (error) {
  //     return res.status(500).json({ error: (error as Error).message });
  //   }
  // }

  // update = async (req: Request, res: Response): Promise<Response> => {
  //   try {
  //     const { id } = req.params;
  //     if (isNaN(Number(id))) {
  //       return res.status(400).json({ error: 'Invalid ID' });
  //     }

  //     const movieData = req.body as Partial<CreateMovieDTO>;
  //     const files = req.files as MulterFiles;

  //     // Busca o filme existente
  //     const existingMovie = await this.movieService.getById(Number(id));
  //     if (!existingMovie) {
  //       return res.status(404).json({ error: 'Movie not found' });
  //     }

  //     let uploadedFiles;

  //     // Se houver novos arquivos, faz upload
  //     if (files && (files.poster || files.background || files.trailer)) {
  //       try {
  //         uploadedFiles = await this.s3UploadService.uploadMovieFiles({
  //           poster: files.poster?.[0],
  //           background: files.background?.[0],
  //           trailer: files.trailer?.[0],
  //         });

  //         // Deleta os arquivos antigos
  //         await this.s3UploadService.deleteMovieFiles({
  //           posterKey: files.poster?.[0] ? existingMovie.posterKey : undefined,
  //           backdropKey: files.background?.[0] ? existingMovie.backdropKey : undefined,
  //           trailerKey: files.trailer?.[0] ? existingMovie.trailerKey : undefined,
  //         });
  //       } catch (uploadError) {
  //         return res.status(500).json({ 
  //           error: 'Error uploading files', 
  //           details: (uploadError as Error).message 
  //         });
  //       }
  //     }

  //     // Atualiza o filme
  //     const updatedMovie = await this.movieService.update(Number(id), {
  //       ...movieData,
  //       ...(uploadedFiles?.posterUrl && { posterUrl: uploadedFiles.posterUrl }),
  //       ...(uploadedFiles?.backdropUrl && { backdropUrl: uploadedFiles.backdropUrl }),
  //       ...(uploadedFiles?.trailerUrl && { trailerUrl: uploadedFiles.trailerUrl }),
  //       ...(uploadedFiles?.posterKey && { posterKey: uploadedFiles.posterKey }),
  //       ...(uploadedFiles?.backdropKey && { backdropKey: uploadedFiles.backdropKey }),
  //       ...(uploadedFiles?.trailerKey && { trailerKey: uploadedFiles.trailerKey }),
  //     });

  //     if (updatedMovie.hasErrors()) {
  //       return res.status(400).json({ errors: updatedMovie.getNotification().getErrors() });
  //     }

  //     return res.status(200).json(updatedMovie);
  //   } catch (error) {
  //     return res.status(500).json({ error: (error as Error).message });
  //   }
  // }
}