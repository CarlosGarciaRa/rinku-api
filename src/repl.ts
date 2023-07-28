import { repl } from '@nestjs/core';
import { AppModule } from './app.module';
import * as argon from 'argon2';

async function bootstrap() {
  const replServer = await repl(AppModule);
  Object.defineProperty(replServer.context, 'argon2', {
    configurable: false,
    enumerable: true,
    value: argon,
  });
}

bootstrap();
