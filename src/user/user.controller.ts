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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { EditUserDto, CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }
  @Get('/:userId')
  getSingleUser(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }
  @ApiOkResponse({ status: 200, description: 'Create user' })
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.userService.createUser(dto);
  }
  @ApiOkResponse({ status: 200, description: 'Edits an user' })
  @Patch('/:userId')
  editUser(@Param('userId') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
