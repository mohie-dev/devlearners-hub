import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';

const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/migrations/*.js'],
    synchronize: false,
    migrationsTableName: 'migrations',
    ssl: process.env.DATABASE_SSL === 'false' ? false : { rejectUnauthorized: false },
});

export default dataSource;