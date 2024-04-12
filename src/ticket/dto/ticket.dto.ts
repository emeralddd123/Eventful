
import { IsNotEmpty } from 'class-validator';
import { UUID } from 'crypto';

export class CreateUserTicketDto {
  @IsNotEmpty()
  userId: UUID;

  @IsNotEmpty()
  eventId: UUID;

}

export class UpdateUserTicketDto {
    
}

export class EventIdDto {
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