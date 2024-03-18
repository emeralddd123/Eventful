import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EventModel } from "./event.entity";
import { Repository } from "typeorm";
import { CreateEventDto } from "./dto/create-event-dto";
import { UserService } from "src/users/user.service";
import { UUID } from "crypto";


@Injectable()
export class EventService {
    constructor(
        @InjectRepository(EventModel)
        private readonly eventRepository: Repository<EventModel>,
        private readonly userService: UserService

    ) { }

    async create(createEventDto: CreateEventDto, userId: UUID): Promise<EventModel> {
        const event = this.eventRepository.create(createEventDto);


        const creator = await this.userService.findOneById(userId)
        if (!creator) {
            throw new Error('Creator user not found');
        }
        event.creator = creator;


        const savedEvent = await this.eventRepository.save(event);
        return savedEvent;
    }
}