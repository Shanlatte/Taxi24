import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.PORT),
      password: process.env.DATABASE_PASSWORD,
      username: process.env.DATABASE_USERNAME,
      database: process.env.DATABASE_NAME,
      entities: [],
      synchronize: true,
      logging: true,
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
