import { FileEnum } from "../constants/fileEnum";
import { Movie } from "../entities/Movie";


export interface CreateFileDTO {
    name: string;
    url: string;
    type: FileEnum;
    key: string;
    alt_text: string;
    movie: Movie;
}
