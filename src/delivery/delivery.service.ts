import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliverySerializer } from './serializer';
import { CreateDeliveryDto } from './dto';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async getAllDeliveries() {
    try {
      const deliveries = await this.prisma.delivery.findMany();
      return plainToInstance(DeliverySerializer, deliveries, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
  async createDelivery(dto: CreateDeliveryDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newDelivery = await this.prisma.delivery.create({
        data: {
          number: dto.number,
          date: dto.date,
          userId: dto.userId,
        },
        include: {
          user: true,
        },
      });
      return plainToInstance(DeliverySerializer, newDelivery, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
