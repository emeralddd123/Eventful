import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, MinLength, IsNotEmpty } from '@nestjs/class-validator';
  
export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty() 
  @MinLength(8) 
  password: string;

  @ApiProperty()
  @IsNotEmpty() 
  @MinLength(3)
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(3)
  lastname: string;
}