import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { TicketService } from "src/ticket/ticket.service";
import { EmailService } from "src/email/email.service";
import { ISendMailOptions } from "@nestjs-modules/mailer";
import { ConfigService } from "@nestjs/config";
import QRCode from 'qrcode'


@Processor('notification_queue')
export class NotificationService {
    private websiteUrl: string
    constructor(
        private readonly emailService: EmailService,
        private readonly ticketService: TicketService,
        private readonly config: ConfigService,


    ) {
        this.websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000'

    }




    @Process('ticket_purchase')
    async ticketPurchase(job: Job): Promise<void> {
        try {
            console.log(job.data)
            console.log('purchase job started')

            const ticketId = job.data.id
            const ticketData = await this.ticketService.getTicketById({ ticketId: ticketId })

            const { id, event, user } = ticketData
            const verificationUrl = JSON.stringify(`${this.websiteUrl}/ticket/verify?id=${ticketId}&userId=${user.id}&eventId=${event.id}`)
            // const qrc = await this.generateQRCode(verificationUrl)
            let qrc
            const emailData: ISendMailOptions = {
                to: user.email,
                subject: 'Ticket Booking Confirmation',
                template: './ticket_purchase',
                context: { name: user.firstname, event, id, qrCode:qrc },
                date: Date.now().toString(),
                text: `
                Hi ${user.firstname}, your Ticket for the event: ${event.name} has been succesfully booked. n\
                your ticked id: ${id}
                
                `
            }
            console.log(`purchase email started for ${user.email}`)
            await this.emailService.sendMail(emailData)
            console.log(`purchase email sent sucessfully to ${user.email}`)
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async generateQRCode(data:Text){
        try {
            return await QRCode.toDataURL(JSON.stringify(data))
        } catch (err) {
            console.log(err)
        }
    }
}