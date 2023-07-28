import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  IsInt,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsFileType, MaxFileSize } from 'src/decorators/files';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: Role;
}
export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: Role;
}

export class FilesDto {
  @ValidateIf((object, value) => {
    return value !== null && value !== undefined;
  })
  @IsFileType(['image/png', 'image/jpeg'])
  @MaxFileSize(102)
  profilePictureFile: Express.Multer.File;

  @ValidateIf((object, value) => value !== null && value !== undefined)
  @MaxFileSize(1024)
  @IsFileType(['aplication/pdf'])
  resumeFile: Express.Multer.File;
}
