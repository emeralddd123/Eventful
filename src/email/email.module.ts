import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EmailService } from "./email.service";
import { BullModule } from "@nestjs/bull";


@Module({
    imports: [ConfigModule, BullModule.forRoot({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
    }),],
    providers: [EmailService, ],
    exports: [EmailService]
})


export class EmailModule { }