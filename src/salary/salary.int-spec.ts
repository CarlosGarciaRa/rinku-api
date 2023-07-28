import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import { Role } from '@prisma/client';

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
    await prisma.delivery.create({
      data: {
        date: dayjs('2023/08/01').toDate(),
        number: 2,
        userId: user.id,
      },
    });
    await prisma.delivery.create({
      data: {
        date: dayjs('2023/10/01').toDate(),
        number: 10,
        userId: user.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Salaries Fetch', () => {
    it('should fetch all salaries', async () => {
      const response = await request(app.getHttpServer()).get(`/salaries`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(response.body[0].number).toBeDefined();
      expect(response.body[0].date).toBeDefined();
      expect(response.body[0].user).toBeDefined();
      expect(response.body[0].monthSalary).toBeDefined();
      expect(response.body[0].deliveriesBonus).toBeDefined();
      expect(response.body[0].bonusByRole).toBeDefined();
      expect(response.body[0].subtotalSalary).toBeDefined();
      expect(response.body[0].isrRetained).toBeDefined();
      expect(response.body[0].isrPercentage).toBeDefined();
      expect(response.body[0].vouchers).toBeDefined();
      expect(response.body[0].totalSalary).toBeDefined();
    });
    it('should fetch all salaries from user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/salaries`)
        .query({ byUser: user.id });
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(response.body[0].number).toBeDefined();
      expect(response.body[0].date).toBeDefined();
      expect(response.body[0].user).toBeDefined();
      expect(response.body[0].monthSalary).toBeDefined();
      expect(response.body[0].deliveriesBonus).toBeDefined();
      expect(response.body[0].bonusByRole).toBeDefined();
      expect(response.body[0].subtotalSalary).toBeDefined();
      expect(response.body[0].isrRetained).toBeDefined();
      expect(response.body[0].isrPercentage).toBeDefined();
      expect(response.body[0].vouchers).toBeDefined();
      expect(response.body[0].totalSalary).toBeDefined();
    });
    it('should fetch all salaries from at a given date', async () => {
      const response = await request(app.getHttpServer())
        .get(`/salaries`)
        .query({ byUser: user.id, date: dayjs('2023-08-10').toDate() });
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(response.body[0].number).toBeDefined();
      expect(response.body[0].date).toBeDefined();
      expect(response.body[0].user).toBeDefined();
      expect(response.body[0].monthSalary).toBeDefined();
      expect(response.body[0].deliveriesBonus).toBeDefined();
      expect(response.body[0].bonusByRole).toBeDefined();
      expect(response.body[0].subtotalSalary).toBeDefined();
      expect(response.body[0].isrRetained).toBeDefined();
      expect(response.body[0].isrPercentage).toBeDefined();
      expect(response.body[0].vouchers).toBeDefined();
      expect(response.body[0].totalSalary).toBeDefined();
    });
  });
});
