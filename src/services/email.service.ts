import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from 'nodemailer'


@Injectable()
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

      async sendActivationMail(email: string, firstname: string, activationToken: string): Promise<void> {
        const activationUrl = await this.generateActivationUrl(activationToken);
        const data = {
          from: this.config.get('EMAIL_USER'),
          to: email,
          subject: `Email Activation Message. You signed Up at UpBlog`,
          text: `
            Dear ${firstname},
    
            Welcome to Eventful, We're excited to have you as a part of our community. To get started, please activate your account by clicking the activation link below:
    
            ${activationUrl}
    
            If you didn't request this activation, please ignore this message. Your account won't be activated until you click the link above.
    
            Thank you for choosing Upblog. We look forward to providing you with a great experience.
    
            Best regards,
            The Eventful Team
          `,
        };
        this.sendMail(data);
      }

      async sendForgotPasswordMail (email:string, firstname:string, token:string): Promise<void> {
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