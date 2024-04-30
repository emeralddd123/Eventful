import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TicketModule } from 'src/ticket/ticket.module';
import { UserModule } from 'src/users/users.module';

@Module({
    imports : [TicketModule, UserModule],
    providers: [NotificationService]
})
export class NotificationModule {}
