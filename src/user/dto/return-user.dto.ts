import { User } from '../user.entity';

export class ReturnUserDto {
  status: boolean;
  user: User;
}