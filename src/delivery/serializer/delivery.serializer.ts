import { Expose, Type } from 'class-transformer';
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
  date: Date;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
