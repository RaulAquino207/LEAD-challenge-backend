import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
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
          status: true,
        };
      }

      @Get('list')
      async listUsers() {
        return this.userService.findAll();
      }

      @Get('list/send')
      async sendEmails() {
        return this.userService.sendEmails();
      }

      @Get(':id')
      @ApiParam({ name:"id" })
      async findUserById(@Param('id') id) : Promise<User> {
        const user = await this.userService.findUserById(id);
        return user;
      }

      @Get('email/:email')
      @ApiParam({ name:"email" })
      async findByEmail(@Param('email') email) : Promise<ReturnUserDto>{
        const result = await this.userService.findByEmail(email);
        return result;
      }

      @Put(':id')
      @ApiParam({ name:"id" })
      async userResponse(@Param() data, @Body() description : DescriptionDto) {
        console.log(data);
        return this.userService.userResponse(data.id, description);
      }
}
