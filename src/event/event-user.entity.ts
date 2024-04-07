import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserModel } from '../users/user.entity';
import { EventModel } from './event.entity';

@Entity()
export class EventUser {
    @PrimaryGeneratedColumn('uuid')
    id: string

  @ManyToOne(() => UserModel, user => user.attendedEvents)
  user: UserModel;

  @ManyToOne(() => EventModel, event => event.attendee)
  event: EventModel;
}