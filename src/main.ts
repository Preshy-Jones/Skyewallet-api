import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: [
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://skyewallet-frontend.herokuapp.com',
    ],
  });
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
