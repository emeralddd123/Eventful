import { Body, Controller, Post, Req, Get, Param, Put, Query, UseInterceptors, Render } from "@nestjs/common";
import { EventService } from "../event.service";
import { CreateEventDto } from "../dto/create-event-dto";
import { UUID } from "crypto";
import { UpdateEventDto } from "../dto/update-event-dto";
import { FetchEventsDto } from "../dto/fetch-events-dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Get('c-my-events')
    async getMyCreatedEvents(@Query() FetchEventsDto: FetchEventsDto, @Req() req: any) {
        const userId: UUID = req.user.id
        return await this.eventService.myCreatedEvents(userId, FetchEventsDto)
    }


    @Post('')
    async create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
        const userId: UUID = req.user.id
        console.log({createEventDto})
        return await this.eventService.create(createEventDto, userId)
    }

    @UseInterceptors(CacheInterceptor)
    @Get('')
    @Render('events')
    async getAll(@Query() fetchEventsDto: FetchEventsDto) {
        const events = await this.eventService.findAll(fetchEventsDto)
        return { events}
    }

    @UseInterceptors(CacheInterceptor)
    @Get(':id')
    async findOne(@Param('id') id: UUID): Promise<any> {
        return await this.eventService.findOne(id)
    }

    @Put(':id')
    async updateOne(@Param('id') id: UUID, @Body() updateEventDto: UpdateEventDto): Promise<any> {
        return await this.eventService.updateOne(updateEventDto, id)
    }

    @Get(':id/tickets')
    async getEventTickets(@Param('id') id: UUID, @Req() req:any ): Promise<any> {
        const userId = req.user.id
        return await this.eventService.getEventTickets(userId, id)
    }



}