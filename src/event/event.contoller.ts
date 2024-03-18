import { Body, Controller, Post, Req, Get } from "@nestjs/common";
import { EventService } from "./event.service";
import { CreateEventDto } from "./dto/create-event-dto";
import { UUID } from "crypto";

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService){ }

    @Post('')
    async create(@Body() createEventDto: CreateEventDto, @Req() req: any) { 
        const userId: UUID = req.user.id
        return await this.eventService.create(createEventDto, userId)
    }

    @Get('')
    getAll(){
        return({message: 'list of all events'})
    }
}