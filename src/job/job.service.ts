import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron, CronExpression } from "@nestjs/schedule";
import { UpdateEventDto } from "src/event/dto/update-event-dto";
import { EventService } from "src/event/event.service";
import { TicketService } from "src/ticket/ticket.service";

@Injectable()
export class Jobservice {
    constructor(
        private eventService: EventService,
        private readonly ticketService: TicketService,
        private eventEmmiter: EventEmitter2
    ) {

    }

    @Cron(CronExpression.EVERY_HOUR)
    async sendReminderToAttendee() {
        const events = await this.eventService.findUnnotifiedEvents()
        const now = new Date().getTime();

        for (const event of events) {
            const eventRemindAt = new Date(event.remindAt);
            const userIdSet = new Set<string>();
            if (eventRemindAt.getTime() >= now) {
                // Send reminders to attendees
                for (const ticket of event.tickets) {
                    userIdSet.add(ticket.userId)
                }

                const userIdArray = Array.from(userIdSet)
                this.eventEmmiter.emit('send_event_reminder', { eventId: event.id, userIdArray })

                // Mark the event as notified
                const updateEventDto: UpdateEventDto = { notified: true }
                const updatedEvent = await this.eventService.updateOne(updateEventDto, event.id)
                return updatedEvent

            }
        }
    }


}
