import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";
import config from "./config/config";

export const AppDataSource = new DataSource({
    type: config.database.type,
    host: config.database.host,
    port: config.database.port,
    username: config.database.username,
    password: config.database.password,
    database: config.database.database,
    synchronize: true,
    logging: true,
    entities: [User, Movie],
    subscribers: [],
    migrations: [],
})

