import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { NotificationService } from './notification.service';
import { TicketModule } from 'src/ticket/ticket.module';

@Module({
    imports : [EmailModule, TicketModule],
    providers: [NotificationService]
})
export class NotificationModule {}
