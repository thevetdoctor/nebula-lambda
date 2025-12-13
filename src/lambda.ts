import {
  Handler,
  APIGatewayProxyEventV2,
  APIGatewayProxyResultV2,
} from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configure } from './main';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule);
    configure(app);

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
