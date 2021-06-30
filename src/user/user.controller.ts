import { Body, Controller, Get, Param, Request, Post, Put, UseGuards, Inject, forwardRef } from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { Roles } from './decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DescriptionDto } from './dto/description-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { Role } from './enums/role.enum';
import { RolesGuard } from './roles.guard';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
      private userService: UserService,

      @Inject(forwardRef(() => AuthService))
      private authService: AuthService
    ) {}

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

      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles(Role.Admin)
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

      @Get('list/descriptions')
      async getOnlyDescription(){
        return await this.userService.getOnlyDescription();
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

      @UseGuards(LocalAuthGuard)
      @Post('auth/login')
      async login(@Request() { user }){
        return this.authService.login(user);
      }

      @UseGuards(JwtAuthGuard)
      @Get('auth/profile')
      getProfile(@Request() { user }) {
        return user;
      }
}
