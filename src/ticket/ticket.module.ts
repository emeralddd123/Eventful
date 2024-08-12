import { Global, Module } from '@nestjs/common';
import { TicketApiController } from './controllers/ticket.api.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { TicketController } from './controllers/ticket.web.controller';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Ticket]),
    ],
    controllers: [TicketApiController],
    providers: [TicketService],
    exports: [TicketService]
})
export class TicketModule { }
