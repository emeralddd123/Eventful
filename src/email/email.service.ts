import { Process, Processor } from "@nestjs/bull";
import { ConfigService } from "@nestjs/config";
import { Job } from "bull";
import * as nodemailer from 'nodemailer'



@Processor('mail_queue')
export class EmailService {
    private readonly transporter: nodemailer.Transporter
    constructor(
        private config: ConfigService,
    ) {
        const email_config = {
            service: this.config.get('EMAIL_SERVICE'),
            host: this.config.get('EMAIL_HOST'),
            port: this.config.get('EMAIL_PORT') || 587,
            secure: this.config.get('EMAIL_SECURE') || false,
            auth: {
                user: this.config.get('EMAIL_USER'),
                pass: this.config.get('EMAIL_PASSWORD')
            }
        }

        this.transporter = nodemailer.createTransport(email_config)
    }

    async sendMail(data: nodemailer.SendMailOptions): Promise<void> {
        try {
            await this.transporter.sendMail(data);
        } catch (err) {
            throw err;
        }
    }

    async generateActivationUrl(activationToken: string): Promise<string> {
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        return `${websiteUrl}/activate-account?token=${activationToken}`;
    }

    @Process('send_activation_mail')
    async sendActivationMail(job: Job): Promise<void> {
        const { email, firstname, activationToken } = job.data
        console.log(job.data)
        const activationUrl = await this.generateActivationUrl(activationToken);
        const data = {
            from: this.config.get('EMAIL_USER'),
            to: email,
            subject: `Email Activation Message. You signed Up at Eventful`,
            text: `
            Dear ${firstname},
    
            Welcome to Eventful, We're excited to have you as a part of our community. To get started, please activate your account by clicking the activation link below:
    
            ${activationUrl}
    
            If you didn't request this activation, please ignore this message. Your account won't be activated until you click the link above.
    
            Thank you for choosing Eventful. We look forward to providing you with a great experience.
    
            Best regards,
            The Eventful Team
          `,
        };
        this.sendMail(data);
    }

    @Process('send_forgot_password_mail')
    async sendForgotPasswordMail(job: Job): Promise<void> {
        const { email, firstname, token } = job.data
        const websiteUrl = this.config.get('WEBSITE_URL') || 'http://localhost:3000';
        const url = `${websiteUrl}/reset-password/${token}`

        const data = {
            'from': this.config.get('EMAIL_USER'),
            'to': email,
            'subject': 'Password Reset Request',
            'text': ` Hi ${firstname},
    
            You've requested a password reset for your account. To reset your password, please visit the following link:
    
            Reset Your Password: ${url}
    
            If you didn't request a password reset, you can ignore this email.
    
            Best regards,
            The Eventful Team
            `
        }

        this.sendMail(data)
    }

}