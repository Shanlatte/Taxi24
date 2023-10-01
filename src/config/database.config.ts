import { registerAs } from "@nestjs/config";
import { config } from 'dotenv';

config();

const configDB = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${parseInt(process.env.DATABASE_PORT, 10)}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
    synchronize: false,
    logging: `${process.env.NODE_ENV}` === 'development',
    migrationsTableName: 'migrations'
}

export default registerAs('database', () => configDB)