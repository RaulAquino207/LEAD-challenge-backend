import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { TagDto } from './dto/tag-user.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async createUser(
    CreateUserDto: CreateUserDto,
  ): Promise<User> {
    
    const { email, tag, name } = CreateUserDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.tag = tag;
    user.status = false;
    user.email_send = false;
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