import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { createApp } from './create.app';
import * as fs from 'fs';
import { dump } from 'js-yaml';

async function bootstrap() {
  const app = await createApp();

  const config = new DocumentBuilder()
    .setTitle('my-great-todo-management API')
    .setDescription('API for my-great-todo-management')
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  fs.writeFileSync('./swagger-spec.yaml', dump(document, {}));
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
