import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';

export class AuthUserSerializer {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiHideProperty()
  @Exclude()
  hash: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty()
  @Expose()
  birthday: Date;

  @ApiProperty()
  @Expose()
  activeStatus: boolean;

  @ApiProperty()
  @Expose()
  isEmailConfirmed: boolean;

  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty({ enum: Role })
  @Expose()
  role: Role;
}
