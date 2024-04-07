import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsDateString, IsInt, Min, IsIn } from 'class-validator';

export class FetchEventsDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Transform(({ value }) => parseInt(value))
    limit?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Transform(({ value }) => parseInt(value))
    offset?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    startDate?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsDateString()
    endDate?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    search?: string;

    @ApiProperty({required: false})
    @IsOptional()
    @IsIn(['virtual', 'physical'])
    type?: string
}
