import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

export enum UserRole {
    ADMIN = "admin",
    USER = "user",
    MODERATOR = "moderator",
}

@Entity('Users')
export class UserModel {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({unique:true})
    email: string

    @Column()
    password:string

    @Column({nullable:true})
    firstname: string

    @Column({nullable:true})
    lastname: string

    @Column({type: "set", enum:UserRole, default: [UserRole.USER] })
    roles: UserRole[]

    @Column({type: Boolean, default: false})
    isActive: boolean

}