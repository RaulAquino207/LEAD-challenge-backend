import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
      @Inject(forwardRef(() => UserService))
      private userService: UserService, 
      
      private jwtService: JwtService
    ){}

    async validateUser(email: string, pass: string): Promise<any> {
        const user_return = await this.userService.findByEmail(email);
        const { status : _ , user } = user_return;

        if (_ == false){
          return null
        }

        const isMatch = await bcrypt.compare(pass, user.password);
        if (user && isMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role : user.role };
        return {
          access_token : this.jwtService.sign(payload),
          role : user.role,
          status : user.status
        }
    }
}
