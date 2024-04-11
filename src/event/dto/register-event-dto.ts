import { IsOptional, IsUUID } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";

export class RegisterEventDto {
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    userId: UUID;

    @ApiProperty()
    @IsUUID()
    eventId: UUID;
}