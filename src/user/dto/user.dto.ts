import {
  IsString,
  IsDate,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsFileType, MaxFileSize } from 'src/decorators/files';

export class EditUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase().replaceAll(' ', ''))
  username: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  biography: string;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  birthday: Date;
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
