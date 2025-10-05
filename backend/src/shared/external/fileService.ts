import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import config from '../../config/config';

interface UploadFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

interface UploadOptions {
  folder?: string;
  makePublic?: boolean;
  contentType?: string;
}

interface MovieFilesUploadResult {
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  posterKey?: string;
  backdropKey?: string;
  trailerKey?: string;
}

export class S3FileManager {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.region = config.aws.region || 'us-east-1';
    this.bucketName = config.aws.bucketName || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId || '',
        secretAccessKey: config.aws.secretAccessKey || '',
      },
    });
  }

  /**
   * Faz upload de um arquivo para o S3
   */
  async uploadFile(
    file: UploadFile,
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const { folder = 'uploads', makePublic = false, contentType } = options;

    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const key = folder ? `${folder}/${fileName}` : fileName;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: contentType || file.mimetype,
    });

    await this.s3Client.send(command);

    const url = this.getFileUrl(key, makePublic);

    return {
      key,
      url,
      bucket: this.bucketName,
    };
  }

  /**
   * Faz upload dos arquivos de um filme (poster, background, trailer)
   */
  async uploadMovieFiles(files: {
    poster?: UploadFile;
    background?: UploadFile;
    trailer?: UploadFile;
  }): Promise<MovieFilesUploadResult> {
    const result: MovieFilesUploadResult = {};

    try {
      // Upload do poster
      if (files.poster) {
        const posterResult = await this.uploadFile(files.poster, {
          folder: 'movies/posters',
          makePublic: true,
        });
        result.posterUrl = posterResult.url;
        result.posterKey = posterResult.key;
      }

      // Upload do background
      if (files.background) {
        const backdropResult = await this.uploadFile(files.background, {
          folder: 'movies/backdrops',
          makePublic: true,
        });
        result.backdropUrl = backdropResult.url;
        result.backdropKey = backdropResult.key;
      }

      // Upload do trailer
      if (files.trailer) {
        const trailerResult = await this.uploadFile(files.trailer, {
          folder: 'movies/trailers',
          makePublic: true,
        });
        result.trailerUrl = trailerResult.url;
        result.trailerKey = trailerResult.key;
      }

      return result;
    } catch (error) {
      // Se houver erro, tenta fazer cleanup dos arquivos já enviados
      await this.cleanupMovieFiles(result);
      throw error;
    }
  }

  /**
   * Deleta um arquivo do S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Deleta múltiplos arquivos
   */
  async deleteMultipleFiles(keys: string[]): Promise<void> {
    const deletePromises = keys.map((key) => this.deleteFile(key));
    await Promise.all(deletePromises);
  }

  /**
   * Deleta os arquivos de um filme
   */
  async deleteMovieFiles(keys: {
    posterKey?: string;
    backdropKey?: string;
    trailerKey?: string;
  }): Promise<void> {
    const keysToDelete = [
      keys.posterKey,
      keys.backdropKey,
      keys.trailerKey,
    ].filter((key): key is string => !!key);

    if (keysToDelete.length > 0) {
      await this.deleteMultipleFiles(keysToDelete);
    }
  }

  /**
   * Faz cleanup de arquivos parcialmente enviados em caso de erro
   */
  private async cleanupMovieFiles(
    uploadedFiles: MovieFilesUploadResult
  ): Promise<void> {
    try {
      await this.deleteMovieFiles({
        posterKey: uploadedFiles.posterKey,
        backdropKey: uploadedFiles.backdropKey,
        trailerKey: uploadedFiles.trailerKey,
      });
    } catch (error) {
      console.error('Erro ao fazer cleanup dos arquivos:', error);
    }
  }

  /**
   * Gera a URL do arquivo
   */
  private getFileUrl(key: string, isPublic: boolean): string {
    if (isPublic) {
      return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }
    return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

export default new S3FileManager();