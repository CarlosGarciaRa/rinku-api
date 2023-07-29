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
  @Transform(({ value }) => (value / 100).toFixed(2))
  monthSalary: number;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  deliveriesBonus: number;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  bonusByRole: number;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  subtotalSalary: number;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  isrRetained: number;

  @Expose()
  isrPercentage: string;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  totalSalary: number;

  @Expose()
  @Transform(({ value }) => (value / 100).toFixed(2))
  vouchers: number;

  @Expose()
  @Type(() => UserSerializer)
  user: UserSerializer;
}
