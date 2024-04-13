import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller'
import { UserService } from './user.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from 'src/email/email.module';
import { BullModule } from '@nestjs/bull';
import { JwtModuleOptions } from '@nestjs/jwt';

const jwtConfig: JwtModuleOptions = {
  secret: process.env.SECRET_KEY,
  signOptions: { expiresIn: '1h' },

};
@Module({
  imports: [TypeOrmModule.forFeature([User]),
  BullModule.registerQueue({name: 'mail_queue'}),
    JwtModule.register(jwtConfig),
    ConfigModule,
    EmailModule,
  ],
  controllers: [UserController],
  providers: [UserService,],
  exports: [UserService]
})
export class UserModule { }
