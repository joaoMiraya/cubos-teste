import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Movie } from "./entities/Movie";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "cubos_user",
    password: "password",
    database: "cubos_db",
    synchronize: true,
    logging: true,
    entities: [User, Movie],
    subscribers: [],
    migrations: [],
})

