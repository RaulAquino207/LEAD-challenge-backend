import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ResultDto } from 'src/dto/result.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DescriptionDto } from './dto/description-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Post('register')
    @ApiBody({ type: CreateUserDto })
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

      @Get(':id')
      async findUserById(@Param('id') id) : Promise<User> {
        const user = await this.userService.findUserById(id);
        return user;
      }

      @Put(':id')
      async userResponse(@Param('id') id, @Body() description : DescriptionDto) {
        return this.userService.userResponse(id, description);
      }
}
