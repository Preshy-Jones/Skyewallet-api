import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: 'https://skyewalletapi.herokuapp.com',
  });
  await app.listen(process.env.PORT || 3002);
}
bootstrap();
