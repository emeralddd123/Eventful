import { DataSource } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from 'dotenv'
import { join } from "path";

config()

const configService = new ConfigService()

export default new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: [`${__dirname}/../src/**/*.entity{.ts, .js}`, join(__dirname, '..', '**', '*.entity{.ts,.js}', "dist/entity/**/*.js"), // Look for entities in subfolders of the parent folder
    join(__dirname, '..', '..', '*.entity{.ts,.js}'),],
    synchronize: configService.get('NODE_ENV') === 'developmen',
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [`${__dirname}/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
})