import { Module,MiddlewareConsumer, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Event } from "./event.entity";
import { EventService } from "./event.service";
import { EventController } from "./event.contoller";
import { UserModule } from "src/users/users.module";
import { OwnershipMiddleware } from "src/common/event-owner-middleware";
import { User } from "src/users/user.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Event, User]), UserModule, ],
    controllers: [EventController],
    providers: [EventService]

})

export class EventModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(OwnershipMiddleware).forRoutes({ path: 'events', method: RequestMethod.PUT });
      }
 }