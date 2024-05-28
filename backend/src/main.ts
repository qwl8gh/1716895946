import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors({
    origin: `http://${process.env.VUE_APP_IP}:${process.env.VUE_APP_CLIENT_PORT}`,
    credentials: true,
  }));
  await app.listen(process.env.VUE_APP_SERVER_PORT || 3000);
}
bootstrap();