import { NestFactory } from '@nestjs/core';
import { SeederService } from './seeder.service';
import { AppModule } from '../../app.module';

async function seedData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app.get(SeederService);

  await seederService.seedData();

  await app.close();
}

seedData();