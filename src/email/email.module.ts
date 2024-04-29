import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EmailService } from "./email.service";
import { BullModule } from "@nestjs/bull";
import { MailerModule } from "@nestjs-modules/mailer";
import { join } from "path";
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Global()
@Module({
    imports: [ConfigModule, BullModule.forRoot({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    }), MailerModule.forRootAsync({
        useFactory: async (config: ConfigService) => ({
            transport: {
                pool: true,
                host: config.get('MAIL_HOST'),
                secure: true,
                port: config.get('MAIL_PORT'),
                auth: {
                    user: config.get('MAIL_USER'),
                    pass: config.get('MAIL_PASSWORD'),
                },
            },
            defaults: {
                from: `"No Reply" <${config.get('MAIL_FROM')}>`,
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new EjsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
        inject: [ConfigService],
    }),],
    providers: [EmailService,],
    exports: [EmailService]
})


export class EmailModule { }