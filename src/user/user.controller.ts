import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { EditUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser('id') id: string) {
    return this.userService.getUser(id);
  }
  @Get('/:username')
  getUser(@Param('username') username: string) {
    return this.userService.getUser(undefined, username);
  }
  @ApiOkResponse({ status: 200, description: 'Edits own user' })
  @UseGuards(JwtGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profilePictureFile', maxCount: 1 },
      { name: 'resumeFile', maxCount: 1 },
    ]),
  )
  @Patch('me')
  editOwnUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }

  @ApiOkResponse({ status: 201, description: 'Adds picture to user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  @Post('me/add_profile_pricture')
  addProfilePicture(
    @GetUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 256000 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    profilePicture: Express.Multer.File,
  ) {
    return this.userService.addProfilePicture(userId, profilePicture);
  }
  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('resume'))
  @Post('me/add_resume')
  addResume(
    @GetUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024000 }),
          new FileTypeValidator({ fileType: /(pdf)$/ }),
        ],
      }),
    )
    resume: Express.Multer.File,
  ) {
    return this.userService.addResume(userId, resume);
  }
}
