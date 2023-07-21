import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // Los parámetros que no están definidos en los dto se eliminan
    })
  );
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Food & Move API Documentation')
    .setDescription('Documentation of the api')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('employees')
    .addTag('patients')
    .addTag('consults')
    .addTag('recipes')
    .addTag('routines')
    .addTag('foods')
    .addTag('moves')
    .addTag('diets')
    .addTag('files')
    .addTag('attachments')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);

  await app.listen(3000);
}

bootstrap();
