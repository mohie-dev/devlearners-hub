import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs(
    'database',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        url: process.env.DATABASE_URL,
        autoLoadEntities: true,
        synchronize: false,
        ssl:
            process.env.DATABASE_SSL === 'false'
                ? false
                : { rejectUnauthorized: false },
    }),
);