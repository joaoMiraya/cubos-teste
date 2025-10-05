import { Repository, UpdateResult } from 'typeorm';
import { AppDataSource } from '../data-source';
import { IFileRepository } from '../interfaces/IFileRepository';
import { File } from '../entities/File';
import { CreateFileDTO } from '../DTOs/fileDTO';

export class FileRepository implements IFileRepository {
    private repository: Repository<File>;

    constructor() {
        this.repository = AppDataSource.getRepository(File);
    }

    async create(fileData: CreateFileDTO): Promise<File> {
        const file = this.repository.create(fileData);
        
        file.validate();
        if (file.hasErrors()) {
            return file;
        }

        return file;
    }

    async update(id: number, fileData: Partial<File>): Promise<UpdateResult> {
        return this.repository.update({ id }, fileData);
    }

    async save(file: File): Promise<File> {
        return await this.repository.save(file);
    }
}