import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { TagDto } from './dto/tag-user.dto';
import { ResultDto } from 'src/dto/result.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    CreateUserDto: CreateUserDto,
  ): Promise<any> {
    
    const { email, tag, name, password, confirmation_password } = CreateUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.tag = tag;
    user.status = false;
    user.email_send = false;

    if (password !== confirmation_password){

      throw new ConflictException('Password do not match');
    } else {
      user.password = password;
      user.confirmation_password = confirmation_password;
    }
    try {
      await user.save();
      return user;
    } catch (error) {
      console.log("🚀 ~ ", error.code.toString());
      if (error.code.toString() === 'ER_NO_DEFAULT_FOR_FIELD') {
        throw new ConflictException('Email address is already in use');
      } else {

        throw new InternalServerErrorException(
          'Error saving user to database',
        );
      }
    }
  }
}