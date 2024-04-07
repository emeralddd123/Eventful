import { Length } from "@nestjs/class-validator";
import { UserModel } from "src/users/user.entity";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";


export enum EventType {
    PHYSICAL = 'physical',
    VIRTUAL = 'virtual',
}


@Entity('Events')
export class EventModel {
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

    @ManyToOne(() => UserModel, (user) => user.createdEvents)
    @JoinColumn({ name: 'creatorId' })
    creator: UserModel;

    @ManyToMany(() => UserModel, user => user.attendedEvents)
    @JoinTable()
    attendee: UserModel[];


}