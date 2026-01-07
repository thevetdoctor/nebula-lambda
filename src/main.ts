import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { SuccessResponseInterceptor } from './filters/success-response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Swagger and Global Configuration
export const configure = (app) => {
  const config = new DocumentBuilder()
    .setTitle('NEBULA API')
    .setDescription('The official API for NEBULA')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips unknown properties
      forbidNonWhitelisted: true, // throws error for extra fields
      transform: true, // auto-transform payloads to DTO classes
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new SuccessResponseInterceptor());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const appPort = configService.get<number>('PORT', 3000);
  configure(app);

  await app.listen(appPort);
  const app_url = await app.getUrl();

  console.log(`Application is running on: ${app_url}`);
  console.log(`Swagger Docs path: ${app_url}/api-docs`);
}
bootstrap();
