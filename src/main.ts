import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableShutdownHooks();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => console.error(err));
