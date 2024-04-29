import { registerAs } from "@nestjs/config";
import { join } from "path";

export default registerAs('database', () => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [`${__dirname}/../**/*.entity{.ts, .js}`, join(__dirname, '..', '**', '*.entity{.ts,.js}', "dist/entity/**/*.js"), // Look for entities in subfolders of the parent folder
    join(__dirname, '..', '..', '*.entity{.ts,.js}'),],
    synchronize: process.env.NODE_ENV === 'developmen',
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
    autoLoadEntities: true,
}))
