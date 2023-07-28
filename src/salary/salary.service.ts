import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeliveryService } from 'src/delivery/delivery.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SalarySerializer } from './serializer';

@Injectable()
export class SalaryService {
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
      return {
        ...delivery,
        monthSalary: this.emplyeeMonthSalary(),
      };
    });

    return plainToInstance(SalarySerializer, salaries, {
      excludeExtraneousValues: true,
    });
  }

  emplyeeMonthSalary(months = 1) {
    // money handled in cents
    const baseSalary = 300;
    const hoursWorked = 8;
    const daysWorked = 6;
    const weeksWorked = 4;
    return baseSalary * hoursWorked * daysWorked * weeksWorked * months;
  }
}
