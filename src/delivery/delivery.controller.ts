import { Body, Controller, Get, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDeliveryDto } from './dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get()
  getAllDeliveries() {
    return this.deliveryService.getAllDeliveries();
  }
  @Post()
  createDelivery(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(dto);
  }
}
