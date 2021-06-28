import { ApiProperty } from "@nestjs/swagger";
import { TagDto } from "./tag-user.dto";

export class RegisterUserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    tag: TagDto;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;
    
    @ApiProperty()
    confirmation_password: string;
  }