import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventModel } from "./event.entity";
import { EventService } from "./event.service";
import { EventController } from "./event.contoller";
import { UserModule } from "src/users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([EventModel]), UserModule, ],
    controllers: [EventController],
    providers: [EventService]

})

export class EventModule { }