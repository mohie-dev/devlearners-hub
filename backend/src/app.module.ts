import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService, } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions, } from '@nestjs/typeorm';
import Joi from 'joi';
import databaseConfig from './config/db.config.js';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { TaskProgressModule } from './modules/task-progress/task-progress.module.js';
import { TasksModule } from './modules/tasks/tasks.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { SubjectsModule } from './modules/subjects/subjects.module.js';
import { UsersModule } from './modules/users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        API_PREFIX: Joi.string().default('api/v1'),
        DATABASE_URL: Joi.string().required(),
        DATABASE_SSL: Joi.boolean().default(true),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.getOrThrow<TypeOrmModuleOptions>(
          'database',
        ),
    }),
    UsersModule,
    SubjectsModule,
    ContentModule,
    TasksModule,
    TaskProgressModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule { }