import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UserDto extends CreateUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'User ID (UUID)',
  })
  id: string;

  @ApiProperty({})
  createdAt: string;

  @ApiProperty({})
  updatedAt: string;
}

export class GetUsersDto {
  @ApiProperty({ example: '20', description: 'page size', required: false })
  @IsOptional()
  @IsString()
  limit?: string | number;

  @ApiProperty({
    example:
      'eyJjcmVhdGVkQXQiOiIyMDI1LTEyLTE2VDIyOjUwOjA0LjcxOVoiLCJpZCI6IjU4NGE1YmMyLTcwMjAtNDZlMi05M2NjLWU3Y2Q0MDgwNjRiNyJ9:1',
    description: 'base64 token',
    required: false,
  })
  @IsOptional()
  @IsString()
  nextToken?: string;
}
