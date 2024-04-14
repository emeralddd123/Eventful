import { Event } from 'src/event/event.entity'
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Ticket } from 'src/ticket/ticket.entity'

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator",
}

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column({ select: true })
    password: string

    @Column({ nullable: true })
    firstname: string

    @Column({ nullable: true })
    lastname: string

    @Column({ type: "set", enum: UserRole, default: [UserRole.USER] })
    roles: UserRole[]

    @Column({ type: Boolean, default: false })
    isActive: boolean

    async isCorrectPassword(password: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return false;
        }
    }

    @OneToMany(() => Event, (event) => event.creator)
    createdEvents: Event[];

    @OneToMany(() => Ticket, (ticket) => ticket.event)
    tickets: Ticket[]

}