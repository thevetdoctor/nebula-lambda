import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user.dto';
import { SuccessMessage } from 'src/filters/success-message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get(':id')
  @SuccessMessage('User details')
  getUser(@Param('id') id: string): Promise<any> {
    return this.userService.getUser(id);
  }

  @Post()
  @SuccessMessage('User created successfully')
  createUser(@Body() createUserDto: CreateUserDto): Promise<any[]> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @SuccessMessage('List of users')
  list() {
    return this.userService.listUsers();
  }

  @Delete(':id')
  @SuccessMessage('User deleted successfully')
  deleteUser(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(id);
  }
}
