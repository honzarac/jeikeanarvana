import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import {expressEngine} from "onca";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
      {
        logger: ['log', 'debug', 'error', 'verbose', 'warn']
      }
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('art');
  app.engine('art', expressEngine);
  app.set('view options', { debug: process.env.NODE_ENV !== 'production' });

  await app.listen(3000);
}
bootstrap();
