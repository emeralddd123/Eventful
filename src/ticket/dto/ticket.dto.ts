import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UUID } from 'crypto';

export class CreateUserTicketDto {
  @IsNotEmpty()
  userId: UUID;

  @IsNotEmpty()
  @ApiProperty()
  eventId: UUID;

}

export class UpdateUserTicketDto {

}

export class EventIdDto {
  @ApiProperty()
  @IsNotEmpty()
  eventId: UUID;
}

export class TicketIdDto {
  @IsNotEmpty()
  ticketId: UUID;
}


export class GetTicketDto {
  @IsNotEmpty()
  userId: UUID;

  @IsNotEmpty()
  eventId: UUID;
}

export class ValidateTicketDto {
  @IsOptional()
  userId: UUID

  @ApiProperty()
  @IsNotEmpty()
  ticketId: UUID;
}