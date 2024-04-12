import { Body, Controller, Post, Req, Get, Param, } from "@nestjs/common";
import { TicketService } from "./ticket.service";
import { CreateUserTicketDto, EventIdDto, TicketIdDto } from "./dto/ticket.dto";
import { UUID } from "crypto";



@Controller('ticket')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {

    }

    @Post('create')
    async createTicket(@Req() req: any, @Body() body: EventIdDto) {
        const createUserTicketDto: CreateUserTicketDto = { userId: req.user.id, eventId: body.eventId }
        return this.ticketService.createTicket(createUserTicketDto)
    }

    @Get(':id')
    async getTicketbyId(@Req() req: any, @Param('id') id: UUID) {
        const ticketIdDto: TicketIdDto = { ticketId: id }
        return this.ticketService.getTicketById(ticketIdDto)
    }

    @Post('validate')
    async validateTicket(@Req() req: any, @Body() body: EventIdDto) {
        const getTicketDto: CreateUserTicketDto = { userId: req.user.id, eventId: body.eventId }
        return this.ticketService.validateTicket(getTicketDto)
    }
}