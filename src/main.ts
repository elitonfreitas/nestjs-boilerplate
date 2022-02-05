import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './commons/filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpHostAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpHostAdapter));
  app.setGlobalPrefix('api');
  app.use(morgan('short'));

  await app.listen(3000);
}

bootstrap();
