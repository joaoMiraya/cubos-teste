import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";
import config from "./config/config";
import { Rating } from "./entities/Rating";
import { Image } from "./entities/Image";
import { Category } from "./entities/Category";

export const AppDataSource = new DataSource({
    type: config.database.type,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: false,
    logging: true,
    entities: [User, Movie, Category, Image, Rating],
    subscribers: [],
    migrations: ["src/migrations/*.ts"],
})

