import { ApiProperty } from "@nestjs/swagger";

export class ActivateUserDto {
    @ApiProperty()
    token:string
}