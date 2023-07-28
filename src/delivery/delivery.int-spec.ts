import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import { Role } from '@prisma/client';
import { CreateDeliveryDto } from './dto';

describe('skillController Int', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let user: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await prisma.cleantDbForTesting();
    // Create user for deliveries
    const data = {
      name: 'Usuario',
      role: Role.driver,
    };

    user = await prisma.user.create({ data });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('User CRUD', () => {
    it('should create delivery on existing user', async () => {
      const delivery: CreateDeliveryDto = {
        date: dayjs('2023/08/01').toDate(),
        number: 1,
        userId: user.id,
      };
      const response = await request(app.getHttpServer())
        .post(`/deliveries`)
        .send(delivery);
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.number).toBeDefined();
      expect(response.body.date).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
    it('should throw if userId doesnt exist', async () => {
      const delivery: CreateDeliveryDto = {
        date: dayjs('2023/08/01').toDate(),
        number: 1,
        userId: '102',
      };
      const response = await request(app.getHttpServer())
        .post(`/deliveries`)
        .send(delivery);
      expect(response.status).toBe(404);
    });
    it('should edit delivery', async () => {
      const deliveryId: string = (await prisma.delivery.findFirst()).id;
      const delivery: CreateDeliveryDto = {
        date: dayjs('2023/09/01').toDate(),
        number: 10,
        userId: user.id,
      };
      const response = await request(app.getHttpServer())
        .patch(`/deliveries/${deliveryId}`)
        .send(delivery);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.number).toBe(10);
      expect(response.body.date).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
    it('should throw on edit non exisiting delivery', async () => {
      const delivery: CreateDeliveryDto = {
        date: dayjs('2023/09/01').toDate(),
        number: 10,
        userId: user.id,
      };
      const response = await request(app.getHttpServer())
        .patch(`/deliveries/${123}`)
        .send(delivery);
      expect(response.status).toBe(404);
    });
    it('should delete delivery', async () => {
      const deliveryId: string = (await prisma.delivery.findFirst()).id;
      const response = await request(app.getHttpServer()).delete(
        `/deliveries/${deliveryId}`,
      );
      expect(response.status).toBe(200);
    });
    it('should throw on delete non existing delivery', async () => {
      const response = await request(app.getHttpServer()).delete(
        `/deliveries/${124}`,
      );
      expect(response.status).toBe(404);
    });
  });
  // describe('Get users', () => {
  //   it('should fetch users', async () => {
  //     const response = await request(app.getHttpServer()).get(`/users`);
  //     expect(response.status).toBe(200);
  //     expect(response.body.length).toBeGreaterThan(0);
  //     expect(response.body[0].id).toBeDefined();
  //     expect(response.body[0].employeeNumber).toBeDefined();
  //     expect(response.body[0].createdAt).toBeDefined();
  //     expect(response.body[0].updatedAt).toBeDefined();
  //     expect(response.body[0].name).toBeDefined();
  //     expect(response.body[0].role).toBeDefined();
  //   });
  // });
});
