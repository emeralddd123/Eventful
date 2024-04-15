import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
    imports : [TicketModule],
    providers: [NotificationService]
})
export class NotificationModule {}
