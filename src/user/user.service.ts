import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { complement } from 'src/utils';
import { EditUserDto } from './dto';
import { UserSerializer } from './serializer';
import * as fileType from 'file-type';
import { UploadService } from 'src/upload/upload.service';
import { UploadsFolder } from 'src/upload/enum';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private upload: UploadService) {}

  async editUser(userId: string, dto: EditUserDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.id },
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
          firstName: dto.firstName,
          lastName: dto.lastName,
          birthday: dto.birthday,
          biography: dto.biography,
          username: dto.username,
          title: dto.title,
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

  async addProfilePicture(userId: string, file: Express.Multer.File) {
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
      // validate file type
      const fileBuffer = file.buffer;
      const detectedType = await fileType.fromBuffer(fileBuffer);
      if (
        !detectedType ||
        !['image/jpeg', 'image/png'].includes(detectedType.mime)
      ) {
        throw new BadRequestException('File must be valid JPEG or PNG.');
      }
      // If previous image we delete it
      if (user.profilePictureUrl) {
        await this.upload.removeFile(
          UploadsFolder.ProfilePictures,
          user.profilePictureUrl,
        );
      }
      // update image field
      const fileNameUrl = await this.upload.saveFile(
        UploadsFolder.ProfilePictures,
        file,
      );
      await this.prisma.user.update({
        where: { id: userId },
        data: { profilePictureUrl: fileNameUrl },
      });
    } catch (error) {
      throw error;
    }
  }
  async addResume(userId: string, file: Express.Multer.File) {
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
      // validate file type
      const fileBuffer = file.buffer;
      const detectedType = await fileType.fromBuffer(fileBuffer);
      if (!detectedType || !['application/pdf'].includes(detectedType.mime)) {
        throw new BadRequestException('File must be valid PDF.');
      }
      // If previous image we delete it
      if (user.resumeUrl) {
        await this.upload.removeFile(UploadsFolder.Resumes, user.resumeUrl);
      }
      // update image field
      const fileNameUrl = await this.upload.saveFile(
        UploadsFolder.Resumes,
        file,
      );
      await this.prisma.user.update({
        where: { id: userId },
        data: { resumeUrl: fileNameUrl },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId?: string, username?: string) {
    if (!userId && !username) throw new NotFoundException('User not found');
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId, username },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const userToSend = {
        ...user,
      };
      return plainToInstance(UserSerializer, userToSend, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }
}
