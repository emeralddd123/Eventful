import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./ticket.entity";
import { Repository } from "typeorm";
import { CreateUserTicketDto, GetTicketDto, TicketIdDto, ValidateTicketDto } from "./dto/ticket.dto";
import { UUID } from "crypto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
        @InjectQueue('notification_queue')
        private notificationQueue: Queue,
    ) { }

    async createTicket(createUserTicketDto: CreateUserTicketDto): Promise<Ticket> {
        const ticket = this.ticketRepository.create(createUserTicketDto);
        this.notificationQueue.add('ticket_purchase', { ticketId: ticket.id, userId: createUserTicketDto.userId })
        return this.ticketRepository.save(ticket);
    }

    async getTicketById(ticketId: TicketIdDto): Promise<Ticket> {
        return this.ticketRepository.findOne({ where: { id: ticketId.ticketId }, relations: { event: true, user: true } });
    }

    async getTicket(getTicketDto: GetTicketDto): Promise<Ticket> {
        const { userId, eventId } = getTicketDto;
        return this.ticketRepository.findOne({ where: { userId, eventId } });
    }

    async validateTicket(validateTicketDto: ValidateTicketDto): Promise<boolean> {
        const { userId, ticketId } = validateTicketDto
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId, userId: userId } })
        return !!ticket;
    }

    async getMyTickets(userId: UUID): Promise<Ticket[]> {
        const tickets = this.ticketRepository.find({ where: { userId: userId }, relations: { event: true } })
        if (!tickets) {
            throw new HttpException('No Tickets Found', HttpStatus.NOT_FOUND)
        }
        return tickets
    }
}