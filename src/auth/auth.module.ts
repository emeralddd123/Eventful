import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModel } from "src/users/user.entity";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

const jwtConfig: JwtModuleOptions = {
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: '1h' },
};
@Module({
    imports: [TypeOrmModule.forFeature([UserModel]), 
    JwtModule.register(jwtConfig),
    ConfigModule.forRoot({isGlobal: true})],
    controllers: [AuthController],
    providers: [AuthService],
})

export class AuthModule { }
