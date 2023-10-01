import { registerAs } from "@nestjs/config";

const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: `${parseInt(process.env.DATABASE_PORT, 10)}`,
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
    migrations: [`${__dirname}/../db/migrations/*{.ts,.js}`],
    synchronize: `${process.env.NODE_ENV}` === 'development',
    logging: false,
    migrationsTableName: 'migrations'
}

export default registerAs('database', () => config)