import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

declare const module: any;

async function bootstrap() {
  const serverConfig = config.get<{ port: number }>('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  logger.warn(`NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
