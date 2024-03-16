import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { UserModel } from "src/users/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { LoginDto } from "./dto/login-dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository: Repository<UserModel>,
        private jwt: JwtService,
        private config: ConfigService,

    ) { }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto
        const userExists = await this.userRepository.findOne({ where: { email: email } })
        const hashedPassword = await this.hashPassword(password)

        if (!userExists) {
            return { status: 401, message: "Incorrect login credentials" };
        }

        if (userExists.password !== hashedPassword){
            return { status: 401, message: "Incorrect login credentials" };
        } else {
            const userData = { ...userExists}
            delete userData['password']

            const token = this.jwt.sign({ user: userData });

            return { status: 201, message: 'Success', token };
        }
    }

}