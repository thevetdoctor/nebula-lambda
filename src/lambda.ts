import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    const app = await NestFactory.create(
      AppModule,
    );

    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('NEBULA API')
      .setDescription('The official API for NEBULA')
      .setVersion('1.0')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.init();
    const expressApp = app.getHttpAdapter().getInstance();

    // 👇 Convert Express app to a Lambda handler
    cachedServer = serverlessExpress({
      app: expressApp,
    });
  }

  return cachedServer;
}

export const handler: Handler<
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2
> = async (event, context, callback) => {
  console.log(
    'Event received:',
    event.requestContext.http.method,
    event.rawPath,
    event.body,
  );

  const server = cachedServer ?? (await bootstrap());
  return server(event, context, callback);
};
