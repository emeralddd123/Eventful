import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OnEvent } from "@nestjs/event-emitter";


@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService,
        private config: ConfigService,
    ) { }


    async generateActivationUrl(activationToken: string): Promise<string> {
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        return `${websiteUrl}/activate-account?token=${activationToken}`;
    }

    @OnEvent('send_activation_mail')
    async sendActivationMail(data: any): Promise<void> {
        const { email, firstname, activationToken } = data
        const url = await this.generateActivationUrl(activationToken)
        await this.mailerService.sendMail({
            to: email,
            subject: 'Welcome to Eventful App! Confirm your Email',
            template: 'activation',
            context: {
                name: firstname,
                url: url,
            },
        });
    }

    @OnEvent('send_forgot_password_mail')
    async sendForgotPasswordMail(data: any): Promise<void> {
        console.log(`forgot password mail recieved`)
        const { email, firstname, token } = data
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        const url = `${websiteUrl}/reset-password/${token}`

        await this.mailerService.sendMail({
            to: email,
            subject: 'Forgot Password Mail: Eventful App',
            template: 'forgot_password',
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
