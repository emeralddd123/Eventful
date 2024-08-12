import { Module } from "@nestjs/common";
import { AuthApiController } from "./controllers/auth.api.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/user.entity";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./controllers/auth.web.controller";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { LocalStrategy } from "./strategies/local.strategy";

const jwtConfig: JwtModuleOptions = {
    secret: process.env.SECRET_KEY,
    signOptions: { expiresIn: '1h' },
};
@Module({
    imports: [TypeOrmModule.forFeature([User]), 
    JwtModule.register(jwtConfig),
    ConfigModule.forRoot({isGlobal: true})],
    controllers: [AuthApiController, ],
    providers: [AuthService, JwtStrategy, LocalStrategy],
})

export class AuthModule { }
