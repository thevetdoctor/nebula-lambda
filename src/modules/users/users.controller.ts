import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, GetUsersDto } from './user.dto';
import { SuccessMessage } from '../../filters/success-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @SuccessMessage('User details')
  async getUser(@Param('id') id: string): Promise<any> {
    return await this.userService.getUser(id);
  }

  @Post()
  @SuccessMessage('User created successfully')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any[]> {
    return await this.userService.createUser(createUserDto);
  }

  @Get()
  @SuccessMessage('List of users')
  async list(@Query() query: GetUsersDto): Promise<any> {
    return await this.userService.listUsers(query);
  }

  @Delete(':id')
  @SuccessMessage('User deleted successfully')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return await this.userService.deleteUser(id);
  }
}
