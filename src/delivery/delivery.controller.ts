import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateDeliveryDto, EditDeliveryDto } from './dto';

@ApiTags('deliveries')
@Controller('deliveries')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get()
  getAllDeliveries(@Query('userId') userId: string) {
    return this.deliveryService.getAllDeliveries(userId);
  }
  @Get('/grouped_by_user')
  getDeliveriesGrouped() {
    return this.deliveryService.getDeliveriesGroupedByUser();
  }
  @Get('/:deliveryId')
  getDelivery(@Param('deliveryId') deliveryId: string) {
    return this.deliveryService.getDelivery(deliveryId);
  }
  @ApiOkResponse({ status: 201, description: 'Create user' })
  @Post()
  createDelivery(@Body() dto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(dto);
  }
  @ApiOkResponse({ status: 200, description: 'Create user' })
  @Patch('/:deliveryId')
  editDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() dto: EditDeliveryDto,
  ) {
    return this.deliveryService.editDelivery(deliveryId, dto);
  }
  @ApiOkResponse({ status: 200, description: 'Create user' })
  @Delete('/:deliveryId')
  deleteDelivery(@Param('deliveryId') deliveryId: string) {
    return this.deliveryService.deleteDelivery(deliveryId);
  }
}
