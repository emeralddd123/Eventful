import { Exclude, Expose } from 'class-transformer';
import { IsEmail, Min } from '@nestjs/class-validator';
import { UUID } from 'crypto';
  
  export class UserDto {
    @Expose()
    id: UUID

    @Expose()
    @IsEmail()
    email:string

    @Exclude()
    @Min(8)
    password:string

    @Expose()
    @Min(3)
    firstname:string

    @Expose()
    @Min(3)
    lastname:string
}