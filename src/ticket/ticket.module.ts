import { Global, Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './ticket.entity';
import { BullModule } from '@nestjs/bull';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Ticket]),
    BullModule.registerQueue({ name: 'notification_queue' }),
        ],
    controllers: [TicketController],
    providers: [TicketService],
    exports : [TicketService]
})
export class TicketModule { }
