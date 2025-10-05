import { File } from '../entities/File';


export interface IFileRepository {
  create(userData: Partial<File>): Promise<File>;
  update(id: number, userData: Partial<File>): Promise<import("typeorm").UpdateResult>;
  save(user: File): Promise<File>;
}