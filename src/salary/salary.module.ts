import { Module } from '@nestjs/common';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { DeliveryService } from 'src/delivery/delivery.service';

@Module({
  controllers: [SalaryController],
  providers: [SalaryService, DeliveryService],
})
export class SalaryModule {}
