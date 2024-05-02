import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EventModule } from 'src/event/event.module';
import { Jobservice } from './job.service';
import { TicketModule } from 'src/ticket/ticket.module';
import { BullModule } from '@nestjs/bull';

@Module({
    imports: [ScheduleModule.forRoot(),
    BullModule.registerQueue({ name: 'notification_queue' }),
        EventModule, TicketModule],
    providers: [Jobservice]
})
export class JobModule {

}
