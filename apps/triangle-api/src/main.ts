/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'dotenv';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = "api";

  app.setGlobalPrefix(globalPrefix);

  //app config
  app.setGlobalPrefix(globalPrefix);
  // app.useGlobalPipes(new ValidationPipe());

  // app.use(requestIdMiddleware());
  // app.use( bodyParser.json({limit: '50mb'}) );

  // app.useWebSocketAdapter(new WsAdapter(app));

  //region swagger
  const apiPath = '/swagger-api';
  //只在生产环境添加鉴权
  if (environment.production) {
    app.use(apiPath/*, basicAuth({
      challenge: true,
      users    : { [environment.swagger.user]: environment.swagger.password }
    })*/);
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


  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log("Listening at http://localhost:" + port + "/" + globalPrefix);
  });
}

bootstrap();

