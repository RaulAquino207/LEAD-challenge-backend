import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ResultDto } from 'src/dto/result.dto';

@Injectable()
export class AuthService {

    constructor(private userService: UserService){}

    async validateUser(email: string, pass: string): Promise<any> {
        if(!email || !pass){
            return<ResultDto> {
                status : false,
                message : 'Please provide an email and passaword'
            }
        }
        console.log(email, pass);
        const user_return = await this.userService.findByEmail(email);

        const { status, user } = user_return;

        console.log(user);

        console.log(pass);
        console.log(user.password);
        const isMatch = await bcrypt.compare(pass, user.password);
        console.log(isMatch);
        if (user && isMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
}
