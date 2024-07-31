import { UUID } from "crypto";
import { Event } from "src/event/event.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum TicketStatus {
    UNUSED = 'unused',
    USED = 'used',
}

@Entity({ name: 'tickets' })
export class Ticket {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ name: 'user_id' })
    userId: UUID

    @ManyToOne(() => User, user => user.tickets)
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ name: 'event_id' })
    eventId: UUID

    @ManyToOne(() => Event, event => event.tickets)
    @JoinColumn({ name: 'event_id' })
    event: Event

    @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.UNUSED })
    status: TicketStatus;

}