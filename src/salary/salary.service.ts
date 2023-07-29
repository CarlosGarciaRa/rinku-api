import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeliveryService } from 'src/delivery/delivery.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalarySerializer } from './serializer';
import { Role } from '@prisma/client';

@Injectable()
export class SalaryService {
  private readonly baseSalary = 3000; // $30
  private readonly hoursWorked = 8;
  private readonly daysWorked = 6;
  private readonly weeksWorked = 4;
  constructor(
    private prisma: PrismaService,
    private deliveryService: DeliveryService,
  ) {}

  async getSalariesByUser(userId: string, date: Date) {
    const userDeliveries = await this.deliveryService.getAllDeliveries(
      userId,
      date,
    );
    const salaries = userDeliveries.map((delivery) => {
      const monthSalary = this.emplyeeMonthSalary();
      const deliveriesBonus = this.deliveriesBonus(delivery.number);
      const bonusByRole = this.getBonusByRole(delivery.user.role);
      const subtotalSalary = monthSalary + deliveriesBonus + bonusByRole;
      const { isrRetained, isrPercentage } = this.isrReatined(subtotalSalary);
      const totalSalary = subtotalSalary - isrRetained;
      const vouchers = this.vouchers(totalSalary);
      return {
        ...delivery,
        monthSalary,
        deliveriesBonus,
        bonusByRole,
        subtotalSalary,
        isrRetained,
        isrPercentage,
        vouchers,
        totalSalary,
      };
    });

    return plainToInstance(SalarySerializer, salaries, {
      excludeExtraneousValues: true,
    });
  }

  emplyeeMonthSalary(months = 1) {
    return (
      this.baseSalary *
      this.hoursWorked *
      this.daysWorked *
      this.weeksWorked *
      months
    );
  }
  deliveriesBonus(deliveries: number) {
    // money handled in cents
    const deliveryBonus = 500; // $5
    return deliveryBonus * deliveries;
  }
  getBonusByRole(role: Role) {
    if (role === Role.auxiliares) return 0;
    else if (role === Role.driver)
      return 1000 * this.hoursWorked * this.daysWorked * this.weeksWorked;
    // $5
    else if (role === Role.loader)
      return 500 * this.hoursWorked * this.daysWorked * this.weeksWorked; // $10
  }
  isrReatined(totalSalary: number) {
    return {
      isrRetained: totalSalary * (totalSalary > 1000000 ? 0.12 : 0.09),
      isrPercentage: totalSalary > 1000000 ? '12' : '9',
    };
  }
  vouchers(totalSalary: number) {
    return totalSalary * 0.04;
  }
}
