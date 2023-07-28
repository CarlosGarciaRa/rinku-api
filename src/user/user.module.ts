import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UploadService],
})
export class UserModule {}
