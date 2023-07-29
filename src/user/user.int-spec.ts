import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto';

describe('skillController Int', () => {
  let app: INestApplication;
  let prisma: PrismaService;

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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('User CRUD', () => {
    it('should create user', async () => {
      const user: CreateUserDto = {
        name: 'Usuario dummy',
        role: 'driver',
      };
      const response = await request(app.getHttpServer())
        .post(`/users`)
        .send(user);
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.employeeNumber).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.name).toBeDefined();
      expect(response.body.role).toBeDefined();
    });
    it('should edit user', async () => {
      const userId = (await prisma.user.findFirst()).id;
      const user: CreateUserDto = {
        name: 'Usuario dummy Editado',
        role: 'auxiliares',
      };
      const response = await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .send(user);
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.employeeNumber).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.name).toBeDefined();
      expect(response.body.role).toBeDefined();
    });
    it('should fetch users', async () => {
      const response = await request(app.getHttpServer()).get(`/users`);
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].employeeNumber).toBeDefined();
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(response.body[0].name).toBe('Usuario dummy Editado');
      expect(response.body[0].role).toBe(Role.auxiliares);
    });
    it('should fetch users by name', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users`)
        .query({ byName: 'usuario' });
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].id).toBeDefined();
      expect(response.body[0].employeeNumber).toBeDefined();
      expect(response.body[0].createdAt).toBeDefined();
      expect(response.body[0].updatedAt).toBeDefined();
      expect(response.body[0].name).toBe('Usuario dummy Editado');
      expect(response.body[0].role).toBe(Role.auxiliares);
    });
    it('should fetch single user', async () => {
      const userId = (await prisma.user.findFirst()).id;
      const response = await request(app.getHttpServer()).get(
        `/users/${userId}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.employeeNumber).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      expect(response.body.name).toBe('Usuario dummy Editado');
      expect(response.body.role).toBe(Role.auxiliares);
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
