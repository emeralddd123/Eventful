import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./ticket.entity";
import { Repository } from "typeorm";
import { CreateUserTicketDto, GetTicketDto, TicketIdDto } from "./dto/ticket.dto";

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket)
        private ticketRepository: Repository<Ticket>,
    ) { }

    async createTicket(createUserTicketDto: CreateUserTicketDto): Promise<Ticket> {
        const ticket = this.ticketRepository.create(createUserTicketDto);
        return this.ticketRepository.save(ticket);
    }

    async getTicketById(ticketId: TicketIdDto): Promise<Ticket> {
        return this.ticketRepository.findOne({ where: { id: ticketId.ticketId }, relations: { event: true, user: true } });
    }

    async getTicket(getTicketDto: GetTicketDto): Promise<Ticket> {
        const { userId, eventId } = getTicketDto;
        return this.ticketRepository.findOne({ where: { userId, eventId } });
    }

    async validateTicket(getTicketDto: GetTicketDto): Promise<boolean> {
        const ticket = await this.getTicket(getTicketDto);
        return !!ticket;
    }
}