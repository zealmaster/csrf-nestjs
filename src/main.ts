import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.CSRF_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 60 * 2 * 1000, //The lifetime of the stored secret code
      },
    }),
  )
  await app.listen(3000);
}
bootstrap();
