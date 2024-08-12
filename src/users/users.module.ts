import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserApiController } from './controllers/user.api.controller'
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { JwtModuleOptions } from '@nestjs/jwt';
import { UserController } from './controllers/user.web.controller';

const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY,
  signOptions: { expiresIn: '1h' },

};
@Module({
  imports: [TypeOrmModule.forFeature([User]),
    JwtModule.register(jwtConfig),
    ConfigModule,
    EmailModule,
  ],
  controllers: [UserApiController, UserController],
  providers: [UserService,],
  exports: [UserService]
})
export class UserModule { }
