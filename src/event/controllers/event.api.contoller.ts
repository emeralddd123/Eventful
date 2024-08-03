import { Body, Controller, Post, Req, Get, Param, Put, Query, UseInterceptors, UseGuards } from "@nestjs/common";
import { EventService } from "../event.service";
import { CreateEventDto } from "../dto/create-event-dto";
import { UUID } from "crypto";
import { UpdateEventDto } from "../dto/update-event-dto";
import { FetchEventsDto } from "../dto/fetch-events-dto";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { ResponseInterceptor } from "src/common/response.interceptors";

@Controller('api/v1/events')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ResponseInterceptor)
export class EventApiController {
    constructor(private readonly eventService: EventService) { }

    @Get('c-my-events')
    async getMyCreatedEvents(@Query() FetchEventsDto: FetchEventsDto, @Req() req: any) {
        const userId: UUID = req.user.id
        console.log({userId})
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
    async getAll(@Query() fetchEventsDto: FetchEventsDto) {
        return await this.eventService.findAll(fetchEventsDto)
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
