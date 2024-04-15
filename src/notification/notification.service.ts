import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { TicketService } from "src/ticket/ticket.service";
import { EmailService } from "src/email/email.service";
import { ISendMailOptions } from "@nestjs-modules/mailer";


@Processor('notification_queue')
export class NotificationService {
    constructor(
        private readonly emailService: EmailService,
        private readonly ticketService: TicketService
    ) {
    }

    @Process('ticket_purchase')
    async ticketPurchase(job: Job): Promise<void> {
        try {
            console.log('purchase job started')
    
            const ticketId = job.data.id
            const ticketData = await this.ticketService.getTicketById({ ticketId: ticketId })
    
            const { id, event, user } = ticketData

    
    
            const emailData = {
                to: user.email,
                subject: 'Ticket Booking Confirmation',
                template: './ticket_purchase',
                context: { name: user.firstname, event, id},
                text: `
                Hi ${user.firstname}, your Ticket for the event: ${event.name} has been succesfully booked. n\
                your ticked id: ${id}
                
                `
            }
            console.log(`purchase email started for ${user.email}`)
            await this.emailService.sendMail(emailData)
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}