import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultDto } from 'src/dto/result.dto';
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
            html: `<strong>Hello ${name}, could you answer this form to let us know your satisfaction?</strong>
            <a href="https://pbs.twimg.com/profile_images/1081737035772252161/Nmiep0Fh.jpg">SIM</a>`,
          });

          console.log('Email enviado');
        } catch (error) {
          console.log(error);
        }
      }

      async userResponse(userId: string, {description} : DescriptionDto) : Promise<ResultDto> {
        let response : string;

        switch (description) {
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6:
            response = 'detractors'
            break;
          case 7:
          case 8:
            response = 'Neutrals'
            break;
            
          case 9:
          case 10:
            response = 'promoters'
            break;
        }
        const user = await this.userRepository.findOne(userId);

        console.log(user.status);

        if(user.status == true){
          return<ResultDto>{
            status : false,
            message : 'You have already participated in the vote'
          }
        }

        console.log(response);

        user.description = response ? response : user.description;
        user.status = true ? true : user.status;

        await this.userRepository.save(user);

        return<ResultDto>{
          status : true,
          message: 'Description saved'
        };
      }
}
