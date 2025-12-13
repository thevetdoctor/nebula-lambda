import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import {
  accessKeyId,
  appPort,
  DYNAMO_ENDPOINT,
  region,
  secretAccessKey,
} from './constants/environment.';
import { SuccessResponseInterceptor } from './filters/success-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('NEBULA API')
    .setDescription('The official API for NEBULA')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'JWT',
    )
    .addTag('NEBULA APP')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(appPort);
  const app_url = await app.getUrl();

  console.log(`Application is running on: ${app_url}`);
  console.log(`Swagger Docs path: ${app_url}/api-docs`);
}
if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // running in lambda → do nothing here
} else {
  bootstrap();
}
