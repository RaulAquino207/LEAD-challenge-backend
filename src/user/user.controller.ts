import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResultDto } from 'src/dto/result.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('register')
    async createUser(
        @Body() createUserDto: CreateUserDto,
      ): Promise<ReturnUserDto> {
        const user = await this.userService.createUser(createUserDto);
        return {
          user,
          message: 'User registered successfully.',
        };
      }

      @Get('list')
      async listUsers() {
        return this.userService.findAll();
      }
}
