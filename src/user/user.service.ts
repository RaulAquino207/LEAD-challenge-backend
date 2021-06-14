import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { DescriptionDto } from './dto/description-user.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private readonly sendGrid: SendGridService,
      ) {}

      async createUser(CreateUserDto : CreateUserDto) : Promise<User> {
        return this.userRepository.createUser(CreateUserDto);
      }

      async findAll(): Promise<User[]> {
        return this.userRepository.find();
      }

      async findUserById(userId: string): Promise<User> {
        const user = await this.userRepository.findOne(userId, {
          select: ['email', 'name', 'description', 'status']
        });

        if(!user){
          throw new NotFoundException('User not found');
        }

        console.log('trying to send');
        this.sendEmail(user.email, user.name);

        return user;
      }

      async sendEmail(email : string, name : string) : Promise<void> {
        console.log(email);
        try {
          await this.sendGrid.send({
            to: email,
            from: 'aquinoraul207@gmail.com',
            subject: "Form NPS ",
            text: `Hello ${name}, could you answer this form to let us know your satisfaction?`,
            html: `<strong>Hello ${name}, could you answer this form to let us know your satisfaction?</strong>`,
          });

          console.log('Email enviado');
        } catch (error) {
          console.log(error);
        }
      }

      async userResponse(userId: string, {description} : DescriptionDto) : Promise<User> {
        enum response {
          'one' = 'detractors',
          'two' = 'detractors',
          'three' = 'detractors',
          'four' = 'detractors',
          'five' = 'detractors',
          'six' = 'detractors',
          'seven' = 'Neutrals',
          'eight' = 'Neutrals',
          'nine' = 'promoters',
          'ten' = 'promoters'
        }
        const user = await this.userRepository.findOne(userId, {
          select: ['email', 'name','description', 'status']
        });

        console.log(response[description]);

        user.description = response[description] ? response[description] : user.description
        user.status = true ? true : user.status

        await this.userRepository.save(user);

        return user;
      }
}
