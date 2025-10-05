import { UpdateResult } from "typeorm";
import { IFileRepository } from "../interfaces/IFileRepository";
import { FileRepository } from "../repositories/fileRepository";
import { File } from '../entities/File';
import { CreateFileDTO } from "../DTOs/fileDTO";

export class FileService {
  private fileRepository: IFileRepository;

  constructor(fileRepository?: IFileRepository) {
    this.fileRepository = fileRepository || new FileRepository();
  }

  async createFile(data: CreateFileDTO): Promise<File> {

    const file = await this.fileRepository.create(data);
    if (file.hasErrors()) {
      return file;
    }

    await this.fileRepository.save(file);
    return file;
  }

  async updateMovie(id:number, data: Partial<File>): Promise<UpdateResult | File> {

     const file = await this.fileRepository.update(id, data);
    if (!file) {
      return File.createWithError('File not found');
    }

    return file;
  }
    
}