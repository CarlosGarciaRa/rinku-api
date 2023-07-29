import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { EditUserDto, CreateUserDto } from './dto';
import { UserService } from './user.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  getUsers(@Query('byName') name: string) {
    return this.userService.getAllUsers(name);
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
