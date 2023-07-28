import { Expose, Type } from 'class-transformer';
import { UserSerializer } from 'src/user/serializer';

export class SalarySerializer {
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
  monthSalary: number;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
