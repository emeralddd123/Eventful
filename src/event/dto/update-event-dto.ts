import { Length, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../event.entity';

export class UpdateEventDto {
  @ApiPropertyOptional()
  @Length(3, 255)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @Length(3, 999)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @Length(3, 355)
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ enum: EventType })
  @IsEnum(EventType)
  @IsOptional()
  type?: EventType;

  @IsOptional()
  notified? : boolean
}
