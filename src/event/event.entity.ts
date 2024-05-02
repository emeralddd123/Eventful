import { Length } from "@nestjs/class-validator";
import { UUID } from "crypto";
import { Ticket } from "src/ticket/ticket.entity";
import { User } from "src/users/user.entity";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";


export enum EventType {
    PHYSICAL = 'physical',
    VIRTUAL = 'virtual',
}


@Entity({ name: 'events' })
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ length: 255 })
    @Length(3, 255)
    name: string

    @Column()
    @Length(3, 999)
    description: string

    @Column()
    location: string

    @Column({ type: 'enum', enum: EventType, default: 'physical' })
    type: string;

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column({name: 'creator_id'})
    creatorId: UUID

    @ManyToOne(() => User, (creator) => creator.createdEvents)
    @JoinColumn({ name: 'creator_id' })
    creator: User;

    @OneToMany(() => Ticket, (ticket) => ticket.event)
    tickets: Ticket[]

    @Column({ default: false})
    notified: boolean


    // @ManyToMany(() => User, user => user.attendedEvents)
    // @JoinTable({
    //     name: 'user_event',
    //     joinColumn: {
    //         name:'event_id',
    //         referencedColumnName: 'id',
    //         foreignKeyConstraintName: 'event_user_event_id'
    //     },
    //     inverseJoinColumn: {
    //         name: 'user_id',
    //         referencedColumnName: 'id',
    //         foreignKeyConstraintName: 'event_user_user_id'
    //     }
    // })
    // attendee: User[];


}