import { IsNotEmpty } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ActivateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    token:string
}