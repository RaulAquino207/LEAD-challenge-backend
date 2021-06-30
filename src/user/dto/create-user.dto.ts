import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../enums/role.enum";

export class CreateUserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    role: Role;
    
    @ApiProperty()
    name: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    confirmation_password: string;
  }