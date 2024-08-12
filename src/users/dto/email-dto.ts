import { IsEmail } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class EmailDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    email:string
}
