import { Event } from 'src/event/event.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, ManyToMany} from 'typeorm'
import * as bcrypt from 'bcrypt'

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator",
}

@Entity('User')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    email: string

    @Column({select: true})
    password: string

    @Column({ nullable: true })
    firstname: string

    @Column({ nullable: true })
    lastname: string

    @Column({ type: "set", enum: UserRole, default: [UserRole.USER] })
    roles: UserRole[]

    @Column({ type: Boolean, default: false })
    isActive: boolean

    async isCorrectPassword(password:string): Promise<boolean> {
        try {
            console.log({password, hpassword: this.password})
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return false;
        }
    }

    @ManyToOne(() => Event, (event) => event.creator) 
    createdEvents: Event[];

    @ManyToMany(() => Event, event => event.attendee)
    @JoinTable()
    attendedEvents: Event[];


}