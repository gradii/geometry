import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WsAdapter } from '@nestjs/platform-ws';

import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { requestIdMiddleware } from './app/middleware/request-id.middleware';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as basicAuth from 'express-basic-auth';
import { environment } from './environments/environment';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');

  const globalPrefix = 'api';

  //app config
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  app.use(requestIdMiddleware());

  app.useWebSocketAdapter(new WsAdapter(app));

  // app.useGlobalFilters(new AllExceptionsFilter());
  // app.useGlobalFilters(new HttpExceptionFilter());


  //region swagger
  const apiPath = '/swagger-api';
  //只在生产环境添加鉴权
  if (environment.production) {
    app.use(apiPath, basicAuth({
      challenge: true,
      users    : { [environment.swagger.user]: environment.swagger.password }
    }));
  }
  const options = new DocumentBuilder()
    .setTitle('api')
    .setDescription('API description ')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(apiPath, app, document);

  //endregion


  const port = process.env.NODE_PORT || 3001;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();

// process.send( { message: 'hello parent' });
