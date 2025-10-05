import { Router } from 'express';
import { UserService } from '../services/userService';
import { MovieController } from '../controllers/movieController';
import { MovieService } from '../services/movieService';
import { S3FileManager } from '../shared/external/fileService';
import { FileService } from '../services/fileService';
import { uploadFields } from '../middlewares/file.middleware';

const movieRouter = Router();
const userService = new UserService();
const movieService = new MovieService();
const s3Service = new S3FileManager();
const fileService = new FileService();
const movieController = new MovieController(movieService, userService, s3Service, fileService);



movieRouter.get('/', movieController.list);
movieRouter.get('/:id', movieController.getById);
movieRouter.put('/:id', movieController.update);
movieRouter.delete('/:id', movieController.delete);
movieRouter.post('/', uploadFields, movieController.create);

export default movieRouter;