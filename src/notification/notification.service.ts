import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { TicketService } from "src/ticket/ticket.service";
import { EmailService } from "src/email/email.service";
import { ISendMailOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import * as qrcode from 'qrcode'
import { UserService } from "src/users/user.service";
import { EventService } from "src/event/event.service";
import { TicketPurchaseJobData } from "src/ticket/dto/ticket.dto";

@Processor('notification_queue')
export class NotificationService {
    private websiteUrl: string
    constructor(
        private readonly emailService: EmailService,
        private readonly eventService: EventService,
        private readonly ticketService: TicketService,
        private readonly config: ConfigService,
        private readonly userService: UserService


    ) {
        this.websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000'

    }

    async generateQrCode(url: string): Promise<string> {
        try {
            const qrCodeDataURL = await qrcode.toDataURL(url);
            return qrCodeDataURL
        } catch (error) {
            throw new Error('Failed to generate QR code.');
        }
    }


    @Process('ticket_purchase')
    async ticketPurchase(job: Job<TicketPurchaseJobData>): Promise<void> {
        try {
            const { ticketId, userId } = job.data
            const user = await this.userService.findOneById(userId)
            const ticketData = await this.ticketService.getTicketById({ ticketId: ticketId })

            const { id, event } = ticketData
            const verificationUrl = `${this.websiteUrl}/ticket/${ticketId}/check`
            const qrc = await this.generateQrCode(verificationUrl)
            const emailData: ISendMailOptions = {
                to: user.email,
                subject: 'Ticket Booking Confirmation',
                template: './ticket_purchase',
                context: { name: user.firstname, event, id, qrCode: qrc, qUrl: verificationUrl },
                date: Date.now().toString(),
                attachDataUrls: true,
                attachments: [{ filename: 'Ticket_QR_code.png', path: qrc}, ],
                text: `
                Hi ${user.firstname}, your Ticket for the event: ${event.name} has been succesfully booked. n\
                your ticked id: ${id}
                
                `
            }
            console.log(`purchase email started for ${user.email}`)
            // console.log({uri:qrc, encUri:encodeURI(qrc)})
            await this.emailService.sendMail(emailData)
            console.log(`purchase email sent sucessfully to ${user.email}`)
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    @Process('event_reminder')
    async eventReminder(job: Job) {
        try {
            console.log(`event_reminder job strated, `)

            const eventId = job.data.eventId;
            const userIdArray: Array<string> = job.data.userIdArray;

            const event = await this.eventService.findOne(eventId);

            userIdArray.forEach(async (userId) => {
                console.log({ userId })
                const user = await this.userService.findOneById((userId))
                const emailData: ISendMailOptions = {
                    to: user.email,
                    subject: 'Event Reminder',
                    template: './event_reminder',
                    context: { name: user.firstname, event, },
                    date: Date.now().toString(),
                    text: `
                Hi ${user.firstname}, just a reminder that event ${event.name} will commence
                by ${event.startDate}.    `
                }

                console.log(`event reminder email started for ${user.email}`)
                await this.emailService.sendMail(emailData)
            })


        } catch (error) {
            console.error('Error sending email:', error);
        }

    }


}
