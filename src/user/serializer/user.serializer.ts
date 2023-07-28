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
  email: string;

  @Expose()
  title: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  birthday: Date;

  @Expose()
  biography: string;

  @Expose()
  profilePictureUrl: string;

  @Expose()
  resumeUrl: string;

  @Expose()
  @ApiProperty({ enum: Role })
  role: Role;
}
