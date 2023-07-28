import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto, CreateUserDto } from './dto';
import { UserSerializer } from './serializer';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private upload: UploadService) {}

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return plainToInstance(UserSerializer, users, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
  async getUser(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return plainToInstance(UserSerializer, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          role: dto.role,
        },
      });
      const userCreated = {
        ...user,
      };

      return plainToInstance(UserSerializer, userCreated, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      throw e;
    }
  }

  async editUser(userId: string, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (userId !== user.id) {
        throw new ForbiddenException();
      }

      const userUpdated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          name: dto.name,
          role: dto.role,
        },
      });
      const userToSend = {
        ...userUpdated,
      };

      return plainToInstance(UserSerializer, userToSend, {
        excludeExtraneousValues: true,
      });
    } catch (e) {
      throw e;
    }
  }
}
