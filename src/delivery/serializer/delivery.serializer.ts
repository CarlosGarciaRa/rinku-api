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
  get doubleNumber(): number {
    // Realizar el cálculo del doble de 'number'
    return this.number * 2;
  }

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
