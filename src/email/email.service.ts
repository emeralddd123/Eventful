import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";


@Processor('mail_queue')
@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService,
        private config: ConfigService,
    ) { }


    async generateActivationUrl(activationToken: string): Promise<string> {
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        return `${websiteUrl}/activate-account?token=${activationToken}`;
    }

    @Process('send_activation_mail')
    async sendActivationMail(job: Job): Promise<void> {
        const { email, firstname, activationToken } = job.data
        const url = await this.generateActivationUrl(activationToken)
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Eventful App! Confirm your Email',
            template: './activation',
            context: {
                name: firstname,
                url: url,
            },
        });
    }

    @Process('send_reset_password_mail')
    async sendForgotPasswordMail(job: Job): Promise<void> {
        const { email, firstname, token } = job.data
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        const url = `${websiteUrl}/reset-password/${token}`

        await this.mailerService.sendMail({
            to: email,
            subject: 'Your Forgot Password MAil has arrived from Eventfl App',
            template: './forgot_password',
            context: {
                name: firstname,
                url: url,
            },
        });
    }


    async sendMail(data:ISendMailOptions){
        return this.mailerService.sendMail(data)
    }

}
