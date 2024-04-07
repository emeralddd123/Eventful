import { ApiProperty } from "@nestjs/swagger"
import { Length } from "class-validator"

export class LoginDto {
    @ApiProperty()
    @Length(8, 255)
    email: string

    @ApiProperty()
    @Length(8, 255)
    password: string
}
