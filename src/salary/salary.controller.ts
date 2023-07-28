import { Controller, Get, Query } from '@nestjs/common';
import { SalaryService } from './salary.service';
import * as dayjs from 'dayjs';

@Controller('salaries')
export class SalaryController {
  constructor(private salaryService: SalaryService) {}

  @Get()
  getSalaryByUser(
    @Query('byUser') userId: string,
    @Query('date') date: string,
  ) {
    let parsedDate: Date;
    if (date) {
      parsedDate = dayjs(date).toDate();
    }
    return this.salaryService.getSalariesByUser(userId, parsedDate);
  }
}
