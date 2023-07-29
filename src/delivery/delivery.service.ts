import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliverySerializer, GroupedDeliverySerializer } from './serializer';
import { CreateDeliveryDto, EditDeliveryDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as dayjs from 'dayjs';
import { Delivery, Prisma } from '@prisma/client';

@Injectable()
export class DeliveryService {
  constructor(private prisma: PrismaService) {}

  async getAllDeliveries(userId?: string, date?: Date) {
    try {
      // if date is in query
      let startDate: Date;
      let endDate: Date;
      if (date) {
        startDate = dayjs(date).startOf('month').toDate();
        endDate = dayjs(date).endOf('month').toDate();
      }
      const deliveries = await this.prisma.delivery.findMany({
        where: {
          userId: userId, // Filtrar por el userId proporcionado
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          date: 'asc',
        },
        include: { user: true },
      });

      return plainToInstance(DeliverySerializer, deliveries, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
  async getDeliveriesGroupedByUser() {
    try {
      const sql = Prisma.sql`
      SELECT
        u."id" as "user.id",
        u."employeeNumber" as "user.employeeNumber",
        u."name" as "user.name",
        u."role" as "user.role",
        CAST(SUM(d."number") as INTEGER) as "totalDeliveries"
      FROM
        "Delivery" d
      INNER JOIN
        "User" u ON d."userId" = u."id"
      GROUP BY
      u."id", u.name;
    `;
      const deliveries: Delivery[] = await this.prisma.$queryRaw(sql);
      const tr = deliveries.map((row) => ({
        id: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        date: row.date,
        totalDeliveries: row['totalDeliveries'],
        user: {
          id: row['user.id'],
          createdAt: row['user.createdAt'],
          updatedAt: row['user.updatedAt'],
          employeeNumber: row['user.employeeNumber'],
          name: row['user.name'],
          role: row['user.role'],
        },
      }));

      return plainToInstance(GroupedDeliverySerializer, tr, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
  async getDelivery(deliveryId: string) {
    try {
      const delivery = await this.prisma.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          user: true,
        },
      });
      if (!delivery) {
        throw new NotFoundException('Delivery not found');
      }
      return plainToInstance(DeliverySerializer, delivery, {
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
        excludeExtraneousValues: false,
      });
    } catch (error) {
      throw error;
    }
  }
  async editDelivery(deliveryId: string, dto: EditDeliveryDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const newDelivery = await this.prisma.delivery.update({
        where: {
          id: deliveryId,
        },
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Delivery not found');
        }
      }
      throw error;
    }
  }
  async deleteDelivery(deliveryId: string) {
    try {
      await this.prisma.delivery.delete({
        where: {
          id: deliveryId,
        },
      });
      return;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Delivery not found');
        }
      }
      throw error;
    }
  }
}
