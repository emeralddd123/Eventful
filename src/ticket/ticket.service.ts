import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./ticket.entity";
import { Repository } from "typeorm";
import { CreateUserTicketDto, GetTicketDto, TicketIdDto, TicketPurchaseJobData,  } from "./dto/ticket.dto";
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
        const savedTicket = await this.ticketRepository.save(ticket);
        const ticketPurchaseData: TicketPurchaseJobData = { ticketId: savedTicket.id, userId: createUserTicketDto.userId }
        this.notificationQueue.add('ticket_purchase', ticketPurchaseData)
        return savedTicket;
    }

    async getTicketById(ticketId: TicketIdDto): Promise<Ticket> {
        return this.ticketRepository.findOne({ where: { id: ticketId.ticketId }, relations: { event: true, user: true } });
    }

    async getTicket(getTicketDto: GetTicketDto): Promise<Ticket> {
        const { userId, eventId } = getTicketDto;
        return this.ticketRepository.findOne({ where: { userId, eventId } });
    }

    async checkTicket(ticketId:UUID): Promise<any> {
        const ticket = await this.ticketRepository.findOne({ where: { id: ticketId } })
        if (!ticket) {
            throw new NotFoundException('Ticket not found');
        }
        return ticket;
    }

    async getMyTickets(userId: UUID): Promise<Ticket[]> {
        const tickets = this.ticketRepository.find({ where: { userId: userId }, relations: { event: true } })
        if (!tickets) {
            throw new HttpException('No Tickets Found', HttpStatus.NOT_FOUND)
        }
        return tickets
    }
}
