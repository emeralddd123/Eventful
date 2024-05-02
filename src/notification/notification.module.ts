import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserModule } from 'src/users/users.module';
import { EventModule } from 'src/event/event.module';

@Module({
    imports : [TicketModule, UserModule, EventModule],
    providers: [NotificationService]
})
export class NotificationModule {}
