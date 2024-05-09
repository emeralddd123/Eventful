import { Body, Controller, Post, Req, Get, Param, UseInterceptors, } from "@nestjs/common";
import { TicketService } from "../ticket.service";
import { CreateUserTicketDto, EventIdDto, TicketIdDto, ValidateTicketDto } from "../dto/ticket.dto";
import { UUID } from "crypto";
import { CacheInterceptor } from "@nestjs/cache-manager";



@Controller('api/v1/ticket')
export class TicketApiController {
    constructor(
        private readonly ticketService: TicketService) {

    }

    @Get('me')
    async getMyTickets(@Req() req: any) {
        const userId: UUID = req.user.id
        return this.ticketService.getMyTickets(userId)
    }

    @Post('create')
    async createTicket(@Req() req: any, @Body() body: EventIdDto) {
        const createUserTicketDto: CreateUserTicketDto = { userId: req.user.id, eventId: body.eventId }
        return this.ticketService.createTicket(createUserTicketDto)
    }

    @UseInterceptors(CacheInterceptor)
    @Get(':id')
    async getTicketbyId(@Req() req: any, @Param('id') id: UUID) {
        const ticketIdDto: TicketIdDto = { ticketId: id }
        return this.ticketService.getTicketById(ticketIdDto)
    }

    @Post('validate')
    async validateTicket(@Req() req: any, @Body() validateTicketDto: ValidateTicketDto) {
        validateTicketDto.userId = req.user.id
        return this.ticketService.validateTicket(validateTicketDto)
    }


}