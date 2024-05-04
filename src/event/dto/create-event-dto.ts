import { Length, IsEnum, IsDateString, IsOptional, } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { EventType } from "../event.entity";

export class CreateEventDto {
    @ApiProperty()
    @Length(3, 255)
    name: string

    @ApiProperty()
    @Length(3, 999)
    description: string

    @ApiProperty()
    @Length(3, 355)
    location: string

    @ApiProperty()
    @IsDateString()
    startDate?: Date;

    @ApiProperty()
    @IsDateString()
    endDate?: Date;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    remindAt?: Date;

    @ApiProperty({ enum: EventType, default: EventType.PHYSICAL })
    @IsEnum(EventType)
    type: EventType;

    constructor(data: Partial<CreateEventDto>) {
        Object.assign(this, data);
    }
}

