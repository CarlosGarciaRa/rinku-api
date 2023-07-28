import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsObject } from 'class-validator';
import { UserSerializer } from 'src/user/serializer';

export class DeliverySerializer {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  number: number;

  @Expose()
  name: string;

  @IsObject()
  @Type(() => UserSerializer)
  programmingLanguages: UserSerializer;
}
