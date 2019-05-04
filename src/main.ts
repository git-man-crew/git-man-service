import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/service/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle('Git Man Service')
    .setDescription('The git man service API description.')
    .setVersion(configService.getModuleProperty('version'))
    .addTag('git man service api rest')
    .addBearerAuth('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
