import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    CreateUserDto: CreateUserDto,
  ): Promise<any> {
    
    const { email, role, name, password, confirmation_password } = CreateUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = false;
    user.email_send = false;

    if (password !== confirmation_password){
      throw new ConflictException('Password do not match');
    } else {
      const hash = await bcrypt.hash(password, 8);
      user.password = hash;
    }
    try {
      await user.save();
      return user;
    } catch (error) {
      console.log("🚀 ~ ", error.code.toString());
      if (error.code.toString() === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email address is already in use');
      } else {

        throw new InternalServerErrorException(
          'Error saving user to database',
        );
      }
    }
  }
}