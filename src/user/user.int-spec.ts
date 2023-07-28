import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationPipe } from '@nestjs/common/pipes';
import * as request from 'supertest';
import * as dayjs from 'dayjs';
import { AuthService } from 'src/auth/auth.service';
import { Role } from '@prisma/client';

describe('skillController Int', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;
  let userToken: string;
  let user: any;
  // let adminToken: string;
  // let admin: any;
  let skillOne;
  let skillTwo;
  let languageOne;
  let languageTwo;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await prisma.cleantDbForTesting();
    const userData = {
      firstName: 'Usuario',
      lastName: 'Last',
      email: 'user@email.com',
      username: 'flowery',
      hash: '12345678',
      biography: 'Biogragfia',
      title: 'Dev',
      birthday: dayjs('08-10-1998').toDate(),
      activeStatus: true,
      isEmailConfirmed: true,
      role: Role.user,
    };
    // const adminData = {
    //   firstName: 'Admin',
    //   lastName: 'Last',
    //   email: 'admin@email.com',
    //   hash: '12345678',
    //   birthday: dayjs('08-10-1998').toDate(),
    //   activeStatus: true,
    //   isEmailConfirmed: true,
    //   role: Role.admin,
    // };

    user = await prisma.user.create({ data: userData });
    userToken = await authService.signToken(user.id, user.email);

    // admin = await prisma.user.create({ data: adminData });
    // adminToken = await authService.signToken(admin.id, admin.email);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('Edit user data', () => {
    it('should edit own user', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/me`)
        .auth(userToken, { type: 'bearer' })
        .send({
          ...user,
          firstName: 'Usuario Editado',
          username: 'FlowerY2   virus',
        });
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Usuario Editado');
      expect(response.body.username).toBe('flowery2virus');
      expect(response.body.lastName).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.hash).not.toBeDefined();
    });
    it('should not update email', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/users/me`)
        .auth(userToken, { type: 'bearer' })
        .send({
          ...user,
          firstName: 'Usuario Editado 2',
          email: 'emailEditado@email.com',
        });
      expect(response.status).toBe(200);
      expect(response.body.email).toBe('user@email.com');
      expect(response.body.firstName).toBe('Usuario Editado 2');
      expect(response.body.lastName).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.hash).not.toBeDefined();
    });
  });

  describe('Get user profile', () => {
    it('should fetch own profile', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/me`)
        .auth(userToken, { type: 'bearer' });
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Usuario Editado');
      expect(response.body.lastName).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.biography).toBeDefined();
      expect(response.body.hash).not.toBeDefined();
    });
    it('should fetch profile based on username', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/flowery`)
        .auth(userToken, { type: 'bearer' });
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Usuario Editado');
      expect(response.body.username).toBe('flowery');
      expect(response.body.lastName).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.biography).toBeDefined();
      expect(response.body.hash).not.toBeDefined();
    });
  });
});
