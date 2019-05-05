import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/service/config.service';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle('Git Man Service')
    .setDescription('The git man service API description.')
    .setVersion(configService.getModuleProperty('version'))
    .addTag('git man service api rest')
    .addBearerAuth('Authorization')
    .setSchemes('http', 'https')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(configService.getSystemProperty('PORT'));
}
bootstrap();
