import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose, Type } from 'class-transformer';

export class UserSerializer {
  @Expose()
  id: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  employeeNumber: string;

  @Expose()
  name: string;

  @Expose()
  @ApiProperty({ enum: Role })
  role: Role;
}
