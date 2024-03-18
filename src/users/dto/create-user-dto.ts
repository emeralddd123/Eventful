import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, Min } from '@nestjs/class-validator';
  
  export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @Min(8)
    password:string

    @ApiProperty()
    @Min(3)
    firstname:string

    @ApiProperty()
    @Min(3)
    lastname:string
}