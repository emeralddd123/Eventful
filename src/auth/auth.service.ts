import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService, } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { LoginDto } from "./dto/login-dto";
import { JwtModuleOptions } from "@nestjs/jwt";


@Injectable()
export class AuthService {
    private jwtOptions: JwtModuleOptions;
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwt: JwtService,
    ) {
        this.jwtOptions = {
            secret: process.env.SECRET_KEY,
        }
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto
        const userExists = await this.userRepository.findOne({ where: { email: email } })

        if (!userExists) {
            return { status: 401, message: "Incorrect login credentials" };
        }
        const correctPassword = await userExists.isCorrectPassword(password)
        if (!correctPassword) {
            return { status: 401, message: "Incorrect login credentials" };
        } else {
            const userData = { ...userExists }
            delete userData['password']


            const token = await this.jwt.signAsync({ user: userData }, this.jwtOptions);

            return { status: 201, message: 'Success', token };
        }
    }


    async validateUser({ email, password }: LoginDto) {
        const userExists = await this.userRepository.findOne({ where: { email: email } })
        if (!userExists) return null;
        const correctPassword = await userExists.isCorrectPassword(password)
        if (!correctPassword) throw new UnauthorizedException('Invalid credentials');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: passwordu, ...user } = userExists;
        return await this.jwt.signAsync({ user: user }, this.jwtOptions);
    }
}