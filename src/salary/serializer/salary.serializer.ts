import { Expose, Transform, Type } from 'class-transformer';
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
  @Transform(({ value }) => value / 100)
  monthSalary: number;

  @Expose()
  @Transform(({ value }) => value / 100)
  deliveriesBonus: number;

  @Expose()
  @Transform(({ value }) => value / 100)
  bonusByRole: number;

  @Expose()
  @Transform(({ value }) => value / 100)
  subtotalSalary: number;

  @Expose()
  @Transform(({ value }) => value / 100)
  isrRetained: number;

  @Expose()
  isrPercentage: string;

  @Expose()
  @Transform(({ value }) => value / 100)
  totalSalary: number;

  @Expose()
  @Transform(({ value }) => value / 100)
  vouchers: number;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
