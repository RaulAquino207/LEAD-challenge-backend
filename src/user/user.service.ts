import { SendGridService } from '@anchan828/nest-sendgrid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultDto } from 'src/dto/result.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { DescriptionDto } from './dto/description-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
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

    async getOnlyDescription(){

      let descriptions : number[] = [];
      const all = this.userRepository.find();

      for (let user of (await all).values()) {
        
        if (user.status  == true){
          descriptions.push(user.description);
        }
      }

      return descriptions;
    }
    
    async sendEmails(): Promise<User[]> {
      
      // let OnlySent : User[];
      
      const all = this.userRepository.find();

      for (let user of (await all).values()) {
        
          if (user.email_send  == false){
            this.sendEmail(user.email, user.name);
            // OnlySent.push(user);
            
            user.email_send = true
            await this.userRepository.save(user);
          }
        }
        
        return all;
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
        
        return 
        ;
      }
      
      async findByEmail(email : string) : Promise<ReturnUserDto> {
        const user = await this.userRepository.findOne(
          {where:
            {email: email }
          }
          )
          if(!user){
            return<ReturnUserDto>{
              status : false,
              user
            }
          } 
          
          return<ReturnUserDto>{
            status : true,
            user,
          }
          
        }
        
        async sendEmail(email : string, name : string) : Promise<void> {
          console.log(email);
          
          const url = 'http://localhost:4200/';
          
          try {
            await this.sendGrid.send({
              to: email,
              from: 'aquinoraul207@gmail.com',
              subject: "Form NPS ",
              text: `Olá ${name}, você poderia responder a este formulário para nos informar sobre sua satisfação?`,
              html: `<strong>Olá ${name}, você poderia responder a este formulário para nos informar sobre sua satisfação?</strong>
              <a href="${url}">Quero responder>`,
            });
            
            console.log('Email enviado');
          } catch (error) {
            console.log(error);
          }
        }
        
        
        
        async userResponse(userId: string, {description} : DescriptionDto) : Promise<ResultDto> {
          // let response : string;


        const user = await this.userRepository.findOne(userId);

        console.log(user.status);

        if(user.status == true){
          return<ResultDto>{
            status : false,
            message : 'You have already participated in the vote'
          }
        }

        // console.log(response);

        user.description = description ? description : user.description;
        // user.description = response ? response : user.description;
        user.status = true ? true : user.status;

        await this.userRepository.save(user);

        return<ResultDto>{
          status : true,
          message: 'Description saved'
        };
      }
}
