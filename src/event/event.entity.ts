import { Length } from "@nestjs/class-validator";
import { UserModel } from "src/users/user.entity";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


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
    

    @ManyToOne(() => UserModel, (user) => user.events)
    @JoinColumn({ name: 'creatorId' })
    creator: UserModel;

}