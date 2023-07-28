import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
export class EditDeliveryDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  number: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
