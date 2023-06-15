import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ skipUndefinedProperties: true, whitelist: true }),
  );

  //Autorisation cors
  app.enableCors();

  await app.listen(env.NEST_PORT);
}
bootstrap();
