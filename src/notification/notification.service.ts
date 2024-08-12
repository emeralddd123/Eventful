import { TicketService } from "src/ticket/ticket.service";
import { EmailService } from "src/email/email.service";
import { ISendMailOptions } from "@nestjs-modules/mailer";
import * as qrcode from 'qrcode'
import { UserService } from "src/users/user.service";
import { EventService } from "src/event/event.service";
import { OnEvent } from "@nestjs/event-emitter";

export class NotificationService {
    private websiteUrl: string
    constructor(
        private readonly emailService: EmailService,
        private readonly eventService: EventService,
        private readonly ticketService: TicketService,
        private readonly userService: UserService,

    ) {
        this.websiteUrl = process.env.WEBSITE_URL || 'http://localhost:3000'

    }

    async generateQrCode(url: string): Promise<string> {
        try {
            const qrCodeDataURL = await qrcode.toDataURL(url);
            return qrCodeDataURL
        } catch (error) {
            throw new Error('Failed to generate QR code.');
        }
    }


    @OnEvent('send_ticket_purchase_mail')
    async ticketPurchase(data:any): Promise<void> {
        try {
            const { ticketId, userId } = data
            const user = await this.userService.findOneById(userId)
            const ticketData = await this.ticketService.getTicketById({ ticketId: ticketId })

            const { id, event } = ticketData
            const verificationUrl = `${this.websiteUrl}/ticket/${ticketId}/check`
            const qrc = await this.generateQrCode(verificationUrl)
            const emailData: ISendMailOptions = {
                to: user.email,
                subject: 'Ticket Booking Confirmation',
                template: 'ticket_purchase',
                context: { name: user.firstname, event, id, qrCode: qrc, qUrl: verificationUrl },
                date: Date.now().toString(),
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

    @OnEvent('send_event_reminder')
    async eventReminder(data:any) {
        try {
            console.log(`event_reminder job strated, `)

            const eventId = data.eventId;
            const userIdArray: Array<string> = data.userIdArray;

            const event = await this.eventService.findOne(eventId);

            userIdArray.forEach(async (userId) => {
                console.log({ userId })
                const user = await this.userService.findOneById((userId))
                const emailData: ISendMailOptions = {
                    to: user.email,
                    subject: 'Event Reminder',
                    template: 'event_reminder',
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
